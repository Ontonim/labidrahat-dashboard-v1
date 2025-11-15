"use client";

export function getCookie(name: string): string | null {
  try {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith("'") && cookie.endsWith("'")) {
        cookie = cookie.slice(1, -1);
      }

      if (cookie.startsWith(name + "=")) {
        const value = cookie.substring(name.length + 1);
        return value;
      }
    }
    return null;
  } catch (error) {
    console.error("Cookie parsing error:", error);
    return null;
  }
}

export function isAdminFromAccess(): boolean {
  const token = getCookie("accessToken");
  if (!token) {
    return false;
  }
  // Decode JWT token and check for admin role
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }
    const payload = parts[1];
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const jsonPayload = atob(base64);
    const parsed = JSON.parse(jsonPayload);
    const isAdmin =
      parsed.access === "admin" ||
      parsed.role === "admin" ||
      parsed.isAdmin === true;

    return isAdmin;
  } catch (err) {
    console.error("Failed to parse accessToken:", err);
    return false;
  }
}
