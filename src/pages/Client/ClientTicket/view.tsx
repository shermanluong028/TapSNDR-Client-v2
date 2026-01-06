import React, { useState, useEffect } from "react";
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
import { LegacyButton } from "../../../components/common/LegacyButton";

interface Ticket {
  completionImages: string[];
  id: number;
  name: string;
  amount: number;
  status: string;
  action?: string;
  createdAt: string;
  completedAt?: string;
  imagePath?: string;
}

export const ClientTicket: React.FC = () => {
  const { showAlert } = useAlert();
  const { isDarkMode } = useTheme();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(30);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [cryptoTransactions, setCryptoTransactions] = useState<
    CryptoTransaction[]
  >([]);
  const [isCryptoLoading, setIsCryptoLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);

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
    const fetchTickets = async () => {
      try {
        const response = await ticketService.getClientTickets(
          undefined,
          currentPage,
          limit
        );
        const formattedTickets = response.data.map((ticket: ApiTicket) => ({
          id: ticket.id,
          name: ticket.facebook_name,
          amount: ticket.amount,
          status: mapTicketStatus(ticket.status),
          createdAt: ticket.created_at
          ? new Date(ticket.created_at).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short',
              timeZone: 'America/New_York',
            })
          : "",
          completedAt: ticket.completed_at
          ? new Date(ticket.completed_at).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short',
              timeZone: 'America/New_York',
            })
          : "",
          completionImages: ticket.completion_images || [],
        }));

        // Sort tickets based on current sort field and direction
        const sortedTickets = sortTickets(
          formattedTickets,
          sortField,
          sortDirection
        );

        setTickets(sortedTickets);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        showAlert("error", "Failed to fetch tickets");
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [showAlert, currentPage, limit, sortField, sortDirection]);

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

  const handleTicketAction = async (action: string, ticketId: number) => {
    try {
      if (action === "validate") {
        await ticketService.validateTicket(ticketId.toString());
        showAlert("success", `Ticket #${ticketId} has been validated`);
      } else if (action === "decline") {
        await ticketService.declineTicket(ticketId.toString());
        showAlert("success", `Ticket #${ticketId} has been declined`);
      }
      // Refresh tickets after action
      const response = await ticketService.getTickets(
        undefined,
        currentPage,
        limit
      );
      const formattedTickets = response.data.map((ticket: ApiTicket) => ({
        id: ticket.id,
        name: ticket.facebook_name,
        amount: ticket.amount,
        status: mapTicketStatus(ticket.status),
        createdAt: ticket.created_at
        ? new Date(ticket.created_at).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
            timeZone: 'America/New_York',
          })
        : "",
        completedAt: ticket.completed_at
        ? new Date(ticket.completed_at).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
            timeZone: 'America/New_York',
          })
        : "",
        completionImages: ticket.completion_images || [],
      }));

      // Sort tickets based on current sort field and direction
      const sortedTickets = sortTickets(
        formattedTickets,
        sortField,
        sortDirection
      );

      setTickets(sortedTickets);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      showAlert("error", `Failed to ${action} ticket #${ticketId}`);
      console.error(`Error ${action}ing ticket:`, error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
  };

  const getTicketAction = (status: string): boolean => {
    return status.toLowerCase() === "new";
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
  const handleViewClick = (images: string[]) => {
    setSelectedImages(images);
    setIsModalOpen(true);
  };
  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Tickets</h2>
          <span className="text-sm text-gray-500">
            {/* Last updated: {new Date().toLocaleTimeString()} */}
          </span>
        </div>

        <div
          className={`${
            isDarkMode ? "bg-[#1F2937]" : "bg-white"
          } rounded-xl p-6 ${isDarkMode ? "" : "shadow-sm"}`}
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
                Recent Tickets
              </h2>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <HiOutlineChevronDoubleLeft />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <HiOutlineChevronLeft />
              </button>
              <span
                className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <HiOutlineChevronRight />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
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
            ) : tickets.length === 0 ? (
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
                        onClick={() => handleSort("id")}
                      >
                        ID {getSortIcon("id")}
                      </button>
                    </th>
                    <th
                      className={`p-4 text-left ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <button
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort("name")}
                      >
                        Name {getSortIcon("name")}
                      </button>
                    </th>
                    <th
                      className={`p-4 text-left ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <button
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort("amount")}
                      >
                        Amount {getSortIcon("amount")}
                      </button>
                    </th>
                    <th
                      className={`p-4 text-left ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <button
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort("status")}
                      >
                        Status {getSortIcon("status")}
                      </button>
                    </th>
                    <th
                      className={`p-4 text-left ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Created At
                    </th>
                    <th
                      className={`p-4 text-left ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Completed At
                    </th>
                    <th
                      className={`p-4 text-left ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Image
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDarkMode ? "divide-gray-700" : "divide-gray-100"
                  }`}
                >
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={`${
                        isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                      }`}
                    >
                      <td
                        className={`p-4 font-mono text-left ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {ticket.id}
                      </td>
                      <td
                        className={`p-4 text-left ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {ticket.name}
                      </td>
                      <td
                        className={`p-4 font-medium text-left ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {ticket.amount} USDC
                      </td>
                      <td className="p-4 text-left">
                        <span
                          className={`px-3 py-1 rounded-md text-sm font-medium border ${
                            ticket.status.toLowerCase() === "completed"
                              ? "bg-white text-green-700 border-green-200 dark:bg-transparent dark:text-green-400 dark:border-green-700"
                              : ticket.status.toLowerCase() === "new"
                              ? "bg-white text-blue-700 border-blue-200 dark:bg-transparent dark:text-blue-400 dark:border-blue-700"
                              : ticket.status.toLowerCase() === "validated"
                              ? "bg-white text-indigo-700 border-indigo-200 dark:bg-transparent dark:text-indigo-400 dark:border-indigo-700"
                              : ticket.status.toLowerCase() === "declined"
                              ? "bg-white text-red-700 border-red-200 dark:bg-transparent dark:text-red-400 dark:border-red-700"
                              : ticket.status.toLowerCase() === "processing"
                              ? "bg-white text-yellow-700 border-yellow-200 dark:bg-transparent dark:text-yellow-400 dark:border-yellow-700"
                              : "bg-white text-gray-700 border-gray-200 dark:bg-transparent dark:text-gray-400 dark:border-gray-700"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td
                        className={`p-4 font-medium text-left ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {ticket.createdAt}
                      </td>
                      <td
                        className={`p-4 font-medium text-left ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        {ticket.completedAt ? ticket.completedAt : "N/A"}
                      </td>
                      {ticket.status.toLowerCase() === "completed" ? <td
                        className={`p-4 font-medium text-left cursor-pointer ${
                          isDarkMode ? "text-gray-300" : "text-gray-900"
                        }`}
                        onClick={() => {
                          console.log(ticket)
                          handleViewClick(ticket.completionImages || [])
                        }}
                      >
                        View
                      </td> : null}
                      {/* <td className="p-4 text-left">
                        {getTicketAction(ticket.status) ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleTicketAction("validate", ticket.id)
                              }
                              className={`font-medium ${
                                isDarkMode
                                  ? "text-green-400 hover:text-green-300"
                                  : "text-green-600 hover:text-green-700"
                              } hover:underline transition-colors`}
                            >
                              Validate
                            </button>
                            <button
                              onClick={() =>
                                handleTicketAction("decline", ticket.id)
                              }
                              className={`font-medium ${
                                isDarkMode
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-red-600 hover:text-red-700"
                              } hover:underline transition-colors`}
                            >
                              Decline
                            </button>
                          </div>
                        ) : null}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center transition-opacity"
    onClick={() => setIsModalOpen(false)} 
  >
    <div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-3xl w-full shadow-lg relative overflow-y-auto max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold"
        aria-label="Close modal"
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Completion Images</h2>

        <div className="flex flex-col gap-2 max-w-xl justify-self-center">
          {selectedImages.map((selectedImage, idx) => (
            <a href={selectedImage.image_path} target="_blank" rel="noopener noreferrer" key={idx}>
              <img
                src={selectedImage.image_path}
                alt={`Image ${idx + 1}`}
                className="rounded-md object-cover w-full h-auto border border-gray-200 dark:border-gray-700"
              />
            </a>
          ))}
    </div>
      </div>
  </div>
)}

    </div>
  );
};
