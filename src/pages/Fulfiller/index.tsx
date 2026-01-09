import { Route, Routes, Navigate } from "react-router-dom";
import { FulfillerTicketPage } from "./FulfillerTicket";
import { FulfillerPaymentPage } from "./FulfillerPayment";
import { FulfillerSettingsPage } from "./Settings";

export const Fulfiller = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/fulfiller/payment" />} />
      <Route path="/ticket" element={<FulfillerTicketPage />} />
      <Route path="/payment" element={<FulfillerPaymentPage />} />
      <Route path="/settings" element={<FulfillerSettingsPage />} />
    </Routes>
  );
};
