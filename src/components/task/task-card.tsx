"use client"

import type React from "react"

import type { Task, Assignee, TaskStatus, TaskPriority } from "@/types/task/task"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"
import { useState } from "react"

interface TaskCardProps {
  task: Task
  onClick: () => void
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => Promise<void>
}

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export default function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, newStatus: TaskStatus) => {
    e.stopPropagation()
    if (!onStatusChange) return

    setIsUpdatingStatus(true)
    try {
      await onStatusChange(task._id, newStatus)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-border bg-card p-4 hover:border-primary hover:shadow-sm transition-all text-left"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-balance">{task.title}</h3>
          {task.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.description}</p>}

          {/* Meta Information */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {/* Assignees */}
            {task.assignee && task.assignee.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {task.assignee.slice(0, 2).map((assignee: Assignee) => (
                    <Avatar key={assignee.email} className="h-6 w-6 border border-background">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {assignee.name ? assignee.name.charAt(0).toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {task.assignee.length > 2 && (
                  <span className="text-xs text-muted-foreground">+{task.assignee.length - 2}</span>
                )}
              </div>
            )}

            {/* Priority */}
            {task.priority && (
              <Badge variant="secondary" className={`text-xs ${priorityColors[task.priority] || "bg-gray-100"}`}>
                {task.priority}
              </Badge>
            )}

            {/* Due Date */}
            {dueDate && <span className="text-xs text-muted-foreground">{dueDate}</span>}

            {onStatusChange && (
              <select
                value={task.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleStatusChange(e, e.target.value as TaskStatus)}
                disabled={isUpdatingStatus}
                className="text-xs px-2 py-1 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option value="to do">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            )}
          </div>
        </div>

        {/* Action Icon */}
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      </div>
    </button>
  )
}
