"use server";

import { ContactMessage, ContactsResponse } from "@/types/contact/contact";
import { universalApi } from "../universal-api";

export async function getAllContactMessages() {
  const result = await universalApi<ContactsResponse>({
    endpoint: "/contact",
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to fetch contact messages",
      messages: [],
    };
  }

  return {
    success: true,
    message: result.data?.message || "Messages retrieved successfully",
    messages: result.data?.data || [],
  };
}

export async function getContactMessageById(messageId: string) {
  if (!messageId) {
    return {
      success: false,
      message: "Message ID is required",
      contactMessage: null,
    };
  }

  const result = await universalApi<{ data: ContactMessage }>({
    endpoint: `/contact/${messageId}`,
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to fetch contact message",
      contactMessage: null,
    };
  }

  return {
    success: true,
    message: "Message fetched successfully",
    contactMessage: result.data?.data || null,
  };
}

export async function deleteContactMessage(messageId: string) {
  if (!messageId) {
    return {
      success: false,
      message: "Message ID is required",
    };
  }

  const result = await universalApi({
    endpoint: `/contact/${messageId}`,
    method: "DELETE",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to delete contact message",
    };
  }

  return {
    success: true,
    message: "Contact message deleted successfully",
  };
}
