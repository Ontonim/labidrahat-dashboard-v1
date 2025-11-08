"use server";

import { DashboardOverviewResponse } from "@/types/dashboard-overview/dashboard";
import { universalApi } from "../universal-api";

export async function getDashboardOverview() {
  const result = await universalApi<DashboardOverviewResponse>({
    endpoint: "/dashboard-overview",
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to fetch dashboard overview",
      data: null,
    };
  }

  return {
    success: true,
    message: result.data?.message || "Dashboard overview fetched successfully",
    data: result.data?.data || null,
  };
}
