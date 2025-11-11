// utils/isAdmin.ts (new file)
"use client";

import { getCookie } from "./getToken";
export function isAdminFromAccess(): boolean {
  const token = getCookie("accessToken");
  if (!token) {
    console.log("No accessToken found in cookies");
    return false;
  }

  try {
    console.log("Token found:", token.substring(0, 20) + "...");
    
    // Token parts check
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid token format - expected 3 parts, got:", parts.length);
      return false;
    }

    const payload = parts[1];
    console.log("Payload:", payload);
    
    // Base64 decode with proper padding
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }
    
    const jsonPayload = atob(base64);
    console.log("Decoded payload:", jsonPayload);
    
    const parsed = JSON.parse(jsonPayload);
    console.log("Parsed token data:", parsed);
    
    // Check for admin access - adjust this based on your token structure
    const isAdmin = parsed.access === "admin" || parsed.role === "admin" || parsed.isAdmin === true;
    console.log("Is admin:", isAdmin);
    
    return isAdmin;
  } catch (err) {
    console.error("Failed to parse accessToken:", err);
    return false;
  }
}