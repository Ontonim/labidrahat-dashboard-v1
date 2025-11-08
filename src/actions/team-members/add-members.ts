"use server";

import { MemberFormData } from "@/types/team-members/team-members";
import { universalApi } from "../universal-api";

export async function addMember(data: MemberFormData) {
  try {
    if (!data.name || !data.email || !data.password || !data.image) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }
    console.log(data);
    const result = await universalApi({
      endpoint: "/members",
      method: "POST",
      data: data,
      requireAuth: true,
    });
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to create adding member",
      };
    }

    return {
      success: true,
      message: "Member added successfully!",
    };
  } catch (error) {
    console.error("Error adding member:", error);
    return {
      success: false,
      error: "Failed to add member. Please try again.",
    };
  }
}
