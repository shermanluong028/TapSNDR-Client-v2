import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/auth/Login";
import { AuthProvider } from "./hooks/useAuth";
import { AlertProvider } from "./contexts/AlertContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";
import { Client } from "./pages";
import { Fulfiller } from "./pages/Fulfiller";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetPasswordProfile from "./pages/auth/ResetPasswordProfile";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/*" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/reset-password" element={<ResetPasswordProfile />} />
      
      <Route path="/client/*" element={<Client />} />
      <Route path="/fulfiller/*" element={<Fulfiller />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AlertProvider>
            <div className="min-h-screen bg-gray-50 z-50">
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </div>
          </AlertProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
