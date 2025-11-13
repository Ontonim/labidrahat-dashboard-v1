"use client"

import { Edit2, Eye, AlertCircle, Users, Calendar } from "lucide-react"
import { useState } from "react"
import { updateTask } from "@/actions/task/updateTask"
import { Task, TaskStatus } from "@/types/task/task"

export default function TaskCard({
  task,
  onViewDetails,
  onEdit,
  isAdmin,
}: {
  task: Task,
  onViewDetails: (task: Task) => void
  onEdit: (task: Task) => void
  isAdmin: boolean
}) {
  const [status, setStatus] = useState(task.status)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setLoading(true)
    try {
      await updateTask({ status: newStatus }, task._id)
      setStatus(newStatus)
    } catch (error) {
      console.error("Failed to update status", error)
      setStatus(status)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-900 text-green-200"
      case "in progress":
        return "bg-yellow-900 text-yellow-200"
      default:
        return "bg-gray-700 text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-all shadow-md hover:shadow-xl hover:shadow-blue-500/10">
      {/* Header with title and actions */}
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-base line-clamp-2 leading-tight">{task.title}</h3>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={() => onViewDetails(task)}
            className="text-slate-400 hover:text-white hover:bg-slate-700 transition p-2 rounded-lg"
            title="View details"
          >
            <Eye size={18} />
          </button>
          {isAdmin && (
            <button
              onClick={() => onEdit(task)}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition p-2 rounded-lg"
              title="Edit task"
            >
              <Edit2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>

      <div className="space-y-3 mb-4">
        {/* Priority Badge */}
        {task.priority && (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border ${getPriorityColor(
              task.priority,
            )}`}
          >
            <AlertCircle size={14} />
            {task.priority}
          </span>
        )}

        {/* Assignee */}
        {task.assignee && task.assignee.length > 0 && (
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-3 hover:border-slate-500 transition">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-200 font-semibold text-sm truncate">{task.assignee[0]?.name || "Unknown"}</p>
                <p className="text-slate-400 text-xs truncate">{task.assignee[0]?.role || "No role"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar size={14} className="flex-shrink-0" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      {/* Status selector - everyone can change status */}
      <div className="flex gap-2 items-center">
        <span className="text-xs text-slate-500 font-medium">Status:</span>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          disabled={loading}
          className={`text-sm rounded-lg px-3 py-1.5 ${getStatusColor(status)} bg-opacity-20 border border-current focus:outline-none focus:ring-2 focus:ring-slate-500 transition ${
            loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <option value="to do">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  )
}
