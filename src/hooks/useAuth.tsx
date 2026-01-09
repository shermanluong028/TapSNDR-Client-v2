import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, User, RegisterDto, ResetPasswordDto } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: ResetPasswordDto) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored token and user data
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      if (!response || !response.accessToken) {
        throw new Error("Invalid response from server");
      }

      const { accessToken, ...userData } = response;
      setUser({ ...userData, email: userData.email || "" });
      setIsAuthenticated(true);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
      return { ...userData, email: userData.email || "" };
    } catch (error) {
      throw new Error("Invalid email or password");
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      const response = await authService.register(data);

      if (!response) {
        throw new Error("Invalid response from server");
      }

      const { ...userData } = response;
      setUser({ ...userData, email: userData.email || "" });
      // setIsAuthenticated(true);
      // localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      throw new Error("Registration failed. Email might already be in use.");
    }
  };
        
  const changePassword = async (data: ResetPasswordDto) => {
    try {
      const response = await authService.resetPassword(data);

      if (!response) {
        throw new Error("Invalid response from server");
      }

      // const { ...userData } = response;
      // setUser({ ...userData, email: userData.email || "" });
      // setIsAuthenticated(true);
      // localStorage.setItem("token", accessToken);
      // localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      console.log({error})
      throw new Error(`Registration failed. ${error.response.data.message}`);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
