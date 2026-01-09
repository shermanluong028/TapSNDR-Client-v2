import { Route, Routes, Navigate } from "react-router-dom";
import { ClientTicketPage } from "./ClientTicket";
import { ClientPaymentPage } from "./ClientPayment";
import { ClientSettingsPage } from "./Settings";

export const Client = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/client/payment" />} />
      <Route path="/ticket" element={<ClientTicketPage />} />
      <Route path="/payment" element={<ClientPaymentPage />} />
      <Route path="/settings" element={<ClientSettingsPage />} />
    </Routes>
  );
};
