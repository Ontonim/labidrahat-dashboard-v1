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