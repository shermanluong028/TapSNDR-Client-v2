import { Ticket } from "../../services/ticket.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketService } from "../../services/ticket.service";

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const queryClient = useQueryClient();

  const validateMutation = useMutation({
    mutationFn: () => ticketService.validateTicket(ticket.id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-yellow-100 text-yellow-800";
      case "validated":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {ticket.facebook_name}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              ticket.status
            )}`}
          >
            {ticket.status}
          </span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Amount:</span>
            <span className="text-sm font-medium text-gray-900">
              ₱{ticket.amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Game:</span>
            <span className="text-sm font-medium text-gray-900">
              {ticket.game}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Game ID:</span>
            <span className="text-sm font-medium text-gray-900">
              {ticket.game_id}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Payment Method:</span>
            <span className="text-sm font-medium text-gray-900">
              {ticket.payment_method}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Account Name:</span>
            <span className="text-sm font-medium text-gray-900">
              {ticket.account_name}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Created: {new Date(ticket.created_at).toLocaleString()}
          </span>
          {ticket.status === "new" && (
            <button
              onClick={() => validateMutation.mutate()}
              disabled={validateMutation.isPending}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {validateMutation.isPending ? "Validating..." : "Validate"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
