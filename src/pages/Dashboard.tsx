import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ticketService, Ticket } from "../services/ticket.service";

const Dashboard: React.FC = () => {
  const { data: ticketResponse, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => ticketService.getTickets(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const tickets = ticketResponse?.data || [];
  const stats = {
    total: tickets.length,
    new: tickets.filter((t: Ticket) => t.status === "new").length,
    validated: tickets.filter((t: Ticket) => t.status === "validated").length,
    completed: tickets.filter((t: Ticket) => t.status === "completed").length,
    cancelled: tickets.filter((t: Ticket) => t.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Tickets</h3>
          <p className="mt-2 text-3xl font-bold text-primary-600">
            {stats.total}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">New Tickets</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.new}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            Validated Tickets
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats.validated}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            Completed Tickets
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats.completed}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {tickets.slice(0, 5).map((ticket: Ticket) => (
            <div
              key={ticket.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {ticket.facebook_name}
                </p>
                <p className="text-sm text-gray-500">
                  {ticket.created_at
                    ? new Date(ticket.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ticket.status === "new"
                    ? "bg-yellow-100 text-yellow-800"
                    : ticket.status === "validated"
                    ? "bg-blue-100 text-blue-800"
                    : ticket.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {ticket.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
