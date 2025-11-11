"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { createTask } from "@/actions/task/createTask"

interface CreateTaskModalProps {
  onClose: () => void
  onTaskCreated: () => void
}

export default function CreateTaskModal({ onClose, onTaskCreated }: CreateTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    try {
      setIsSubmitting(true)
      const formData = new FormData(e.currentTarget)
      const result = await createTask(formData)

      if (result.success) {
        onTaskCreated()
      } else {
        setError(result.message || "Failed to create task")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-lg bg-card shadow-lg">
          {/* Header */}
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Create New Task</h2>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
              <Input type="text" name="title" placeholder="Task title" required className="w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Task description"
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Assignee Email</label>
              <Input type="email" name="assigneeEmails" placeholder="team@example.com" className="w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                <select
                  name="status"
                  defaultValue="to do"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="to do">To Do</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                <select
                  name="priority"
                  defaultValue="medium"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Due Date</label>
              <Input type="date" name="dueDate" className="w-full" />
            </div>

            {/* Footer */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90">
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
