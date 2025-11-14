import { updateTaskSchema } from "@/components/task/TaskZodSchema/TaskZodSchema"
import { universalApi } from "../universal-api"
import type { TaskStatus, TaskPriority } from "@/types/task/task"

interface UpdateTaskPayload {
  title?: string
  
  description?: string
  assigneeEmails?: string[]
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  tags?: string[]
}

export async function updateTask(payloadRaw: UpdateTaskPayload, taskId: string) {
  if (!taskId) throw new Error("Task ID is missing")

  // Validate input
  const parsed = updateTaskSchema.parse(payloadRaw)

  const backendPayload: {
    title?: string
    description?: string
    assignee?: { email: string }[]
    status?: TaskStatus
    priority?: TaskPriority
    dueDate?: string
    tags?: string[]
  } = {}

  if (parsed.title) backendPayload.title = parsed.title
  if (parsed.description !== undefined) backendPayload.description = parsed.description
  if (parsed.assigneeEmails && parsed.assigneeEmails.length > 0)
    backendPayload.assignee = parsed.assigneeEmails.map((email) => ({ email }))
  if (parsed.status) backendPayload.status = parsed.status
  if (parsed.priority) backendPayload.priority = parsed.priority
  if (parsed.dueDate) backendPayload.dueDate = new Date(parsed.dueDate).toISOString()
  if (parsed.tags) backendPayload.tags = parsed.tags

  return await universalApi({
    endpoint: `/tasks/${taskId}`,
    method: "PATCH",
    data: backendPayload,
    requireAuth: true,
  })
}



