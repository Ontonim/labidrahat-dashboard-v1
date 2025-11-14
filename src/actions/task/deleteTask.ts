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

  } catch (error: any) {
    console.error("❌ Delete task error:", error)
    
    return {
      success: false,
      message: error.message || "Failed to delete task",
      data: null
    }
  }
}