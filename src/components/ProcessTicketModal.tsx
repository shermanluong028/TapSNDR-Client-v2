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
interface ProcessTicketModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  isDarkMode: boolean;
  onClose: () => void;
  onTicketProcessed: () => void;
  afterReport: (amount: number) => void;
}

const ProcessTicketModal: React.FC<ProcessTicketModalProps> = ({
  isOpen,
  ticket,
  isDarkMode,
  onClose,
  onTicketProcessed,
  afterReport
}) => {
  if (!isOpen) return null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState<string>("complete");
  const [errorType, setErrorType] = useState<string>("errorCustomer");
  const [completionFiles, setCompletionFiles] = useState<File[]>([]);
  const [errorFiles, setErrorFiles] = useState<File[]>([]);
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const completionInputRef = useRef<HTMLInputElement>(null);
  const errorInputRef = useRef<HTMLInputElement>(null);

  const handleCompletionFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setCompletionFiles(Array.from(e.target.files));
    }
  };

  const handleErrorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setErrorFiles(Array.from(e.target.files));
    }
  };

  const formRef = useRef<HTMLFormElement | null>(null);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);
  const ticketIdRef = useRef<HTMLInputElement | null>(null);

  const submitProcessTicket = async () => {
    if (!ticket || !user) {
      return;
    }

    setIsProcessing(true);

    // Create the message
    var message = `${
      action === "complete" ? "✅ Ticket completed!" : "⚠️ ERROR REPORTED"
    }
🎫 ID: ${ticket?.ticket_id}
💰 Amount: ${ticket?.amount}
👤 Facebook: ${ticket?.facebook_name}
🎮 Game: ${ticket?.game}
🆔 Game ID: ${ticket?.game_id}`;

    var errorTypeMsg =
      errorType == "errorCustomer"
        ? "ERROR_CUSTOMER"
        : errorType == "errorInfo"
        ? "ERROR_INFO"
        : "ERROR_ADMIN";
    var errorTypeDetails =
      errorType == "errorCustomer"
        ? "Customer account info cannot be found"
        : errorType == "errorInfo"
        ? "Customer information doesn't match"
        : "Cannot fulfill, please contact admin";
    if (action !== "complete") {
      message += `\n\n🚫Error Type: ${errorTypeMsg}
      🔍Details: ${errorTypeDetails}`;
    }

    // Ensure that TELEGRAM_BOT_TOKEN is defined and is a string
    if (process.env.TELEGRAM_BOT_TOKEN) {
      // Use the token
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      // Your code that uses the botToken
      try {
        if (action === "complete") {
          if (completionFiles.length > 0) {
            // const file = await uploadPhoto(completionFiles[0]);
            const files = await uploadPhotos(completionFiles);
            const ticketId = ticket.ticket_id;
            // post ticket compelete to backend
            await ticketService.completeTicket(ticketId, user.id, files.fileUrls);
            if (files.message === "success") {
              try {
                onTicketProcessed();
              } catch (err) {
              } finally {
                setIsProcessing(false);
              }
            } else {
              onTicketProcessed();
            }
          } else {
            showAlert("info", "Please upload completion images");
          }
        } else {
            const file =
            errorFiles.length > 0 ? await uploadPhoto(errorFiles[0]) : null;
            const result = await ticketService.updateTicketStatus(
              ticket.ticket_id,
              "reported",
              {paymentImageUrl: file?.fileUrl, errorType}
            );
            if (result.error) {
              showAlert("error", result.error);
              setIsProcessing(false);
              return;
            }
            afterReport(result.balance)
            onTicketProcessed();
            setIsProcessing(false);
          
        }
      } catch (err) {
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.error("TELEGRAM_BOT_TOKEN is not defined or is not a string");
      // Handle the case where the token is not available
    }
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div
        className={`${
          isDarkMode ? "bg-[#1F2937]" : "bg-white"
        } rounded-lg p-6 w-[600px] shadow-xl border border-gray-600`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Process Ticket
          </h2>
          <button
            onClick={onClose}
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
            disabled={isProcessing}
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
        <div className="modal-body">
          <form id="processTicketForm">
            <input type="hidden" id="processTicketId" name="ticket_id" />
            {/* Ticket ID Display */}
            <div
              className="alert alert-primary mb-3 text-left"
              id="ticketIdDisplay"
            >
              <strong>Ticket ID: {ticket?.ticket_id}</strong>{" "}
              <span id="displayTicketId"></span>
            </div>
            {/* Action Selection */}
            <div className="mb-3 flex flex-col">
              <label className="flex justify-start mb-2">Action</label>
              <div className="text-left ml-4">
                <label className="form-check-label" htmlFor="actionComplete">
                  <input
                    className="mr-2"
                    type="radio"
                    name="action"
                    id="actionComplete"
                    value="complete"
                    checked={action === "complete"}
                    onChange={() => setAction("complete")}
                  />
                  Complete Ticket
                </label>
              </div>
              <div className="text-left ml-4">
                <label className="form-check-label" htmlFor="actionError">
                  <input
                    className="mr-2"
                    type="radio"
                    name="action"
                    id="actionError"
                    value="report_error"
                    checked={action === "report_error"}
                    onChange={() => setAction("report_error")}
                  />
                  Report Error
                </label>
              </div>
            </div>
            <div className="container">
              {/* Completion Images Section */}
              <div
                id="completionSection"
                style={{ display: action === "complete" ? "block" : "none" }}
              >
                <div className="mb-3">
                  <p className="text-left mb-2">Upload Completion Images</p>
                  <div className="file-input-container">
                    <input
                      ref={completionInputRef}
                      type="file"
                      className="file-input"
                      id="completionImages"
                      name="completion_images[]"
                      // multiple
                      multiple
                      accept="image/*"
                      onChange={handleCompletionFileChange}
                    />
                    <div className="file-input-custom">
                      <button className="choose-files-btn">Choose Files</button>
                      <span className="file-chosen">
                        {completionFiles.length > 0
                          ? `${completionFiles.length} file${
                              completionFiles.length > 1 ? "s" : ""
                            } chosen`
                          : "No file chosen"}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  id="imagePreviewContainer"
                  className="image-preview-container"
                >
                  {completionFiles.map((file, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Images Upload */}
              <div
                id="errorSection"
                style={{
                  display: action === "report_error" ? "block" : "none",
                }}
              >
                <div className="flex-col mb-3">
                  <div className="flex px-16 form-check ">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="error_type"
                      id="errorCustomer"
                      value="ACCOUNT_NOT_FOUND"
                      checked={errorType === "errorCustomer"}
                      onChange={() => setErrorType("errorCustomer")}
                    />
                    <label
                      className="ml-2 form-check-label"
                      htmlFor="errorCustomer"
                    >
                      Customer account info cannot be found
                    </label>
                  </div>
                  <div className="flex px-16 form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="error_type"
                      id="errorInfo"
                      value="INVALID_PAYMENT"
                      checked={errorType === "errorInfo"}
                      onChange={() => setErrorType("errorInfo")}
                    />
                    <label
                      className="ml-2 form-check-label"
                      htmlFor="errorInfo"
                    >
                      Customer information doesn't match
                    </label>
                  </div>
                  <div className="flex px-16 form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="error_type"
                      id="errorAdmin"
                      value="CONTACT_HOST"
                      checked={errorType === "errorAdmin"}
                      onChange={() => setErrorType("errorAdmin")}
                    />
                    <label
                      className="ml-2 form-check-label"
                      htmlFor="errorAdmin"
                    >
                      Cannot fulfill, please contact admin
                    </label>
                  </div>
                </div>
                <div className="flex flex-col items-start mb-3">
                  <label className="text-left mb-2">
                    Upload Screenshots (Optional)
                  </label>
                  <div className="w-full file-input-container">
                    <input
                      ref={errorInputRef}
                      type="file"
                      className="file-input"
                      id="errorImages"
                      name="error_images[]"
                      // multiple
                      accept="image/*"
                      onChange={handleErrorFileChange}
                    />
                    <div className="file-input-custom">
                      <button className="choose-files-btn">Choose Files</button>
                      <span className="file-chosen">
                        {errorFiles.length > 0
                          ? `${errorFiles.length} file${
                              errorFiles.length > 1 ? "s" : ""
                            } chosen`
                          : "No file chosen"}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  id="errorImagePreviewContainer"
                  className="image-preview-container"
                >
                  {errorFiles.map((file, index) => (
                    <div key={index} className="image-preview">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <style>{`
                .file-input-container {
                  position: relative;
                }
                .file-input {
                  position: absolute;
                  top: 0;
                  left: 0;
                  opacity: 0;
                  width: 100%;
                  height: 100%;
                  cursor: pointer;
                  z-index: 2;
                }
                .file-input-custom {
                  display: flex;
                  align-items: center;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                  overflow: hidden;
                  background: #f8f9fa;
                }
                .choose-files-btn {
                  padding: 6px 12px;
                  background-color: #f0f0f0;
                  border: none;
                  border-right: 1px solid #ccc;
                  color: #333;
                  font-size: 14px;
                  cursor: pointer;
                }
                .file-chosen {
                  padding: 0 12px;
                  color: #6c757d;
                  font-size: 14px;
                }
                .image-preview-container {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 10px;
                  margin-top: 10px;
                }
                .image-preview {
                  width: 100px;
                  height: 100px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  overflow: hidden;
                }
                .image-preview img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
                .btn {
                  padding: 6px 12px;
                  border-radius: 4px;
                  cursor: pointer;
                }
                .btn-primary {
                  background-color: #0d6efd;
                  color: white;
                  border: 1px solid #0d6efd;
                }
                .btn-secondary {
                  background-color: #6c757d;
                  color: white;
                  border: 1px solid #6c757d;
                }
                .me-2 {
                  margin-right: 0.5rem;
                }
                .mt-4 {
                  margin-top: 1rem;
                }

              `}</style>
            </div>{" "}
          </form>
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
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitProcessTicket}
            className={`px-4 py-2 flex items-center space-x-2 rounded-lg ${
              isDarkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isProcessing}
          >
            {isProcessing && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            <span>{isProcessing ? "Processing..." : "Submit"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessTicketModal;
