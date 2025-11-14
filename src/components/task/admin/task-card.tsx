"use client"

import { Edit2, Eye, AlertCircle, Users, Calendar, Trash2 } from 'lucide-react'
import { useState } from "react"

import TaskEditModal from "./task-edit-modal"
import TaskDetailsModal from './task-view-details'
import { deleteTask } from '@/actions/task/deleteTask'

export default function TaskCard({
  task,
  onRefresh, // rename onEdit to onRefresh to make intention clear
  isAdmin,
}: {
  task: any
  onRefresh: () => void
  isAdmin: boolean
}) {
  const [deleting, setDeleting] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteTask(task._id || task.id)
      onRefresh() // only refresh list
    } catch (error) {
      console.error("Failed to delete task", error)
      alert("Failed to delete task")
    } finally {
      setDeleting(false)
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
      case "urgent":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-all shadow-md hover:shadow-xl hover:shadow-blue-500/10">

        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base line-clamp-2 leading-tight">{task.title}</h3>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={() => setDetailsOpen(true)}
              className="text-slate-400 hover:text-white hover:bg-slate-700 transition p-2 rounded-lg"
              title="View details"
            >
              <Eye size={18} />
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => setEditOpen(true)}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition p-2 rounded-lg"
                  title="Edit task"
                >
                  <Edit2 size={18} />
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 transition p-2 rounded-lg disabled:opacity-50"
                  title="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{task.description}</p>

        <div className="space-y-3 mb-4">
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

          {task.dueDate && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar size={14} className="flex-shrink-0" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

      </div>

      <TaskDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        task={task}
        isAdmin={isAdmin}
        onEdit={() => setEditOpen(true)}
      />

      <TaskEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={task}
        onTaskUpdated={() => onRefresh()}
      />
    </>
  )
}