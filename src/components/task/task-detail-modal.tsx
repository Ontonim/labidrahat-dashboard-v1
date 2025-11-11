"use client"

import type { Task, Assignee, TaskStatus, TaskPriority } from "@/types/task/task"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { isAdminFromAccess } from "@/utils/isAdmin"
import { updateTask } from "@/actions/task/updateTask"

interface TaskDetailModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onTaskUpdated: () => void
}

interface FormData {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  tags: string
}

export default function TaskDetailModal({ task, isOpen, onClose, onTaskUpdated }: TaskDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority || "medium",
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    tags: (task.tags || []).join(", "),
  })

  useEffect(() => {
    setIsAdmin(isAdminFromAccess())
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority || "medium",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      tags: (task.tags || []).join(", "),
    })
  }, [task])

  if (!isOpen) return null

  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null
  const createdAt = new Date(task.createdAt).toLocaleDateString()

  const handleAdminUpdate = async () => {
    try {
      setIsUpdating(true)
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority.toLowerCase() as "low" | "medium" | "high",
        dueDate: formData.dueDate,
        tags: formData.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => t),
      }

      const result = await updateTask(payload, task._id)
      if (result.success) {
        onTaskUpdated()
        setIsEditMode(false)
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleStatusUpdate = async (newStatus: TaskStatus) => {
    try {
      setIsUpdating(true)
      const result = await updateTask({ status: newStatus }, task._id)
      if (result.success) {
        setFormData((prev) => ({ ...prev, status: newStatus }))
        onTaskUpdated()
        setIsEditMode(false)
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl max-h-screen overflow-y-auto rounded-lg bg-card shadow-lg">
          {/* Header */}
          <div className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-card">
            <h2 className="text-xl font-bold text-foreground">Task Details</h2>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* ... rest of modal content ... */}
            {/* Use Assignee type properly */}
            {task.assignee && task.assignee.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Assigned To
                </p>
                <div className="space-y-2">
                  {task.assignee.map((assignee: Assignee) => (
                    <div key={assignee.email} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {assignee.name ? assignee.name.charAt(0).toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{assignee.name}</p>
                        <p className="text-xs text-muted-foreground">{assignee.email}</p>
                      </div>
                      {assignee.role && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          {assignee.role}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
