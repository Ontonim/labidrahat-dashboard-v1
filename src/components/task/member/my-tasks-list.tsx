"use client"

import { useEffect, useState } from "react"
import { getTasksByEmail } from "@/actions/task/getTaskByEmail"
import { Loader } from 'lucide-react'
import { TaskPriority } from "@/types/task/task"
import MyTaskCard from "./my-task-card"

interface Task {
  _id: string
  id?: string
  title: string
  description: string
  status: "to do" | "in progress" | "completed"
  priority: TaskPriority
  dueDate: string
  assignee: Array<{ name: string; email: string; role: string }>
  createdAt: string
  updatedAt: string
}

export default function MyTasksList({ filter, email }: { filter: "to do" | "in progress" | "completed"; email: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadTasks()
  }, [email])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await getTasksByEmail()

      // Normalize response: support both { success, data } and raw array responses
      if (res && typeof res === "object" && "data" in res && Array.isArray((res as any).data)) {
        setTasks((res as any).data as Task[])
      } else if (Array.isArray(res)) {
        setTasks(res as Task[])
      } else {
        setTasks([])
      }
    } catch (err) {
      setError("Failed to load tasks")
      console.error("Failed to load tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = () => {
    loadTasks()
  }

  const filteredTasks = tasks.filter((task) => task.status === filter)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">{error}</div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg">No tasks assigned to you yet</p>
          <p className="text-gray-500 text-sm mt-2">Tasks assigned by admins will appear here</p>
        </div>
      </div>
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg">No {filter} tasks</p>
          <p className="text-gray-500 text-sm mt-2">You don't have any tasks in this status</p>
        </div>
      </div>
    )
  }

  return (
    <div className=" x-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <MyTaskCard key={task._id || task.id} task={task} onStatusUpdate={handleStatusUpdate} />
        ))}
      </div>
    </div>
  )
}
