import { Task } from "@/types/task/task"
import { universalApi } from "../universal-api"

interface GetTasksParams {
  page?: number
  limit?: number
  status?: string // server-side filter
}

export async function getTasks(params?: GetTasksParams): Promise<{ data: Task[]; message: string }> {
  const query = new URLSearchParams()
  if (params?.page) query.append("page", params.page.toString())
  if (params?.limit) query.append("limit", params.limit.toString())
  if (params?.status) query.append("status", params.status)

  const result = await universalApi<{
    StatusCode: number
    success: boolean
    message: string
    data: Task[]
  }>({
    endpoint: `/tasks?${query.toString()}`,
    method: "GET",
    requireAuth: true,
  })

  if (!result.success) {
    return { data: [], message: result.message || "Failed to fetch tasks" }
  }

  return { data: result?.data?.data||[], message: result?.data?.message || "Tasks fetched successfully" }
}
