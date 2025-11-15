"use client";

import { getCookie } from "@/lib/adminUtils";

export function getEmailFromToken(): string | null {
  const token = getCookie("accessToken");
  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("❌ Invalid JWT format");
      return null;
    }

    let payload = parts[1];

    // Base64URL -> Base64 convert
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding
    while (payload.length % 4) {
      payload += "=";
    }

    // Decode payload
    const decoded = atob(payload);
    const data = JSON.parse(decoded);
    // Extract email
    const email =
      data.email || data.userEmail || data.sub || data.username || null;

    return email;
  } catch (err) {
    console.error("❌ Failed to decode token:", err);
    return null;
  }
}
