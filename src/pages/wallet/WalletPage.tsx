import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  walletService,
  Wallet,
  Transaction,
} from "../../services/wallet.service";
import { useAuth } from "../../hooks/useAuth";

export default function WalletPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState<
    "DEPOSIT" | "WITHDRAW"
  >("DEPOSIT");

  const { data: wallets, isLoading: isLoadingWallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.getWallets,
  });

  const customerWallet = wallets?.find((w) => w.type === "CUSTOMER");
  const fulfillerWallet = wallets?.find((w) => w.type === "FULFILLER");

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", customerWallet?.id],
    queryFn: () =>
      customerWallet ? walletService.getTransactions(customerWallet.id) : [],
    enabled: !!customerWallet,
  });

  const createTransactionMutation = useMutation({
    mutationFn: walletService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setAmount("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerWallet || !amount) return;

    createTransactionMutation.mutate({
      wallet_id: customerWallet.id,
      amount: parseFloat(amount),
      type: transactionType,
      token_type: "USDC",
      description: `${transactionType} transaction`,
    });
  };

  if (isLoadingWallets) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Wallet */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Customer Wallet
            </h3>
            <div className="mt-4">
              <p className="text-3xl font-bold text-primary-600">
                ₱{customerWallet?.balance.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Fulfiller Wallet */}
        {user?.roles.some((role) => role.name === "FULFILLER") && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Fulfiller Wallet
              </h3>
              <div className="mt-4">
                <p className="text-3xl font-bold text-primary-600">
                  ₱{fulfillerWallet?.balance.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">New Transaction</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="transactionType"
                className="block text-sm font-medium text-gray-700"
              >
                Transaction Type
              </label>
              <select
                id="transactionType"
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(e.target.value as "DEPOSIT" | "WITHDRAW")
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAW">Withdraw</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={createTransactionMutation.isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createTransactionMutation.isPending
                ? "Processing..."
                : "Submit Transaction"}
            </button>
          </form>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Transaction History
          </h3>
          {isLoadingTransactions ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {transactions?.map((transaction) => (
                    <li key={transaction.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {transaction.type}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === "DEPOSIT"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type === "DEPOSIT" ? "+" : "-"}₱
                            {transaction.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
