import React, { useRef, useState } from "react";
import {
  sendTelegramPhoto,
  sendTelegramMessage,
  uploadPhoto,
  uploadPhotos,
  sendTelegramPhotos,
} from "../services/telegram.service";
import { formDomains } from "../constants/FormDomain";
import { Ticket } from "../pages/Fulfiller/FulfillerTicket/view";
import { ticketService } from "../services/ticket.service";
import { useAuth } from "../hooks/useAuth";
import { useAlert } from "../contexts/AlertContext";
interface PaymentMethodModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  isDarkMode: boolean;
  onClose: () => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  ticket,
  isDarkMode,
  onClose,
}) => {
  if (!isOpen) return null;

  const { user } = useAuth();
  const { showAlert } = useAlert();
  const completionInputRef = useRef<HTMLInputElement>(null);
  const errorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div  
        className={`${
          isDarkMode ? "bg-[#1F2937]" : "bg-white"
        } rounded-lg p-6 w-[600px] shadow-xl border border-gray-600 `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Payment Methods
          </h2>
          <button
            onClick={onClose}
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <hr className="mb-3" />
        <div className="modal-body max-h-[calc(100vh-200px)]  overflow-auto">
         {
            ticket?.payment_details?.map((method: any, index: any) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {method.method.method_name}
                    </h3>
                    {method.tag && <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <strong>Tag:</strong> {method.tag}
                    </p>}
                    { method.account_name && <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <strong>Account Name:</strong> {method.account_name}
                    </p>}
                    {method.email && (
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <strong>Email:</strong> {method.email}
                    </p>
                    )}
                    {method.phone_number && (
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <strong>Phone Number:</strong> {method.phone_number}
                    </p>
                    )}
                    {method.qrcode_url && (
                    <div className="mt-2 place-self-center">
                        <a href={method.qrcode_url} target="_blank">
                        <img
                        src={method.qrcode_url}
                        alt={`${method.method.method_name} QR Code`}
                        className="w-32 h-32 object-contain"
                        />
                        </a>
                    </div>
                    )}
                </div>
                ))
         }
        </div>

        <hr className="mt-3 mb-3" />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`mr-2 px-4 py-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-white hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
