import React, { useState, useEffect, ReactNode, useRef, Fragment } from "react";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
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
import { useAuth } from "../../../hooks/useAuth";
import ProcessTicketModal from "../../../components/ProcessTicketModal";
import { formDomains } from "../../../constants/FormDomain";
import notifiAudio from "../../../assets/notifi.wav";
import PaymentMethodModal from "../../../components/PaymentMethodModal";
interface User {
  id: number;
  // Add other user properties as needed
}

export interface Ticket {
  id: number;
  ticket_id: string;
  time: string;
  amount: number;
  facebook_name: string;
  game: string;
  game_id: string;
  status: string;
  payment_method: string;
  payment_tag: string;
  account_name: string;
  image: string;
  action?: string;
  telegram_chat_id: string;
  payment_details?: any;
}

const TicketSection: React.FC<{
  isDarkMode: boolean;
  currentBalance: number;
  holdingBalance: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  acceptedTickets: Ticket[];
  reportedTickets: Ticket[];
  onSort: (field: string) => void;
  getSortIcon: (field: string) => ReactNode;
  getTicketAction: (status: string) => boolean;
  onProcessTicket: (ticket: Ticket, user: User | null) => void;
  user: User | null;
  getCompletedAction: (status: string) => boolean;
  onTicketAction: (action: string, ticketId: string) => void;
  incomingTickets: Ticket[];
  onAddTicket: (ticket: Ticket) => void;
  addButtonLoading: boolean;
}> = ({
  isDarkMode,
  currentBalance,
  holdingBalance,
  currentPage,
  totalPages,
  onPageChange,
  loading,
  acceptedTickets,
  reportedTickets,
  onSort,
  getSortIcon,
  getTicketAction,
  onProcessTicket,
  user,
  getCompletedAction,
  onTicketAction,
  incomingTickets,
  onAddTicket,
  addButtonLoading,
}) => {
  const [currentSelectedTicketId, setCurrentSelectedTicketId] = useState(0);
  const [currentSelectedAcceptedTicket, setCurrentSelectedAcceptedTicket] =
    useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {}, [reportedTickets]);
  const openPaymentMethodsModal = (ticket: Ticket, user: User | null) => {
    // open payment methods modal
    setCurrentSelectedAcceptedTicket(ticket);
    setIsModalOpen(true);
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Tickets</h2>
        <span className="text-sm text-gray-500">
          {/* Last updated: {new Date().toLocaleTimeString()} */}
        </span>
      </div>
      <div className={`gap-4 mb-8`}>
        <div
          className={`${
            isDarkMode ? "bg-[#1F2937]" : "bg-white"
          } p-6 rounded-xl ${isDarkMode ? "" : "shadow-sm"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${
                  isDarkMode ? "bg-green-500/10" : "bg-green-50"
                }`}
              >
                <svg
                  className="w-6 h-6 text-green-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Current Balance
                </p>
                <p
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${currentBalance?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8`}
      >
        <div className="flex flex-col md:col-span-3 lg:col-span-3 max-h-min gap-5">
          <div
            className={`${
              isDarkMode ? "bg-[#1F2937]" : "bg-white"
            } rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"} `}
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center gap-2 mb-3 md:mb-0">
                <svg
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Accepted Tickets
                </h2>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                >
                  <HiOutlineChevronDoubleLeft />
                </button>
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <HiOutlineChevronLeft />
                </button>
                <span
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <HiOutlineChevronRight />
                </button>
                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <HiOutlineChevronDoubleRight />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : acceptedTickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tickets found
                </div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => onSort("ticket_id")}
                        >
                          Ticket ID {getSortIcon("ticket_id")}
                        </button>
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => onSort("payment_method")}
                        >
                          Payment Method {getSortIcon("payment_method")}
                        </button>
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => onSort("payment_tag")}
                        >
                          Payment Tag {getSortIcon("payment_tag")}
                        </button>
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => onSort("account_name")}
                        >
                          Account Name {getSortIcon("account_name")}
                        </button>
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => onSort("amount")}
                        >
                          Amount {getSortIcon("amount")}
                        </button>
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Image
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Actions
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Payment Methods
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isDarkMode ? "divide-gray-700" : "divide-gray-100"
                    }`}
                  >
                    {acceptedTickets.map((ticket, index) => (
                      <Fragment key={index}>
                        <tr
                          key={index}
                          className={`${
                            isDarkMode
                              ? "hover:bg-gray-800"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td
                            className={`p-4 font-mono ${
                              isDarkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {ticket.ticket_id}
                          </td>
                          <td
                            className={`p-4 ${
                              isDarkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {ticket.payment_method}
                          </td>
                          <td
                            className={`p-4 ${
                              isDarkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {ticket.payment_tag}
                          </td>
                          <td
                            className={`p-4 ${
                              isDarkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {ticket.account_name}
                          </td>
                          <td
                            className={`p-4 font-medium ${
                              isDarkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            $ {ticket.amount}
                          </td>
                          <td className="p-4">
                            {ticket.image && (
                              <div
                                onClick={() =>
                                  window.open(ticket.image, "_blank")
                                }
                              >
                                <img
                                  src={ticket.image}
                                  alt="Ticket Image"
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            {getTicketAction(ticket.status) ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => onProcessTicket(ticket, user)}
                                  className={`font-medium ${
                                    isDarkMode
                                      ? "text-blue-400 hover:text-blue-300"
                                      : "text-blue-600 hover:text-blue-700"
                                  } hover:underline transition-colors`}
                                >
                                  Process
                                </button>
                              </div>
                            ) : getCompletedAction(ticket.status) ? (
                              <button
                                onClick={() =>
                                  onTicketAction("complete", ticket.ticket_id)
                                }
                                className={`font-medium ${
                                  isDarkMode
                                    ? "text-blue-400 hover:text-blue-300"
                                    : "text-blue-600 hover:text-blue-700"
                                } hover:underline transition-colors`}
                              >
                                Complete
                              </button>
                            ) : null}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2 justify-self-center">
                              <button
                                onClick={() =>
                                  openPaymentMethodsModal(ticket, user)
                                }
                                className={`font-medium ${
                                  isDarkMode
                                    ? "text-blue-400 hover:text-blue-300"
                                    : "text-blue-600 hover:text-blue-700"
                                } hover:underline transition-colors`}
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div
            className={`${
              isDarkMode ? "bg-[#1F2937]" : "bg-white"
            } rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"} `}
          >
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center gap-2 mb-3 md:mb-0">
                <svg
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Reported Tickets
                </h2>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                >
                  <HiOutlineChevronDoubleLeft />
                </button>
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <HiOutlineChevronLeft />
                </button>
                <span
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <HiOutlineChevronRight />
                </button>
                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <HiOutlineChevronDoubleRight />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : reportedTickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tickets found
                </div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => onSort("ticket_id")}
                        >
                          Ticket ID {getSortIcon("ticket_id")}
                        </button>
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => onSort("payment_method")}
                        >
                          Payment Method {getSortIcon("payment_method")}
                        </button>
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => onSort("payment_tag")}
                        >
                          Payment Tag {getSortIcon("payment_tag")}
                        </button>
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => onSort("account_name")}
                        >
                          Account Name {getSortIcon("account_name")}
                        </button>
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <button
                          className="flex items-center focus:outline-none"
                          onClick={() => onSort("amount")}
                        >
                          Amount {getSortIcon("amount")}
                        </button>
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Image
                      </th>
                      <th
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isDarkMode ? "divide-gray-700" : "divide-gray-100"
                    }`}
                  >
                    {reportedTickets.map((ticket, index) => (
                      <tr
                        key={index}
                        className={`${
                          isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`p-4 font-mono ${
                            isDarkMode ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {ticket.ticket_id}
                        </td>
                        <td
                          className={`p-4 ${
                            isDarkMode ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {ticket.payment_method}
                        </td>
                        <td
                          className={`p-4 ${
                            isDarkMode ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {ticket.payment_tag}
                        </td>
                        <td
                          className={`p-4 ${
                            isDarkMode ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {ticket.account_name}
                        </td>
                        <td
                          className={`p-4 font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          $ {ticket.amount}
                        </td>
                        <td className="p-4">
                          {ticket.image && (
                            <div
                              onClick={() =>
                                window.open(ticket.image, "_blank")
                              }
                            >
                              <img
                                src={ticket.image}
                                alt="Ticket Image"
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          {getTicketAction(ticket.status) ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => onProcessTicket(ticket, user)}
                                className={`font-medium ${
                                  isDarkMode
                                    ? "text-blue-400 hover:text-blue-300"
                                    : "text-blue-600 hover:text-blue-700"
                                } hover:underline transition-colors`}
                              >
                                Process
                              </button>
                            </div>
                          ) : getCompletedAction(ticket.status) ? (
                            <button
                              onClick={() =>
                                onTicketAction("complete", ticket.ticket_id)
                              }
                              className={`font-medium ${
                                isDarkMode
                                  ? "text-blue-400 hover:text-blue-300"
                                  : "text-blue-600 hover:text-blue-700"
                              } hover:underline transition-colors`}
                            >
                              Complete
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-[#1F2937]" : "bg-white"
          } rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"}`}
        >
          <div className="flex flex-col h-full">
            <h2
              className={`text-xl font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Incoming Tickets
            </h2>

            <div className="space-y-4">
              {incomingTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between bg-white/5 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-1 h-12 ${
                        ticket.payment_method === "Apple Pay"
                          ? "bg-black"
                          : ticket.payment_method === "CashApp"
                          ? "bg-green-500"
                          : ticket.payment_method === "PayPal"
                          ? "bg-fuchsia-500"
                          : "bg-blue-500"
                      } rounded-full`}
                    ></div>
                    <div>
                      <p
                        className={`font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {ticket.ticket_id}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {ticket.payment_method}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentSelectedTicketId(ticket.id);
                      onAddTicket(ticket);
                    }}
                    className={`px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200`}
                    disabled={
                      ticket.id == currentSelectedTicketId && addButtonLoading
                    }
                  >
                    {ticket.id == currentSelectedTicketId && addButtonLoading
                      ? "Loading"
                      : "Add"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <PaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={currentSelectedAcceptedTicket}
        isDarkMode
      />
    </div>
  );
};

export const FulfillerTicket: React.FC = () => {
  // Helper function to convert API ticket to UI ticket
  const convertApiTicketToUiTicket = (apiTicket: ApiTicket): Ticket => ({
    id: apiTicket.id,
    ticket_id: apiTicket.ticket_id || `TICKET-${apiTicket.id}`,
    time: apiTicket.created_at || new Date().toISOString(),
    facebook_name: apiTicket.facebook_name,
    amount: apiTicket.amount,
    status: apiTicket.status,
    payment_method: apiTicket.payment_method || "N/A",
    payment_tag: apiTicket.payment_tag || "N/A",
    account_name: apiTicket.account_name || "N/A",
    image: apiTicket.image_path || "",
    game: apiTicket.game,
    game_id: apiTicket.game_id,
    telegram_chat_id: apiTicket.chat_group_id,
    payment_details: apiTicket.payment_details,
  });

  const { showAlert, removeAlert } = useAlert();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [cryptoTransactions, setCryptoTransactions] = useState<
    CryptoTransaction[]
  >([]);
  const [isCryptoLoading, setIsCryptoLoading] = useState(true);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const fetchedWallets = await walletService.getWallets();
        setWallets(fetchedWallets);
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

    fetchCryptoTransactions();
  }, []);

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

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [incomingTickets, setIncomingTickets] = useState<Ticket[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [processInterval, setProcessInterval] = useState<number | null>(null);
  const [acceptedTickets, setAcceptedTickets] = useState<Ticket[]>([]);
  const [reportedTickets, setReportedTickets] = useState<Ticket[]>([]);
  const [holdingBalance, setHoldingBalance] = useState<number>(0);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [ticketTimers, setTicketTimers] = useState<Record<number, number>>({});
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [addButtonLoading, setAddButtonLoading] = useState(false);
  const [isProcessTicketModalOpen, setIsProcessTicketModalOpen] =
    useState(false);
  const prevIncomingTicketCount = useRef(0);
  const notificationAudio = useRef<HTMLAudioElement | null>(null);
  const { isAllowed } = useAlert();
  const isAllowedRef = useRef(isAllowed);

  useEffect(() => {
    isAllowedRef.current = isAllowed;
  }, [isAllowed]);

  // Create new tickets every 20 seconds
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const getTicketFromServer = async () => {
      if (!isMounted) return;
      try {
        const tickets = await ticketService.getTicketsWithoutLimit("validated");
        const reportedTickets = await ticketService.getTicketsWithoutLimit(
          "error"
        );
        let convertedTickets = [];
        let convertedReportedTickets = [];
        for (let i = 0; i < tickets.data.length; i++) {
          const ticket = tickets.data[i];
          const specialFulfillers = [39, 1166]
          if ((!specialFulfillers.includes(user?.id || 0) && ticket.domain_id !== 2)) {
            convertedTickets.push(convertApiTicketToUiTicket(ticket));
          } else if (specialFulfillers.includes(user?.id || 0) && ticket.domain_id === 2) {
            convertedTickets.push(convertApiTicketToUiTicket(ticket));
          } 
        }
        for (let i = 0; i < reportedTickets.data.length; i++) {
          const ticket = reportedTickets.data[i];
          convertedReportedTickets.push(convertApiTicketToUiTicket(ticket));
        }
        setIncomingTickets(convertedTickets);

        setReportedTickets(convertedReportedTickets);
      } catch (error) {
        console.error("Error creating new ticket:", error);
      }
    };
    const getAcceptedTicketFromServer = async () => {
      if (!isMounted) return;
      try {
        const tickets = await ticketService.getTicketsWithoutLimit(
          "processing"
        );
        let convertedTickets = [];
        for (let i = 0; i < tickets.data.length; i++) {
          const ticket = tickets.data[i];
          convertedTickets.push(convertApiTicketToUiTicket(ticket));
        }
        setAcceptedTickets(convertedTickets);
      } catch (error) {
        console.error("Error creating new ticket:", error);
      }
    };

    // Initial creation
    getTicketFromServer();
    getAcceptedTicketFromServer();
    // createNewTicket();

    // Set up interval for subsequent creations
    const interval = window.setInterval(() => {
      getTicketFromServer();
      // sounds when new tickets come in
      // sounds effect
      if (notificationAudio.current) {
        notificationAudio.current.pause();
        notificationAudio.current.currentTime = 0;
      } else {
        notificationAudio.current = new Audio(notifiAudio);
      }
      if (
        incomingTickets.length > prevIncomingTicketCount.current &&
        isAllowedRef.current
      ) {
        notificationAudio.current.play();
      }
      prevIncomingTicketCount.current = incomingTickets.length;
    }, 20000);
    // const interval = window.setInterval(createNewTicket, 20000);
    setRefreshInterval(interval);

    // Cleanup
    return () => {
      isMounted = false;
      if (refreshInterval) {
        window.clearInterval(refreshInterval);
      }
    };
  }, [user]);

  // Process oldest tickets every 30 seconds
  useEffect(() => {
    const processOldestTicket = async () => {
      try {
        if (incomingTickets.length > 0) {
          // Sort tickets by time (oldest first)
          const sortedTickets = [...incomingTickets].sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
          );

          // Get the oldest ticket
          const oldestTicket = sortedTickets[0];
        }
      } catch (error) {
        console.error("Error processing oldest ticket:", error);
      }
    };

    // Set up interval for processing oldest tickets
    const interval = window.setInterval(processOldestTicket, 30000);
    setProcessInterval(interval);

    // Cleanup
    return () => {
      if (processInterval) {
        window.clearInterval(processInterval);
      }
    };
  }, [incomingTickets]);

  // Check for tickets that have been in the system for more than 1 hour
  useEffect(() => {
    const checkTicketTimers = () => {
      const now = Date.now();
      // const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds
      const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

      // Check each accepted ticket
      acceptedTickets.forEach((ticket) => {
        // If we don't have a timer for this ticket yet, set it
        if (!ticketTimers[ticket.id]) {
          setTicketTimers((prev) => ({
            ...prev,
            [ticket.id]: now,
          }));
        } else {
          // Calculate how long the ticket has been in the system
          const ticketAge = now - ticketTimers[ticket.id];

          // If the ticket has been in the system for more than 1 hour
          if (ticketAge > oneHourInMs) {
            // Show a warning alert
            showAlert(
              "warning",
              `Ticket ${ticket.ticket_id} has been in your account for more than 1 hour. Please process it soon.`
            );

            // Update the timer to prevent showing the alert every second
            setTicketTimers((prev) => ({
              ...prev,
              [ticket.id]: now - oneHourInMs + 1000, // Reset to just under 1 hour to show again in 1 minute
            }));
          }
        }
      });
    };

    // Run the check every minute
    const interval = setInterval(checkTicketTimers, 1000);

    // Run immediately on first render
    checkTicketTimers();

    // Cleanup
    return () => clearInterval(interval);
  }, [acceptedTickets, ticketTimers, showAlert]);

  // Show all tickets
  // useEffect(() => {
  //   const fetchTickets = async () => {
  //     try {
  //       const response = await ticketService.getTickets(
  //         undefined,
  //         currentPage,
  //         limit
  //       );
  //       const formattedTickets = response.data.map((ticket: ApiTicket) => ({
  //         id: ticket.id,
  //         ticket_id: ticket.ticket_id || `TICKET-${ticket.id}`,
  //         time: ticket.created_at || new Date().toISOString(),
  //         amount: ticket.amount,
  //         status: mapTicketStatus(ticket.status),
  //         payment_method: ticket.payment_method || "N/A",
  //         payment_tag: ticket.payment_tag || "N/A",
  //         account_name: ticket.account_name || "N/A",
  //         image: ticket.image || "",
  //       }));

  //       // Sort tickets based on current sort field and direction
  //       const sortedTickets = sortTickets(
  //         formattedTickets,
  //         sortField,
  //         sortDirection
  //       );

  //       setTickets(sortedTickets);
  //       setTotalPages(response.meta.totalPages);
  //     } catch (error) {
  //       showAlert("error", "Failed to fetch tickets");
  //       console.error("Error fetching tickets:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTickets();
  // }, [showAlert, currentPage, limit, sortField, sortDirection]);

  // Show accepted tickets
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const fetchedWallet = await walletService.getWallet("ETH");

        if ([fetchedWallet].length > 0) {
          setCurrentBalance(Number(fetchedWallet.balance));
        }
      } catch (error) {
        // showAlert("error", "Failed to fetch wallets");
        console.error("Error fetching wallets:", error);
      }
    };

    fetchWallets();

    // Sort tickets based on current sort field and direction
    const sortedTickets = sortTickets(
      acceptedTickets,
      sortField,
      sortDirection
    );

    setTickets(sortedTickets);
  }, []);

  const sortTickets = (
    ticketsToSort: Ticket[],
    field: string,
    direction: "asc" | "desc"
  ): Ticket[] => {
    return [...ticketsToSort].sort((a, b) => {
      let valueA: any = a[field as keyof Ticket];
      let valueB: any = b[field as keyof Ticket];

      // Handle numeric values
      if (field === "id" || field === "amount") {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      // Handle string values
      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (direction === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const handleAddTicket = async (ticket: Ticket) => {
    if (acceptedTickets.length >= 10) {
      showAlert("info", "You can add up to 10.");
      setAddButtonLoading(false);
      return;
    }

    try {
      setAddButtonLoading(true);
      //validate the ticket status is validated
      const selecteTicket = await ticketService.getTicket(String(ticket.id));
      if (selecteTicket.status !== "validated") {
        showAlert("error", "This ticket is already assigned");
        return;
      }
      await ticketService.updateTicketStatus(String(ticket.id), "processing");
      // Remove the ticket from incoming tickets
      setIncomingTickets((prev) => prev.filter((t) => t.id !== ticket.id));

      setCurrentBalance(
        (prevBalance) =>
          Number(prevBalance) + (Number(ticket.amount) * 103) / 100
      );
      setAcceptedTickets((prev) => [...prev, ticket]);

      // Set the timer for this ticket
      setTicketTimers((prev) => ({
        ...prev,
        [ticket.id]: Date.now(),
      }));

      // Update the ticket status to "pending" in the API
      // await ticketService.updateTicketStatus(ticket.id, "pending");

      // Refresh the main tickets table
      // onAction("refresh", 0);
    } catch (error) {
      console.error("Error adding ticket:", error);
      // toast
      showAlert("error", "Failed to add ticket. Please try again.");
      // Add the ticket back to incoming tickets if there's an error
    } finally {
      setAddButtonLoading(false);
    }
  };

  const handleProcessTicket = async (ticket: Ticket, user: User | null) => {
    setTicket(ticket);
    setIsProcessTicketModalOpen(true);
    return;
  };

  const handleTicketProcessed = () => {
    setIsProcessTicketModalOpen(false);
    setAcceptedTickets((prev) => prev.filter((t) => t.id !== ticket?.id));
  };

  const handleTicketReport = async (amount: number) => {
    console.log({ amount });
    setCurrentBalance(Number(amount));
  };

  const getTicketAction = (status: string): boolean => {
    // return status.toLowerCase() === "validated";
    return true;
  };

  const getCompletedAction = (status: string): boolean => {
    return status.toLowerCase() === "validated";
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <svg
          className="w-4 h-4 ml-1 opacity-50"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return sortDirection === "asc" ? (
      <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <TicketSection
        isDarkMode={isDarkMode}
        currentBalance={currentBalance}
        holdingBalance={holdingBalance}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        acceptedTickets={acceptedTickets}
        reportedTickets={reportedTickets}
        onSort={handleSort}
        getSortIcon={getSortIcon}
        getTicketAction={getTicketAction}
        onProcessTicket={handleProcessTicket}
        user={user}
        getCompletedAction={getCompletedAction}
        onTicketAction={handleTicketAction}
        incomingTickets={incomingTickets}
        onAddTicket={handleAddTicket}
        addButtonLoading={addButtonLoading}
      />
      <ProcessTicketModal
        isOpen={isProcessTicketModalOpen}
        ticket={ticket}
        isDarkMode={isDarkMode}
        onClose={() => setIsProcessTicketModalOpen(false)}
        onTicketProcessed={handleTicketProcessed}
        afterReport={handleTicketReport}
      />
    </div>
  );
};
