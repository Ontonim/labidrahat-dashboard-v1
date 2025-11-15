"use server";

import { cookies } from "next/headers";
import { universalApi } from "../universal-api";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await universalApi<{
    data: { accessToken: string };
    user: unknown;
  }>({
    endpoint: "/auth/login",
    method: "POST",
    data: { email, password },
    requireAuth: false,
  });

  if (result.success && result.data) {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", result?.data?.data?.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      success: true,
      message: "Login successful",
      user: result.data.user,
    };
  }

  return {
    success: false,
    message: result.message || "Login failed",
  };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");

  return {
    success: true,
    message: "Logged out successfully",
  };
}
