import { api } from "./api";
import { newApi } from "./newApi";
export type TokenType = "ETH" | "BTC" | "USDT" | "THB" | "USDC";
export type WalletType = "ETH";

export interface Wallet {
  id: number;
  type: "CUSTOMER" | "FULFILLER";
  balance: number;
  userId: number;
  address: string;
  created_at: string;
  updated_at: string;
  token_type?: TokenType;
}

export interface CryptoTransaction {
  id: number;
  transaction_type: string;
  amount: number;
  description?: string;
  reference_id?: string;
  created_at: string;
  status: string;
  token_type: string;
  transaction_hash?: string;
  user_id_from?: number;
  user_id_to?: number;
  address_from?: string;
  address_to?: string;
}

export interface SendTransactionDto {
  amount: number;
  description?: string;
  reference_id?: string;
  status?: string;
  token_type: string;
  transaction_hash?: string;
  user_id_from?: number;
  user_id_to?: number;
  address_from?: string;
  address_to?: string;
}

export interface ConnectWalletDto {
  type: WalletType;
  tokenType: TokenType;
  walletAddress: string;
}

export interface EthereumWalletDto {
  id: number;
  type: "ETH";
  address: string;
  balance: number;
  privateKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateKeyResponse {
  privateKey: string;
}

export interface PublicKeyResponse {
  publicKey: string;
}

export interface Transaction {
  id: number;
  wallet_id: number;
  amount: number;
  type: "DEPOSIT" | "WITHDRAW";
  status: "PENDING" | "COMPLETED" | "FAILED";
  created_at: string;
}

export interface TransactionDto {
  type: "DEPOSIT" | "WITHDRAW";
  amount: number;
  token_type: TokenType;
  wallet_id?: number;
  description?: string;
  reference_id?: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  user_id_from?: number;
  user_id_to?: number;
  address_from?: string;
  address_to: string | null;
  transaction_hash?: string;
}

export const walletService = {
  async getWallets(): Promise<Wallet[]> {
    const response = await api.get<Wallet[]>("/wallet/wallets");
    return response.data;
  },
  async checkWallet(wallet: String): Promise<boolean> {
    try {
      const response = await api.get("/wallet/check?address=" + wallet);
      return response.data.status;
    } catch (error: any) {
      console.error("Error checking wallet:", error);
      return false;
    }
  },

  async getAdminWallets(): Promise<any> {
    try {
      const response = await api.get<Wallet[]>("/wallet/wallets/admin");
      return {...response.data, status: true};
    } catch (error: any) {
      return {status: false, error: error.response.data.message}
    }
  },

  async getDepositWallet(amount: string, address_from: string): Promise<any> {
    try {
      const response = await newApi.get<Wallet[]>(`/deposit/address?amount=${amount}&address_from=${address_from}`);
      return {...response.data};
    } catch (error: any) {
      return {status: false, error: error.response.data.message}
    }
  },

  async getFulfillerWallets(): Promise<Wallet[]> {
    const response = await api.get<Wallet[]>("/wallet/wallets/fulfiller");
    return response.data;
  },

  async getWallet(type: "ETH"): Promise<Wallet> {
    const response = await api.get<Wallet>(`/wallet/${type}`);
    return response.data;
  },

  async createWallet(data: ConnectWalletDto): Promise<Wallet> {
    const response = await api.post<Wallet>("/wallet/create", data);
    return response.data;
  },

  async createEthereumWallet(): Promise<EthereumWalletDto> {
    const response = await api.post<EthereumWalletDto>(
      "/wallet/create/ethereum"
    );
    return response.data;
  },

  async getPrivateKey(userId: number, walletId: number): Promise<string> {
    const response = await api.get<PrivateKeyResponse>(
      `/wallet/private-key/${userId}/${walletId}`
    );
    return response.data.privateKey;
  },

  async getPublicKey(walletId: number): Promise<string> {
    const response = await api.get<PublicKeyResponse>(
      `/wallet/public-key/${walletId}`
    );
    return response.data.publicKey;
  },

  async connectWallet(data: ConnectWalletDto): Promise<Wallet> {
    try {
      const response = await api.post<Wallet>("/wallet/connect", data);
      return response.data;
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.response?.status === 401) {
        // Handle unauthorized access - token might be missing or expired
        console.error("Authentication error. Please log in again.");
      } else if (error.response?.status === 403) {
        // Handle forbidden access - user doesn't have required roles
        console.error(
          "Access forbidden. You don't have permission to connect a wallet."
        );
      } else if (error.response?.status === 404) {
        // Handle not found error
        console.error(
          "Wallet endpoint not found. Please check if the backend server is running."
        );
      }
      throw error;
    }
  },

  async getTransactions(walletId: number): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(
      `/wallet/${walletId}/transactions`
    );
    return response.data;
  },

  async createTransaction(data: {
    wallet_id: number;
    amount: number;
    type: "DEPOSIT" | "WITHDRAW";
    token_type?: TokenType;
    description?: string;
  }): Promise<Transaction> {
    const transactionData = {
      ...data,
      token_type: data.token_type || "USDC",
      description: data.description || `${data.type} transaction`,
      status: "PENDING",
    };

    // Use the appropriate endpoint based on the transaction type
    const endpoint =
      data.type === "DEPOSIT" ? "/wallet/deposit" : "/wallet/withdraw";
    const response = await api.post<Transaction>(endpoint, transactionData);
    return response.data;
  },

  async deposit(data: TransactionDto): Promise<Wallet> {
    // Ensure the data has the required fields for CryptoTransactionDto
    const cryptoTransactionData = {
      ...data,
      token_type: data.token_type || "USDC",
      description: data.description || "Deposit transaction",
      status: data.status || "PENDING",
    };

    const response = await api.post<Wallet>("/wallet/deposit", data);
    return response.data;
  },

  async depositNewApi(data: any): Promise<any> {
    // Ensure the data has the required fields for CryptoTransactionDto
    const response = await newApi.post<any>("/deposit", data);
    return response.data;
  },

  async createWithdrawRequest({ amount, to }: { amount: number; to: string }): Promise<any> {
    try {
      const response = await newApi.post("/withdrawals", { amount, to });
      return response.data;        
    } catch (error: any) {
      return {status: false, error: error?.response?.data?.message || "An error occurred" }
    }
  },

  async withdraw(data: TransactionDto): Promise<Wallet> {
    // Ensure the data has the required fields for CryptoTransactionDto
    const cryptoTransactionData = {
      ...data,
      token_type: data.token_type || "USDC",
      description: data.description || "Withdrawal transaction",
      status: data.status || "PENDING",
    };

    const response = await api.post<Wallet>(
      "/wallet/withdraw",
      cryptoTransactionData
    );
    return response.data;
  },

  async getCryptoTransactions(): Promise<CryptoTransaction[]> {
    const response = await api.get<CryptoTransaction[]>("/wallet/transactions");
    return response.data;
  },

  async processCryptoTransactions(): Promise<CryptoTransaction[]> {
    const response = await api.get<CryptoTransaction[]>("/wallet/transactions");
    return response.data;
  },

  async updateTransaction(
    id: number,
    data: Partial<CryptoTransaction>
  ): Promise<CryptoTransaction> {
    const response = await api.patch<CryptoTransaction>(
      `/wallet/transactions/${id}`,
      data
    );
    return response.data;
  },

  async sendTransaction(
    data: SendTransactionDto
  ): Promise<{ transaction_hash: string; status: string }> {
    const response = await api.post<{
      transaction_hash: string;
      status: string;
    }>("/wallet/send", data);
    return response.data;
  },

  async getWalletAddress(amount: String): Promise<boolean> {
    const response = await api.post<any>("/wallet/validate", { amount });
    return response.data.message;
  }
};
