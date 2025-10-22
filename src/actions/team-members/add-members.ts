"use server";

import { MemberFormData } from "@/types/team-members/team-members";

export async function addMember(data: MemberFormData) {
  try {
    if (!data.name || !data.email || !data.password || !data.image) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    // TODO: Replace with your actual API
    console.log("Adding member:", data);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Member added successfully",
    };
  } catch (error) {
    console.error("[v0] Error adding member:", error);
    return {
      success: false,
      error: "Failed to add member. Please try again.",
    };
  }
}
