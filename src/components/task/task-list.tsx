"use client"

import type { Task, TaskStatus } from "@/types/task/task"
import TaskCard from "./task-card"
import { updateTask } from "@/actions/task/updateTask"
import { isAdminFromAccess } from "@/utils/isAdmin"

interface TaskListProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onTaskUpdated?: () => void
}

export default function TaskList({ tasks, onTaskClick, onTaskUpdated }: TaskListProps) {
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const isAdmin = isAdminFromAccess()
    if (isAdmin) return // Admins use the modal edit

    try {
      const result = await updateTask({ status: newStatus }, taskId)
      if (result.success && onTaskUpdated) {
        onTaskUpdated()
      }
    } catch (error) {
      console.error("Failed to update task status:", error)
    }
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} onStatusChange={handleStatusChange} />
      ))}
    </div>
  )
}
