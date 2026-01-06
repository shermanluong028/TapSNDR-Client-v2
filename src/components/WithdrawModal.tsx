import React, { useState, useEffect } from "react";
import { Wallet, walletService } from "../services/wallet.service";
import { useAlert } from "../contexts/AlertContext";
import SpinnerIconSVG from "./common/SpinnerIconSVG";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (
    amount: number,
    adminAddress: string,
    to: string | null,
    privateKey: string,
    adminUserId: number
  ) => void;
  isDarkMode: boolean;
  selectedWallet: Wallet | null;
  toAddress: string | null;
  privateKey: string;
  balance: number;
  gasFee: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onWithdraw,
  isDarkMode,
  selectedWallet,
  toAddress,
  privateKey,
  balance,
  gasFee,
}) => {
  const { showAlert } = useAlert();
  const [amount, setAmount] = useState<string>("");
  const [adminBalance, setAdminBalance] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminWallets, setAdminWallets] = useState<Wallet[]>([]);
  const [selectedAdminAddress, setSelectedAdminAddress] = useState<string>("");
  const [selectedAdminUserId, setSelectedAdminUserId] = useState<number>(0);

  // Ensure balance and gasFee are numbers
  const numericGasFee = Number(gasFee);

  useEffect(() => {
    const fetchAdminWallets = async () => {
      if (isOpen) {
        setIsLoading(true);
        setError("");
        try {
          // const wallets = await walletService.getAdminWallets();
          // setAdminWallets(wallets);
          // if (wallets.length > 0) {
          //   setSelectedAdminAddress(wallets[0].address);
          //   setSelectedAdminUserId(wallets[0].userId);
          //   setAdminBalance(wallets[0].balance);
          // } else {
          //   setError("No admin wallets available");
          // }
        } catch (err) {
          setError("Failed to load admin wallets");
          console.error("Error fetching admin wallets:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAdminWallets();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    const fetchedWallet = await walletService.getWallet("ETH");

    if(numericAmount <= 0) {
      setError(`Minium withdrawable amount should be greater than 0 USDC`)
      return;
    }


    if(numericAmount > fetchedWallet.balance) {
      setError(`Maximum withdrawable amount is ${ fetchedWallet.balance } USDC`)
      return;
    }
    try {
      setIsLoading(true);
      onWithdraw(
        numericAmount,
        selectedAdminAddress,
        toAddress,
        privateKey,
        selectedAdminUserId
      );

      setError("");
    } catch (err) {
      setError("Failed to process withdrawal. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div
        className={`${
          isDarkMode ? "bg-[#1F2937]" : "bg-white"
        } rounded-lg p-6 w-[600px] shadow-xl`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Withdraw Funds
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

        <form onSubmit={handleSubmit}>
          {/* <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Select Admin's addresses to withdraw
            </label>
            <select
              value={selectedAdminAddress}
              onChange={(e) => {
                const selectedWallet = adminWallets.find(
                  (w) => w.address === e.target.value
                );
                if (selectedWallet) {
                  setSelectedAdminAddress(selectedWallet.address);
                  setSelectedAdminUserId(selectedWallet.userId);
                }
              }}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
              disabled={isLoading || adminWallets.length === 0}
            >
              {adminWallets.length === 0 ? (
                <option value="">No admin wallets available</option>
              ) : (
                adminWallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.address}>
                    {wallet.address} ({wallet.token_type || "USDC"})
                  </option>
                ))
              )}
            </select>
          </div> */}
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
              min="0"
              // max={adminBalance - numericGasFee}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter amount"
              required
              disabled={isLoading}
            />
          </div>

          {/* <div className="mb-4">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Available Balance: {adminBalance} USDC
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Gas Fee: {numericGasFee.toFixed(2)} USDC
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Maximum Withdrawable: {adminBalance - numericGasFee} USDC
            </p>
          </div> */}

          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`mr-2 px-4 py-2 rounded-lg ${
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
              className={`px-4 py-2 flex items-center rounded-lg ${
                isDarkMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              {isLoading && <SpinnerIconSVG />}
              {isLoading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
