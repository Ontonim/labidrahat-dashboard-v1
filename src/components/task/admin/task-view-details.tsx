"use client"

import { Assignee, Task, TaskPriority } from "@/types/task/task"
import { X, Mail, Briefcase, User, Calendar, Clock, AlertCircle } from "lucide-react"

export default function TaskDetailsModal({
  open,
  onClose,
  task,
  
}: {
  open: boolean
  onClose: () => void
  task: Task

}) {
  if (!open || !task) return null

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-400 bg-red-900 bg-opacity-30 border-red-900"
      case "medium":
        return "text-yellow-400 bg-yellow-900 bg-opacity-30 border-yellow-900"
      case "low":
        return "text-green-400 bg-green-900 bg-opacity-30 border-green-900"
      default:
        return "text-gray-400 bg-gray-900 bg-opacity-30 border-gray-900"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-400 bg-green-900 bg-opacity-30 border-green-900"
      case "in progress":
        return "text-yellow-400 bg-yellow-900 bg-opacity-30 border-yellow-900"
      default:
        return "text-gray-400 bg-gray-900 bg-opacity-30 border-gray-900"
    }
  }

  return (
    <div className="fixed inset-0  bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-2xl font-bold text-white">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition p-1 hover:bg-slate-700 rounded-lg"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="text-gray-400 text-sm font-semibold block mb-2">Title</label>
            <p className="text-white text-lg font-semibold">{task.title}</p>
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-400 text-sm font-semibold block mb-2">Description</label>
            <p className="text-gray-300 text-sm leading-relaxed bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              {task.description}
            </p>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm font-semibold flex items-center gap-2 block mb-2">
                <AlertCircle size={16} />
                Priority
              </label>
              <div>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${getPriorityColor(task.priority as TaskPriority)}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {task.priority || "Not Set"}
                </span>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm font-semibold flex items-center gap-2 block mb-2">
                <Clock size={16} />
                Status
              </label>
              <div>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(task.status)}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {task.status || "Not Set"}
                </span>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-gray-400 text-sm font-semibold flex items-center gap-2 block mb-2">
              <Calendar size={16} />
              Due Date
            </label>
            <p className="text-gray-300 text-sm bg-slate-700/30 rounded-lg p-3 border border-slate-600">
              {task.dueDate ? formatDate(task.dueDate) : "Not Set"}
            </p>
          </div>

          {task.assignee && task.assignee.length > 0 && (
            <div>
              <label className="text-gray-400 text-sm font-semibold flex items-center gap-2 block mb-3">
                <User size={16} />
                Assignees
              </label>
              <div className="space-y-3">
                {task.assignee.map((assignee: Assignee, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-700/40 border border-slate-600 rounded-lg p-4 hover:border-slate-500 hover:bg-slate-700/50 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <User size={24} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold text-base">{assignee.name}</h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Mail size={14} className="text-gray-500 flex-shrink-0" />
                            <span className="truncate">{assignee.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Briefcase size={14} className="text-gray-500 flex-shrink-0" />
                            <span>{assignee.role || "No role assigned"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Created At and Updated At */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-700">
            <div>
              <label className="text-gray-400 text-sm font-semibold block mb-2">Created At</label>
              <p className="text-gray-300 text-xs bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                {formatDate(task.createdAt)}
              </p>
            </div>
            <div>
              <label className="text-gray-400 text-sm font-semibold block mb-2">Updated At</label>
              <p className="text-gray-300 text-xs bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                {formatDate(task.updatedAt)}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-6 flex justify-end gap-3 bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
