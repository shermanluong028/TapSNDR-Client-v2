import React, { useState, useEffect } from "react";
import {
  walletService,
  Wallet,
  CryptoTransaction,
  TokenType,
  SendTransactionDto,
} from "../services/wallet.service";

interface ProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onComplete: () => void;
}

interface GroupedTransaction {
  user_id_from: number;
  user_id_to: number;
  address_from: string;
  address_to: string;
  token_type: string;
  total_amount: number;
  transactions: CryptoTransaction[];
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const processTransactions = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      setProgress(0);

      // Get all pending transactions
      const transactions = await walletService.getCryptoTransactions();
      const pendingTransactions = transactions.filter(
        (t) => t.status === "pending"
      );

      if (pendingTransactions.length === 0) {
        onComplete();
        return;
      }

      // Group transactions by user_id_from, user_id_to, address_from, address_to, and token_type
      const groupedTransactions = new Map<string, GroupedTransaction>();

      pendingTransactions.forEach((transaction) => {
        if (
          !transaction.user_id_from ||
          !transaction.user_id_to ||
          !transaction.address_from ||
          !transaction.address_to
        ) {
          console.warn(
            "Skipping transaction with missing required fields:",
            transaction
          );
          return;
        }

        const key = `${transaction.user_id_from}-${transaction.user_id_to}-${transaction.address_from}-${transaction.address_to}-${transaction.token_type}`;

        if (!groupedTransactions.has(key)) {
          groupedTransactions.set(key, {
            user_id_from: transaction.user_id_from,
            user_id_to: transaction.user_id_to,
            address_from: transaction.address_from,
            address_to: transaction.address_to,
            token_type: transaction.token_type,
            total_amount: 0,
            transactions: [],
          });
        }

        const group = groupedTransactions.get(key)!;
        group.total_amount += Number(transaction.amount);
        group.transactions.push(transaction);
      });

      // Process each group of transactions
      let processedCount = 0;
      const totalGroups = groupedTransactions.size;

      for (const [_, group] of groupedTransactions) {
        try {
          // Create a single transaction for the group
          const transactionData: SendTransactionDto = {
            address_to: group.address_to,
            amount: group.total_amount,
            token_type: group.token_type as TokenType,
            description: `Batch transfer of ${group.total_amount} ${group.token_type}`,
          };

          // Process the transaction using Web3
          // const result = await walletService.sendTransaction(transactionData);

          // Update all original transactions with the new transaction hash
          // for (const transaction of group.transactions) {
          //   await walletService.updateTransaction(transaction.id, {
          //     ...transaction,
          //     status: "COMPLETED",
          //     transaction_hash: result.transaction_hash,
          //   });
          // }

          processedCount++;
          setProgress((processedCount / totalGroups) * 100);
        } catch (error) {
          console.error("Error processing transaction group:", error);
          setError("Failed to process some transactions. Please try again.");
        }
      }

      onComplete();
    } catch (error) {
      console.error("Error in processTransactions:", error);
      setError("An error occurred while processing transactions.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // processTransactions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
          isDarkMode ? "bg-[#1F2937] text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Processing Transactions</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-opacity-10 ${
              isDarkMode ? "hover:bg-gray-300" : "hover:bg-gray-700"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* <div className="mb-4">
          {isProcessing ? (
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-center">
                Processing transactions... {Math.round(progress)}%
              </p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="text-green-500 text-center">
              All transactions processed successfully!
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ProcessingModal;
