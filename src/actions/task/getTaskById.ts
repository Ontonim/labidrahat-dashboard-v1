"use server"

import { universalApi } from "../universal-api"

export async function getTaskById(taskId: string) {
  if (!taskId) throw new Error("Task ID is required")

  return await universalApi({
    endpoint: `/tasks/${taskId}`,
    method: "GET",
    requireAuth: true,
  })
}
