import { api } from "./api";
import { WalletBalance } from "../types/wallet";

export interface CryptoTransaction {
  id: number;
  type: string;
  amount: number;
  description?: string;
  reference_id?: string;
  created_at: string;
  status: string;
  token_type: string;
  transaction_hash?: string;
}

class WalletService {
  private api = api;

  async getWalletBalance(type: string): Promise<WalletBalance> {
    const response = await this.api.get(`/wallet/balance/${type}`);
    return response.data;
  }

  async getCryptoTransactions(): Promise<{
    transactions: CryptoTransaction[];
  }> {
    const response = await this.api.get("/wallet/transactions");
    return response.data;
  }
}

export const walletService = new WalletService();
