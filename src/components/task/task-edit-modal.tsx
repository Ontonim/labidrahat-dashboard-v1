"use client"

import type React from "react"
import { X, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { updateTask } from "@/actions/task/updateTask"
import { Task, TaskPriority, TaskStatus } from "@/types/task/task"
interface FormData {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
}

export default function TaskEditModal({
  open,
  onClose,
  task,
  onTaskUpdated,
}: {
  open: boolean
  onClose: () => void
  task: Task
  onTaskUpdated: () => void
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "to do",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Sync formData whenever task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        status: task.status || "to do",
      })
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await updateTask(formData as FormData, task._id)
      onTaskUpdated()
      onClose()
    } catch (err) {
      setError("Failed to update task. Please try again.")
      console.error("Failed to update task", err)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "border-red-500 bg-red-500/10 text-red-400"
      case "medium":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-400"
      case "low":
        return "border-green-500 bg-green-500/10 text-green-400"
      default:
        return "border-gray-500 bg-gray-500/10 text-gray-400"
    }
  }

  if (!open || !task) return null

  return (
    <div className="fixed inset-0  bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-2xl font-bold text-white">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition p-1 hover:bg-slate-700 rounded-lg"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-gray-400 text-sm font-semibold block mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
              placeholder="Task title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-400 text-sm font-semibold block mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition resize-none"
              placeholder="Task description"
              rows={4}
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm font-semibold flex items-center gap-2 block mb-2">
                <AlertCircle size={16} />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className={`w-full px-4 py-2.5 bg-slate-700/50 border rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition ${getPriorityColor(
                  formData.priority
                )}`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-semibold block mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
              >
                <option value="to do">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="border-t border-slate-700 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
