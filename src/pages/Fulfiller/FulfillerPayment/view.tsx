import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAlert } from "../../../contexts/AlertContext";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  ticketService,
  Ticket as ApiTicket,
} from "../../../services/ticket.service";
import {
  walletService,
  Wallet,
  CryptoTransaction,
} from "../../../services/wallet.service";
import WithdrawModal from "../../../components/WithdrawModal";
import ProcessingModal from "../../../components/ProcessingModal";
import { useAuth } from "../../../hooks/useAuth";
import { format } from "date-fns";
import {
  useWallet,
  WalletProvider,
} from "../../../components/wallet/wallet-provider";
import { Loader2 } from "lucide-react";
import { formatAddress } from "../../../utils/utils";
import { sendTelegramMessage } from "../../../services/telegram.service";
interface User {
  id: number;
  username: string;
  // Add other user properties as needed
}

interface Transaction {
  date: string;
  income?: number;
  outcome?: number;
  ticketName: string;
  transactionHash: string;
}

interface Ticket {
  id: number;
  ticket_id: string;
  time: string;
  amount: number;
  status: string;
  payment_method: string;
  payment_tag: string;
  account_name: string;
  image: string;
  action?: string;
}

// Helper function to convert API ticket to UI ticket
const convertApiTicketToUiTicket = (apiTicket: ApiTicket): Ticket => ({
  id: apiTicket.id,
  ticket_id: apiTicket.ticket_id || `TICKET-${apiTicket.id}`,
  time: apiTicket.created_at || new Date().toISOString(),
  amount: apiTicket.amount,
  status: apiTicket.status,
  payment_method: apiTicket.payment_method || "N/A",
  payment_tag: apiTicket.payment_tag || "N/A",
  account_name: apiTicket.account_name || "N/A",
  image: apiTicket.image_path || "",
});

const PaymentSection: React.FC<{
  // transactions: Transaction[];
  balanceDB: number;
  onConnectWallet: () => void;
  onWithdraw: () => void;
  isDarkMode: boolean;
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  onWalletSelect: (wallet: Wallet) => void;
  showWalletDropdown: boolean;
  setShowWalletDropdown: (show: boolean) => void;
  cryptoTransactions: CryptoTransaction[];
  isCryptoLoading: boolean;
  walletContext: any;
  showAlert: any;
}> = ({
  // transactions,
  balanceDB,
  onConnectWallet,
  onWithdraw,
  isDarkMode,
  wallets,
  selectedWallet,
  onWalletSelect,
  showWalletDropdown,
  setShowWalletDropdown,
  cryptoTransactions,
  isCryptoLoading,
  walletContext,
  showAlert,
}) => {
  const { error } = useWallet();
  const [isSpecialFulfiiler, setIsSpecialFulfiller] = useState(true);
  const user = useAuth()?.user;
  useEffect(() => {
    if (error) {
      showAlert("error", error);
    }
  }, [error]);
  useEffect(() => {
    if (!user) return;
    if (user.id == 1166) setIsSpecialFulfiller(true);
    else setIsSpecialFulfiller(false);
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Payments</h2>
        {/* <span className="text-sm text-gray-500">Last updated: 12:13:00 AM</span> */}
      </div>
      <div className="flex gap-4">
        <div className="relative">
          {walletContext?.isConnected ? (
            <button
              onClick={walletContext?.disconnectWallet}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                isDarkMode
                  ? "bg-[#1F2937] text-gray-200 hover:bg-gray-800"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M22 8H2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 12h0"
                />
              </svg>
              Disconnect Wallet
              {formatAddress(walletContext?.account!)}
            </button>
          ) : (
            <button
              onClick={walletContext?.connectWallet}
              disabled={walletContext?.isConnecting}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                isDarkMode
                  ? "bg-[#1F2937] text-gray-200 hover:bg-gray-800"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M22 8H2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 12h0"
                />
              </svg>
              {walletContext?.isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect MetaMask"
              )}{" "}
            </button>
          )}

          {/* {error && <div className="mt-2 text-sm text-red-500">{error}</div>} */}
        </div>
        {!isSpecialFulfiiler && (
          <button
            onClick={onWithdraw}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              isDarkMode
                ? "bg-red-500 text-gray-700 hover:bg-red-600"
                : "bg-red-400 text-gray-700 hover:bg-red-500"
            }`}
          >
            <svg
              className="w-5 h-5 transform rotate-180"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 17a1 1 0 001-1V6.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 101.414 1.414L10 6.414V16a1 1 0 001 1z"
                clipRule="evenodd"
              />
            </svg>
            Withdraw
          </button>
        )}
      </div>

      {/* Accounts Section */}
      <div
        className={`${
          isDarkMode ? "bg-[#1F2937]" : "bg-white"
        } rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <svg
            className={`w-5 h-5 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path
              fillRule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Accounts
          </h2>
        </div>

        <div>
          <div
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Total Balance
          </div>
          <div
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {balanceDB.toLocaleString()} USDC
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div
        className={`${
          isDarkMode ? "bg-[#1F2937]" : "bg-white"
        } rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <svg
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Recent Transactions
              </h2>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {cryptoTransactions.length} transactions
              </div>
            </div>
          </div>
          <div
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {/* This Month */}
          </div>
        </div>

        <div className="overflow-x-auto">
          {isCryptoLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : cryptoTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th
                    className={`p-4 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Date
                  </th>
                  <th
                    className={`p-4 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Type
                  </th>
                  <th
                    className={`p-4 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Amount
                  </th>
                  <th
                    className={`p-4 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Description
                  </th>
                  <th
                    className={`p-4 text-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Transaction Hash
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? "divide-gray-700" : "divide-gray-100"
                }`}
              >
                {cryptoTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className={`${
                      isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`p-4 ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {format(new Date(transaction.created_at), "dd/MM/yyyy")}
                    </td>
                    <td
                      className={`p-4 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {transaction.transaction_type}
                    </td>
                    <td
                      className={`p-4 font-medium ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {transaction.transaction_type === "deposit" ||
                      transaction.transaction_type === "credit" ? (
                        <span className="text-green-500">
                          {transaction.amount.toLocaleString()} USDC
                        </span>
                      ) : (
                        <span className="text-red-500">
                          {transaction.amount.toLocaleString()} USDC
                        </span>
                      )}
                    </td>
                    <td
                      className={`p-4 ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {transaction.description}
                    </td>
                    <td
                      className={`p-4 font-mono ${
                        isDarkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {transaction.transaction_hash || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* <button
          className={`w-full mt-6 py-3 text-center ${
            isDarkMode
              ? "bg-[#111827] text-gray-700 hover:bg-gray-800"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } rounded-lg transition-colors flex items-center justify-center gap-2`}
        >
          View All Transactions
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button> */}
      </div>
    </div>
  );
};

export const FulfillerPayment: React.FC = () => {
  const location = useLocation();
  const { showAlert, removeAlert } = useAlert();
  const { isDarkMode } = useTheme();
  const { user } = useAuth() as { user: User | null };
  const [balanceWallet, setBalance] = useState<number>(0);
  const [transactions] = useState<Transaction[]>([
    {
      date: "27/3/2025",
      income: 100,
      ticketName: "Ticket 1",
      transactionHash: "0x124...",
    },
    {
      date: "26/3/2025",
      outcome: 10,
      ticketName: "Ticket 2",
      transactionHash: "0xc35...",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [gasFee] = useState<number>(5); // Fixed gas fee of 5 USDC for withdrawals
  const [cryptoTransactions, setCryptoTransactions] = useState<
    CryptoTransaction[]
  >([]);
  const [isCryptoLoading, setIsCryptoLoading] = useState(true);

  const [isCompletedWithdraw, setIsCompletedWithdraw] = useState<boolean>(true);

  const walletContext = useWallet();

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const fetchedWallet = await walletService.getWallet("ETH");
        setWallets([fetchedWallet]);

        if ([fetchedWallet].length > 0) {
          setBalance(fetchedWallet.balance);
          const key = await walletService.getPrivateKey(
            fetchedWallet.userId,
            fetchedWallet.id
          );
          setPrivateKey(key);
        }
      } catch (error) {
        // showAlert("error", "Failed to fetch wallets");
        console.error("Error fetching wallets:", error);
      }
    };

    fetchWallets();
  }, []);

  useEffect(() => {
    const fetchCryptoTransactions = async () => {
      try {
        const response = await walletService.getCryptoTransactions();
        setCryptoTransactions(response);
      } catch (error) {
        console.error("Error fetching crypto transactions:", error);
      } finally {
        setIsCryptoLoading(false);
      }
    };

    isCompletedWithdraw && fetchCryptoTransactions();
  }, [isCompletedWithdraw]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const mapTicketStatus = (status: string): string => {
    return status;
  };

  const handleConnectWallet = async () => {
    try {
      if (wallets.length === 0) {
        // Create a new Ethereum wallet
        const newWallet = await walletService.createEthereumWallet();

        // Convert EthereumWalletDto to Wallet format
        const walletData: Wallet = {
          id: newWallet.id,
          type: "FULFILLER", // Use the correct wallet type from the frontend interface
          balance: newWallet.balance,
          userId: 0, // This will be set by the backend
          address: newWallet.address,
          created_at: newWallet.createdAt,
          updated_at: newWallet.updatedAt,
          token_type: "USDC", // Add the token type
        };

        setWallets([...wallets, walletData]);
        setSelectedWallet(walletData);
        showAlert("success", "Wallet created successfully");

        // Fetch updated wallet data
        const updatedWallet = await walletService.getWallet("ETH");
        setBalance(updatedWallet.balance);
      } else if (!selectedWallet) {
        showAlert("error", "Please select a wallet first");
        return;
      } else {
        const connectedWallet = await walletService.connectWallet({
          type: "ETH",
          tokenType: "USDC",
          walletAddress: selectedWallet.address,
        });

        setBalance(connectedWallet.balance);
        showAlert("success", "Wallet connected successfully");
      }
    } catch (error) {
      showAlert("error", "Failed to create or connect wallet");
      console.error("Error connecting wallet:", error);
    }
  };

  const handleWalletSelect = async (wallet: Wallet) => {
    setSelectedWallet(wallet);
    // Connect the wallet directly using the wallet parameter
    try {
      const connectedWallet = await walletService.connectWallet({
        type: "ETH",
        tokenType: "USDC",
        walletAddress: wallet.address,
      });

      setBalance(connectedWallet.balance);
      showAlert("success", "Wallet connected successfully");
    } catch (error) {
      showAlert("error", "Failed to connect wallet");
      console.error("Error connecting wallet:", error);
    }
  };

  const handleWithdraw = () => {
    if (!walletContext.isConnected) {
      showAlert("error", "Please select a wallet first");
      return;
    }

    setIsWithdrawModalOpen(true);
  };

  const handleWithdrawSubmit = async (
    amount: number,
    adminAddress: string,
    to: string | null,
    privateKey: string,
    adminUserId: number
  ) => {
    // sendTelegramMessage(process.env.TELEGRAM_CHANNEL_ID || -1002809159075, `Withdraw request\nAmount: ${amount} USDT\nCurrent Balance: ${balanceWallet} USDT\nName: ${user?.username}\nTo: ${to}`, process.env.TELEGRAM_BOT_TOKEN);
    const withdrawRequestResponse = await walletService.createWithdrawRequest({
      amount,
      to: to || "",
    });
    if (!withdrawRequestResponse?.status) {
      showAlert(
        "error",
        withdrawRequestResponse?.error || "Failed to create withdraw request"
      );
    } else {
      showAlert(
        "info",
        "Your request has been sent successfully. Admin will handle it soon"
      );
    }
    setIsWithdrawModalOpen(false);
    return;
  };

  const handleTicketAction = async (action: string, ticketId: string) => {
    try {
      setLoading(true);
      if (action === "validate") {
        await ticketService.validateTicket(ticketId);
        showAlert("success", `Ticket #${ticketId} has been validated`);
      } else if (action === "decline") {
        await ticketService.declineTicket(ticketId);
        showAlert("success", `Ticket #${ticketId} has been declined`);
      } else if (action === "complete") {
        if (!user) {
          showAlert("error", "User not authenticated");
          return;
        }

        await ticketService.completeTicket(
          ticketId,
          user.id,
          "https://example.com/payment/123456.jpg"
        );
        showAlert("success", `Ticket #${ticketId} has been completed`);
      }
      // Refresh tickets after action
      const response = await ticketService.getTickets(
        undefined,
        currentPage,
        limit
      );
      const formattedTickets = response.data.map((ticket: ApiTicket) => ({
        id: ticket.id,
        ticket_id: ticket.ticket_id || `TICKET-${ticket.id}`,
        time: ticket.created_at || new Date().toISOString(),
        amount: ticket.amount,
        status: mapTicketStatus(ticket.status),
        payment_method: ticket.payment_method || "N/A",
        payment_tag: ticket.payment_tag || "N/A",
        account_name: ticket.account_name || "N/A",
        image: ticket.image_path || "",
      }));

      // Sort tickets based on current sort field and direction
      // const sortedTickets = sortTickets(
      //   formattedTickets,
      //   sortField,
      //   sortDirection
      // );

      // setTickets(sortedTickets);
      // setTotalPages(response.meta.totalPages);
    } catch (error) {
      showAlert("error", `Failed to ${action} ticket #${ticketId}`);
      console.error(`Error ${action}ing ticket:`, error);
    } finally {
      removeAlert();
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
  };

  // Payment icon component
  const PaymentIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path
        fillRule="evenodd"
        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Ticket icon component
  const TicketIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    </svg>
  );

  const panelItems = [
    {
      category: "Fulfiller",
      name: "Payments",
      path: "/fulfiller/payment",
      icon: <PaymentIcon />,
      isActive: location.pathname.includes("/payment"),
    },
    {
      category: "Fulfiller",
      name: "Tickets",
      path: "/fulfiller/ticket",
      icon: <TicketIcon />,
      isActive: location.pathname.includes("/ticket"),
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <PaymentSection
        // transactions={transactions}
        balanceDB={balanceWallet}
        onConnectWallet={handleConnectWallet}
        onWithdraw={handleWithdraw}
        isDarkMode={isDarkMode}
        wallets={wallets}
        selectedWallet={selectedWallet}
        onWalletSelect={handleWalletSelect}
        showWalletDropdown={showWalletDropdown}
        setShowWalletDropdown={setShowWalletDropdown}
        cryptoTransactions={cryptoTransactions}
        isCryptoLoading={isCryptoLoading}
        walletContext={walletContext}
        showAlert={showAlert}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdrawSubmit}
        isDarkMode={isDarkMode}
        selectedWallet={selectedWallet}
        toAddress={walletContext.account}
        privateKey={privateKey}
        balance={balanceWallet}
        gasFee={gasFee}
      />
      {/* {isProcessingModalOpen && (
        <ProcessingModal
          isOpen={isProcessingModalOpen}
          onClose={() => setIsProcessingModalOpen(false)}
          isDarkMode={isDarkMode}
          onComplete={() => {
            setIsProcessingModalOpen(false);
            setLoading(true);
            ticketService
              .getTickets(undefined, currentPage, limit)
              .then((response) => {
                const formattedTickets = response.data.map(
                  (ticket: ApiTicket) => ({
                    id: ticket.id,
                    ticket_id: ticket.ticket_id || `TICKET-${ticket.id}`,
                    time: ticket.created_at || new Date().toISOString(),
                    amount: ticket.amount,
                    status: mapTicketStatus(ticket.status),
                    payment_method: ticket.payment_method || "N/A",
                    payment_tag: ticket.payment_tag || "N/A",
                    account_name: ticket.account_name || "N/A",
                    image: ticket.image || "",
                  })
                );
                setTotalPages(response.meta.totalPages);
                setLoading(false);
              });
          }}
        />
      )} */}
    </div>
  );
};
