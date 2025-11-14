// actions/task/deleteTask.ts
"use server"

import { revalidateTag } from "next/cache"
import { universalApi } from "../universal-api"

export async function deleteTask(taskId: string) {
  try {
    console.log("🗑️ Deleting task:", taskId)

    const result = await universalApi({
      endpoint: `/tasks/${taskId}`,
      method: "DELETE",
      requireAuth: true,
    })

    console.log("✅ Delete task result:", result)

    // Cache revalidate করুন
    revalidateTag("tasks")
    revalidateTag(`task-${taskId}`)

    return result

  } catch (err: unknown) {
    console.error("❌ Delete task error:", err)
    
    let errorMessage = "Failed to delete task"
    
    if (err instanceof Error) {
      errorMessage = err.message || errorMessage
    }
    
    return {
      success: false,
      message: errorMessage,
      data: null
    }
  }
}