import { Task } from "@/types/task/task"
import { universalApi } from "../universal-api"
import { getEmailFromToken } from "@/utils/userEmail"

interface GetTasksParams {
  page?: number
  limit?: number
  status?: string
  searchTerm?: string
}

export async function getTasksByEmail(params?: GetTasksParams): Promise<{ data: Task[]; message: string }> {
  // Get email from token
  const email = getEmailFromToken();
  
  if (!email) {
    console.error("❌ No email found in token");
    return { data: [], message: "User email not found" };
  }
  // Build query parameters
  const query = new URLSearchParams()
  query.append("email", email)
  
  if (params?.page) query.append("page", params.page.toString())
  if (params?.limit) query.append("limit", params.limit.toString())
  if (params?.status) query.append("status", params.status)
  if (params?.searchTerm) query.append("searchTerm", params.searchTerm)

  // ✅ Correct endpoint ব্যবহার করুন
  const result = await universalApi<{
    StatusCode: number
    success: boolean
    message: string
    data: Task[]
  }>({
    endpoint: `/tasks/email?${query.toString()}`,
    method: "GET",
    requireAuth: true,
  })

  if (!result.success) {
    return { data: [], message: result.message || "Failed to fetch tasks" }
  }

  return { 
    data: result?.data?.data || [], 
    message: result?.data?.message || "Tasks fetched successfully" 
  }
}