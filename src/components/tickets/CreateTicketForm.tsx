import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketService, CreateTicketDto } from "../../services/ticket.service";

export default function CreateTicketForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateTicketDto>({
    facebook_name: "",
    amount: 0,
    game: "",
    game_id: "",
    payment_method: "",
    payment_tag: "",
    account_name: "",
    payment_qr_code: "",
    telegram_chat_id: "",
  });

  const createMutation = useMutation({
    mutationFn: ticketService.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      setFormData({
        facebook_name: "",
        amount: 0,
        game: "",
        game_id: "",
        payment_method: "",
        payment_tag: "",
        account_name: "",
        payment_qr_code: "",
        telegram_chat_id: "",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="facebook_name"
          className="block text-sm font-medium text-gray-700"
        >
          Facebook Name
        </label>
        <input
          type="text"
          name="facebook_name"
          id="facebook_name"
          value={formData.facebook_name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
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
          name="amount"
          id="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="game"
          className="block text-sm font-medium text-gray-700"
        >
          Game
        </label>
        <select
          name="game"
          id="game"
          value={formData.game}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">Select a game</option>
          <option value="Mobile Legends">Mobile Legends</option>
          <option value="League of Legends">League of Legends</option>
          <option value="Dota 2">Dota 2</option>
          <option value="PUBG Mobile">PUBG Mobile</option>
          <option value="Genshin Impact">Genshin Impact</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="game_id"
          className="block text-sm font-medium text-gray-700"
        >
          Game ID
        </label>
        <input
          type="text"
          name="game_id"
          id="game_id"
          value={formData.game_id}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="payment_method"
          className="block text-sm font-medium text-gray-700"
        >
          Payment Method
        </label>
        <select
          name="payment_method"
          id="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">Select payment method</option>
          <option value="GCash">GCash</option>
          <option value="PayMaya">PayMaya</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="payment_tag"
          className="block text-sm font-medium text-gray-700"
        >
          Payment Tag
        </label>
        <input
          type="text"
          name="payment_tag"
          id="payment_tag"
          value={formData.payment_tag}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="account_name"
          className="block text-sm font-medium text-gray-700"
        >
          Account Name
        </label>
        <input
          type="text"
          name="account_name"
          id="account_name"
          value={formData.account_name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="payment_qr_code"
          className="block text-sm font-medium text-gray-700"
        >
          Payment QR Code URL
        </label>
        <input
          type="url"
          name="payment_qr_code"
          id="payment_qr_code"
          value={formData.payment_qr_code}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      {createMutation.isError && (
        <div className="text-red-500 text-sm">
          Error creating ticket. Please try again.
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createMutation.isPending ? "Creating..." : "Create Ticket"}
        </button>
      </div>
    </form>
  );
}
