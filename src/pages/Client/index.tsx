import { Route, Routes, Navigate } from "react-router-dom";
import { ClientTicketPage } from "./ClientTicket";
import { ClientPaymentPage } from "./ClientPayment";

export const Client = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/client/payment" />} />
      <Route path="/ticket" element={<ClientTicketPage />} />
      <Route path="/payment" element={<ClientPaymentPage />} />
    </Routes>
  );
};
