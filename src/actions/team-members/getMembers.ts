"use server";

import {
  DeleteMemberResponse,
  Member,
  MembersResponse,
  MemberStatus,
} from "@/types/team-members/team-members";
import { universalApi } from "../universal-api";

interface GetMembersOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export async function getAllMembers(options: GetMembersOptions = {}) {
  const { page = 1, limit = 10, search, role, status } = options;

  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search) params.append("search", search);
  if (role) params.append("role", role);
  if (status) params.append("status", status);

  const queryString = params.toString();
  const endpoint = queryString ? `/members?${queryString}` : "/members";

  const result = await universalApi<MembersResponse>({
    endpoint,
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to fetch members",
      members: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };
  }

  return {
    success: true,
    message: result.data?.message || "Members fetched successfully",
    members: result.data?.data || [],
    meta: result.data?.meta || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
  };
}

export async function deleteMember(memberId: string) {
  if (!memberId) {
    return {
      success: false,
      message: "Member ID is required",
    };
  }

  const result = await universalApi<DeleteMemberResponse>({
    endpoint: `/members/delete/${memberId}`,
    method: "PATCH",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to delete member",
    };
  }

  return {
    success: true,
    message: result.data?.message || "Member deleted successfully",
  };
}

export async function getMemberById(memberId: string) {
  if (!memberId) {
    return {
      success: false,
      message: "Member ID is required",
      member: null,
    };
  }

  const result = await universalApi<{ data: Member }>({
    endpoint: `/members/${memberId}`,
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to fetch member",
      member: null,
    };
  }

  return {
    success: true,
    message: "Member fetched successfully",
    member: result.data?.data || null,
  };
}

export async function updateMemberStatus(
  memberId: string,
  status: MemberStatus
) {
  if (!memberId) {
    return {
      success: false,
      message: "Member ID is required",
    };
  }

  if (!["active", "inactive", "suspended"].includes(status)) {
    return {
      success: false,
      message: "Invalid status. Must be active, inactive, or suspended",
    };
  }

  const result = await universalApi({
    endpoint: `/members/${memberId}`,
    method: "PATCH",
    data: { status },
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to update member status",
    };
  }

  return {
    success: true,
    message: "Member status updated successfully",
  };
}

export interface MemberEmailResponse {
  StatusCode: number;
  success: boolean;
  message: string;
  data: string[];
}

export async function getAllMemberEmails(): Promise<{
  data: string[];
  message: string;
}> {
  try {
    const result = await universalApi<MemberEmailResponse>({
      endpoint: `/members/emails`,
      method: "GET",
      requireAuth: true,
    });
    if (!result.success) {
      return {
        data: [],
        message: result.message || "Failed to fetch member emails",
      };
    }

    return {
      data: result?.data?.data || [],
      message: result?.data?.message || "Member emails fetched successfully",
    };
  } catch (error) {
    console.error("❌ Error fetching member emails:", error);
    return {
      data: [],
      message: "Failed to fetch member emails",
    };
  }
}
