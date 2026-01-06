export interface WalletBalance {
  balance: number;
  lastUpdated: string;
}

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
