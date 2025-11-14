"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { updateTask } from "@/actions/task/updateTask"
import { TaskStatus } from "@/types/task/task"

interface Task {
  _id: string
  id?: string
  title: string
  status: TaskStatus
}

export default function MyTaskStatusModal({
  open,
  onClose,
  task,
  onStatusUpdated,
}: {
  open: boolean
  onClose: () => void
  task: Task
  onStatusUpdated: () => void
}) {
  const [status, setStatus] = useState(task.status)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleStatusChange = async () => {
    setError("")
    setLoading(true)
    try {
      await updateTask({ status }, task._id || task.id || "")
      onStatusUpdated()
    } catch (err) {
      setError("Failed to update status")
      console.error("Failed to update status:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-sm border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Update Status</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Task: {task.title}</label>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">New Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value  as TaskStatus)}
            className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
          >
            <option value="to do">To Do</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStatusChange}
            disabled={loading || status === task.status}
            className={`flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium transition ${
              loading || status === task.status ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  )
}
