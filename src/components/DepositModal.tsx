import React, { useState, useEffect } from "react";
import { walletService, Wallet } from "../services/wallet.service";
import SpinnerIconSVG from "./common/SpinnerIconSVG";
import { useAlert } from "../contexts/AlertContext";
import { sendTelegramMessage } from "../services/telegram.service";
import { useAuth } from "../hooks/useAuth";
import { User } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./wallet/wallet-provider";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (
    amount: number,
    adminAddress: string,
    adminUserId: number,
    walletAddress: string
  ) => void;
  isCancelDeposit?: boolean;
  isDarkMode?: boolean;
  selectedWallet?: Wallet | null;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDeposit,
  isCancelDeposit = false,
  isDarkMode = false,
  selectedWallet = null,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [adminWallets, setAdminWallets] = useState<Wallet[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedAdminAddress, setSelectedAdminAddress] = useState<string>("");
  const [selectedWalletAddress, setSelectedWalletAddress] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  const { user } = useAuth() as { user: User | null };
  const navigate = useNavigate();
  const walletContext = useWallet();

  useEffect(() => {
    if (isCancelDeposit) {
      setIsLoading(false);
    }
  }, [isCancelDeposit]);

  const processDeposit = async () => {
    if (isOpen) {
      setError(null);
      try {
        if (!walletContext.account) {
          showAlert("info", "Please connect your wallet first");
          onClose();
          return;
        }
        setIsLoading(true);
        const wallet = await walletService.getDepositWallet(
          amount,
          walletContext.account
        );
        if (!wallet.status) {
          showAlert("error", wallet.error);
          // send telegram notification
          await sendTelegramMessage(
            -1002598717888,
            wallet.error,
            process.env.TELEGRAM_BOT_TOKEN
          );
          onClose();
          return;
        }
        if (wallet.data) {
          if (user === null) {
            navigate("/login");
            return;
          }
          setSelectedAdminAddress(wallet.data);
          setSelectedWalletAddress(wallet.data);
          await onDeposit(
            parseFloat(amount),
            wallet.data,
            selectedUserId,
            wallet.data
          );
        } else {
          setError("No admin wallets available");
        }
      } catch (err) {
        setError("Failed to load admin wallets");
        console.error("Error fetching admin wallets:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        return;
      }
      await processDeposit();
    } catch (error) {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 w-[600px] shadow-xl`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Deposit Funds
          </h2>
          <button
            onClick={onClose}
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 text-left mb-2" role="alert">
          <p className="font-bold">Do not close the site until deposit is completed.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Amount (USDC)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter amount to deposit"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 flex items-center rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-white hover:bg-gray-300"
              }`}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 flex items-center rounded-lg ${
                isLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isLoading && <SpinnerIconSVG />}
              {isLoading ? "Processing..." : "Deposit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
