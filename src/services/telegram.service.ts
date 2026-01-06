import axios from "axios";
import path from "path";
import { api } from "./api";

// Define constants and types
const TELEGRAM_API = "https://api.telegram.org/bot"; // You'll need to add your bot token

type TelegramResponse = {
  ok: boolean;
  result?: {
    message_id: number;
    [key: string]: any;
  };
  description?: string;
};

/**
 * Sends a photo to a Telegram chat
 * @param chatId - The Telegram chat ID
 * @param photos - The Files or Blob objects to send
 * @param caption - Optional caption for the photo
 * @param parseMode - Parse mode for the caption (HTML, Markdown, etc.)
 * @param botToken - Your Telegram bot token
 * @returns Promise with the Telegram API response
 */
export async function sendTelegramPhoto(
  chatId: string | number,
  photo: File | Blob | string,
  caption: string | null = null,
  parseMode: "HTML" | "MarkdownV2" | "Markdown" = "HTML",
  botToken: string | undefined
): Promise<TelegramResponse> {
  const url = `${TELEGRAM_API}${botToken}/sendPhoto`;


  try {
    const formData = new FormData();
    formData.append("chat_id", chatId.toString());

    // Handle different photo input types
    if (typeof photo === "string") {
      // If it's a URL, pass it directly to Telegram
      if (photo.startsWith("http")) {
        formData.append("photo", photo);
      } else {
        // If it's a local path, we need to fetch it first (only works in Node.js environment)
        throw new Error(
          "Local file paths are not supported in browser environment"
        );
      }
    } else {
      // If it's a File or Blob object
      formData.append("photo", photo);
    }

    // Add caption if provided
    if (caption) {
      formData.append("caption", caption);
      formData.append("parse_mode", parseMode);
    }


    // Send the request
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const result: TelegramResponse = await response.json();

    if (!result.ok) {
      console.error("Failed to send photo:", result.description);
      return result;
    }
    return result;
  } catch (error) {
    console.error("Exception in sendTelegramPhoto:", error);
    return {
      ok: false,
      description: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendTelegramPhotos(
  chatId: string | number,
  photos: File[] | Blob[] | string[],
  caption: string | null = null,
  parseMode: "HTML" | "MarkdownV2" | "Markdown" = "HTML",
  botToken: string | undefined
): Promise<TelegramResponse> {
  const url = `${TELEGRAM_API}${botToken}/sendMediaGroup`;

  try {
    const formData = new FormData();
    formData.append("chat_id", chatId.toString());

    // Prepare media array
    const media = [];
    
    for (const [index, photo] of photos.entries()) {
      if (typeof photo === "string") {
        if (photo.startsWith("http")) {
          // URL photo
          media.push({
            type: "photo",
            media: photo,
            ...(index === 0 && caption ? { caption, parse_mode: parseMode } : {}),
          });
        } else {
          throw new Error("Local file paths are not supported in browser environment");
        }
      } else {
        // File/Blob photo - need to attach to formData
        const fileId = `photo${index}`;
        formData.append(fileId, photo);
        media.push({
          type: "photo",
          media: `attach://${fileId}`,
          ...(index === 0 && caption ? { caption, parse_mode: parseMode } : {}),
        });
      }
    }

    // Add media array as JSON string
    formData.append("media", JSON.stringify(media));

    // Send the request
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const result: TelegramResponse = await response.json();

    if (!result.ok) {
      console.error("Failed to send photos:", result.description);
      return result;
    }
    return result;
  } catch (error) {
    console.error("Exception in sendTelegramPhotos:", error);
    return {
      ok: false,
      description: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
/**
 * Sends a photo to a Telegram chat
 * @param chatId - The Telegram chat ID
 * @param caption - Optional caption for the photo
 * @param botToken - Your Telegram bot token
 * @returns Promise with the Telegram API response
 */
export async function sendTelegramMessage(
  chatId: string | number,
  caption: string | null = null,
  botToken: string | undefined
): Promise<TelegramResponse> {
  const url = `${TELEGRAM_API}${botToken}/sendMessage`;
  const data = {
    chat_id: chatId,
    text: caption,
  };

  try {
    // Using fetch API (modern browsers and Node.js 18+)
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData: TelegramResponse = await response.json();

    return responseData;
  } catch (error) {
    console.error(
      `Error sending Telegram message: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return {
      ok: false,
      description: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function uploadPhoto(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function uploadPhotos(files: File[]): Promise<any> {
  const formData = new FormData();
  
  // Append each file to FormData (can use `file[]` for array-style handling on the backend)
  files.forEach((file, index) => {
    formData.append("files", file); 
  });

  const response = await api.post("/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Required for file uploads
    },
  });
  
  return response.data;
}