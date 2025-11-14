"use server"

import { createTaskSchema } from "@/components/task/TaskZodSchema/TaskZodSchema"
import { universalApi } from "../universal-api"

const priorityMap: Record<string, "low" | "medium" | "high"> = {
  Low: "low",
  Medium: "medium", 
  High: "high",
  low: "low",
  medium: "medium",
  high: "high"
}

const statusMap: Record<string, "to do" | "in progress" | "completed"> = {
  "to do": "to do",
  "in progress": "in progress", 
  "completed": "completed",
  "To Do": "to do",
  "In Progress": "in progress",
  "Completed": "completed"
}

export async function createTask(formData: FormData) {
  try {
    const raw = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || undefined,
      assigneeEmails: formData.getAll("assigneeEmails").map(String).filter(email => email.trim() !== ""),
      status: String(formData.get("status") ?? "to do"),
      priority: String(formData.get("priority") ?? "medium"),
      dueDate: formData.get("dueDate") ? String(formData.get("dueDate")) : undefined,
      tags: formData.getAll("tags").map(String).filter(Boolean),
    }

    console.log("📝 Raw form data:", raw);

    // Validate with Zod
    const parsed = createTaskSchema.parse(raw)

    // Backend-compatible payload
    const payload = {
      title: parsed.title,
      description: parsed.description,
      assignee: parsed.assigneeEmails.map((email) => ({ 
        email: email.trim() 
      })),
      status: statusMap[parsed.status] || "to do",
      priority: priorityMap[parsed.priority] || "medium",
      dueDate: parsed.dueDate ? new Date(parsed.dueDate).toISOString() : undefined,
      tags: parsed.tags,
    }

    console.log("🚀 Sending payload:", payload);

    const result = await universalApi({
      endpoint: "/tasks",
      method: "POST",
      data: payload,
      requireAuth: true,
    })

    return result;

  } catch (err: unknown) {
    console.error("❌ Create task error:", err);
    
    // Zod validation errors
    if (err && typeof err === 'object' && 'errors' in err) {
      const error = err as { errors: Array<{ path: string[]; message: string }> };
      const errorMessages = error.errors.map((err) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      return {
        success: false,
        message: `Validation failed: ${errorMessages}`,
        data: null
      };
    }
    
    // Generic error
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message || "Failed to create task",
        data: null
      };
    }
    
    return {
      success: false,
      message: "Failed to create task",
      data: null
    };
  }
}