import { api } from "./api";
import axios from "axios";

export interface Ticket {
  domain_id: any;
  id: number;
  ticket_id?: string;
  created_at: string;
  facebook_name: string;
  amount: number;
  status: string;
  payment_method?: string;
  account_name?: string;
  image_path?: string;
  game: string;
  game_id: string;
  payment_tag: string;
  payment_qr_code: string;
  chat_group_id: string;
  completed_at: string | null;
  completion_images: string [];
  payment_details?: [];
}

export interface CreateTicketDto {
  facebook_name: string;
  amount: number;
  game: string;
  game_id: string;
  payment_method: string;
  payment_tag: string;
  account_name: string;
  payment_qr_code: string;
  telegram_chat_id: string;
}

export interface TicketResponse {
  data: Ticket[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const ticketService = {
  async getTickets(
    status?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<TicketResponse> {
    const response = await api.get<TicketResponse>("/tickets", {
      params: { status, page, limit },
    });
    return response.data;
  },

  async getClientTickets(
    status?: string,
    page: number = 1,
    limit: number = 30
  ): Promise<TicketResponse> {
    const response = await api.get<TicketResponse>("/tickets/client", {
      params: { status, page, limit },
    });
    return response.data;
  },

  async getTicketsWithoutLimit(
    status?: string,
  ): Promise<TicketResponse> {
    const response = await api.get<TicketResponse>("/tickets/withoutlimit", {
      params: { status },
    });
    return response.data;
  },

  async getTicket(id: string): Promise<Ticket> {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  async createTicket(data: CreateTicketDto): Promise<Ticket> {
    const response = await api.post<Ticket>("/tickets", data);
    return response.data;
  },

  async validateTicket(id: string): Promise<Ticket> {
    const response = await api.put<Ticket>(`/tickets/${id}/validate`);
    return response.data;
  },

  async declineTicket(id: string): Promise<Ticket> {
    const response = await api.put<Ticket>(`/tickets/${id}/decline`);
    return response.data;
  },

  async completeTicket(
    id: string,
    fulfillerId: number,
    paymentImageUrl: string
  ): Promise<Ticket> {
    const response = await api.put(`/tickets/${id}/complete`, {
      fulfiller_id: fulfillerId,
      paymentImageUrls: paymentImageUrl,
    });
    return response.data;
  },
  async processingTicket(
    id: string
  ): Promise<Ticket> {
    const response = await api.put(`/tickets/${id}/processing`);
    return response.data;
  },

  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    const response = await api.get<Ticket[]>(`/tickets/status/${status}`);
    return response.data;
  },

  async updateTicketStatus(
    id: string,
    action: "validated" | "declined" | "completed" | "processing" | "reported",
    data?: {
      fulfillerId?: number;
      paymentImageUrl?: string;
      errorType?: string;
    }
  ): Promise<any> {
    switch (action) {
      case "validated":
        return this.validateTicket(id);
      case "declined":
        return this.declineTicket(id);
      case "completed":
        if (!data?.fulfillerId || !data?.paymentImageUrl) {
          throw new Error("Missing required data for completing ticket");
        }
        return this.completeTicket(id, data.fulfillerId, data.paymentImageUrl);
      case "processing":
        return this.processingTicket(id);
      case 'reported':
        const response = await api.put<Ticket>(`/tickets/${id}/report`,{
          paymentImageUrl: data?.paymentImageUrl,
          errorType: data?.errorType
        });
        return response.data;
      default:
        throw new Error("Invalid ticket status update action");
    }
  },
};
