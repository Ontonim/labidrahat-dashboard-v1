"use server"

import { createTaskSchema } from "@/components/task/TaskZodSchema/TaskZodSchema"
import { universalApi } from "../universal-api"

const priorityMap: Record<string, "low" | "medium" | "high"> = {
  Low: "low",
  Medium: "medium",
  High: "high",
}

const statusMap: Record<string, "to do" | "in progress" | "completed"> = {
  "to do": "to do",
  "in progress": "in progress",
  "completed": "completed",
}

export async function createTask(formData: FormData) {
  const raw = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
    assigneeEmails: formData.getAll("assigneeEmails").map(String),
    status: String(formData.get("status") ?? "to do"),
    priority: String(formData.get("priority") ?? "medium"),
    dueDate: formData.get("dueDate") ? String(formData.get("dueDate")) : undefined,
    tags: formData.getAll("tags").map(String).filter(Boolean),
  }

  const parsed = createTaskSchema.parse(raw)

  // backend-compatible payload
  const payload = {
    title: parsed.title,
    description: parsed.description,
    assignee:
      parsed.assigneeEmails && parsed.assigneeEmails.length > 0
        ? parsed.assigneeEmails.map((email) => ({ email }))
        : [],
    status: statusMap[parsed.status ?? "to do"] || "to do",
    priority: priorityMap[parsed.priority ?? "medium"] || "medium",
    dueDate: parsed.dueDate ? new Date(parsed.dueDate).toISOString() : undefined,
    tags: parsed.tags,
  }

  return await universalApi({
    endpoint: "/tasks",
    method: "POST",
    data: payload,
    requireAuth: true,
  })
}
