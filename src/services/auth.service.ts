import { api } from "./api";
import axios from "axios";

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  status: string;
  last_login: string;
  last_activity: string;
  phone: string;
  failed_login_attempts: number;
  last_login_attempt: string;
  roles: Role[];
}

export interface AuthResponse {
  id: number;
  username: string;
  email?: string;
  status: string;
  last_login: string;
  last_activity: string;
  phone: string;
  failed_login_attempts: number;
  last_login_attempt: string;
  password_changed_at: string | null;
  roles: Role[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  accessToken: string;
}

export interface LoginDto {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}

export interface ResetPasswordDto {
  email: string;
  password: string;
  newPassword: string;
}

export class AuthService {
  private apiUrl = process.env.API_URL;
  async login(credentials: LoginDto): Promise<AuthResponse> {

    const response = await axios.post<AuthResponse>(
      `${this.apiUrl}/auth/login`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  }

  async logout(): Promise<{ message: string; timestamp: string }> {
    const token = localStorage.getItem("token");
    const response = await axios.post<{ message: string; timestamp: string }>(
      `${this.apiUrl}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
  
  async resetPassword(data: ResetPasswordDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/reset", data);
    return response.data;
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }
}

export const authService = new AuthService();
