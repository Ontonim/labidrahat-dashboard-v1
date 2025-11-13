// utils/getCookie.ts - Fixed version
"use client";

export function getCookie(name: string): string | null {
  try {
    console.log("🔍 Searching for cookie:", name);
    console.log("All cookies:", document.cookie);
    
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      
      console.log(`Checking cookie: "${cookie}"`);
      
      // Remove single quotes from start and end if present
      if (cookie.startsWith("'") && cookie.endsWith("'")) {
        cookie = cookie.slice(1, -1);
      }
      
      // Check if this cookie starts with the name we want
      if (cookie.startsWith(name + '=')) {
        const value = cookie.substring(name.length + 1);
        console.log(`✅ Found cookie ${name}:`, value);
        return value;
      }
    }
    
    console.log(`❌ Cookie ${name} not found`);
    return null;
  } catch (error) {
    console.error("Cookie parsing error:", error);
    return null;
  }
}

export function isAdminFromAccess(): boolean {
  const token = getCookie("accessToken");
  if (!token) {
    // console.log("No accessToken found in cookies");
    return false;
  }

  try {
    console.log("Token found:", token.substring(0, 20) + "...");
    
    // Token parts check
    const parts = token.split(".");
    if (parts.length !== 3) {
      // console.error("Invalid token format - expected 3 parts, got:", parts.length);
      return false;
    }

    const payload = parts[1];
    // console.log("Payload:", payload);
    
    // Base64 decode with proper padding
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }
    
    const jsonPayload = atob(base64);
    // console.log("Decoded payload:", jsonPayload);
    
    const parsed = JSON.parse(jsonPayload);
    // console.log("Parsed token data:", parsed);
    
    // Check for admin access - adjust this based on your token structure
    const isAdmin = parsed.access === "admin" || parsed.role === "admin" || parsed.isAdmin === true;
    // console.log("Is admin:", isAdmin);
    
    return isAdmin;
  } catch (err) {
    console.error("Failed to parse accessToken:", err);
    return false;
  }
}