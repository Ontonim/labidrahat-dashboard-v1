"use server"

import { createTaskSchema, updateTaskSchema } from "@/components/task/TaskZodSchema/TaskZodSchema"
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

  } catch (error: any) {
    console.error("❌ Create task error:", error);
    
    if (error.errors) {
      // Zod validation errors
      const errorMessages = error.errors.map((err: any) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      return {
        success: false,
        message: `Validation failed: ${errorMessages}`,
        data: null
      };
    }
    
    return {
      success: false,
      message: error.message || "Failed to create task",
      data: null
    };
  }
}

export async function updateTask(formData: FormData, taskId: string) {
  try {
    const raw = {
      title: formData.get("title") ? String(formData.get("title")) : undefined,
      description: formData.get("description") ? String(formData.get("description")) : undefined,
      assigneeEmails: formData.getAll("assigneeEmails").map(String).filter(email => email.trim() !== ""),
      status: formData.get("status") ? String(formData.get("status")) : undefined,
      priority: formData.get("priority") ? String(formData.get("priority")) : undefined,
      dueDate: formData.get("dueDate") ? String(formData.get("dueDate")) : undefined,
      tags: formData.getAll("tags").map(String).filter(Boolean),
    }

    // Filter out undefined values
    const filteredData = Object.fromEntries(
      Object.entries(raw).filter(([_, value]) => 
        value !== undefined && 
        !(Array.isArray(value) && value.length === 0)
      )
    );

    console.log("📝 Update form data:", filteredData);

    // Validate with Zod
    const parsed = updateTaskSchema.parse(filteredData)

    // Backend-compatible payload
    const payload: any = {}
    
    if (parsed.title) payload.title = parsed.title;
    if (parsed.description !== undefined) payload.description = parsed.description;
    if (parsed.assigneeEmails) {
      payload.assignee = parsed.assigneeEmails.map((email) => ({ 
        email: email.trim() 
      }));
    }
    if (parsed.status) payload.status = statusMap[parsed.status] || parsed.status;
    if (parsed.priority) payload.priority = priorityMap[parsed.priority] || parsed.priority;
    if (parsed.dueDate) payload.dueDate = new Date(parsed.dueDate).toISOString();
    if (parsed.tags) payload.tags = parsed.tags;

    console.log("🚀 Sending update payload:", payload);

    const result = await universalApi({
      endpoint: `/tasks/${taskId}`,
      method: "PATCH",
      data: payload,
      requireAuth: true,
    })

    return result;

  } catch (error: any) {
    console.error("❌ Update task error:", error);
    
    if (error.errors) {
      const errorMessages = error.errors.map((err: any) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      return {
        success: false,
        message: `Validation failed: ${errorMessages}`,
        data: null
      };
    }
    
    return {
      success: false,
      message: error.message || "Failed to update task",
      data: null
    };
  }
}