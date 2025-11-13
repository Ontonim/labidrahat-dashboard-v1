"use client"

import { useEffect, useState } from "react"
import TaskTabs from "./task-tabs"
import TaskCard from "./task-card"
import TaskViewDetails from "./task-view-details"
import TaskEditModal from "./task-edit-modal"
import TaskCreateModal from "./task-create-modal"
import { Plus } from "lucide-react"
import { getTasks } from "@/actions/task/getTask"
import { isAdminFromAccess } from "@/lib/adminUtils"
import { Task } from "@/types/task/task"

export default function TasksManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<"to do" | "in progress" | "completed">("to do")
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Modal states
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Pagination
  const [page, setPage] = useState(1)
  const limit = 6

  // Load tasks
  async function loadTasks() {
    try {
      const res = await getTasks()
      setTasks(res.data || [])
    } catch (error) {
      console.error("Failed to load tasks", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const adminStatus = isAdminFromAccess()
    setIsAdmin(adminStatus)
    loadTasks()
  }, [])

  // Reset page when filter changes
  useEffect(() => {
    setPage(1)
  }, [filter])

  // Filter tasks by status
  const statusMap: Record<"to do" | "in progress" | "completed", string[]> = {
    "to do": ["pending", "to do"],
    "in progress": ["in progress"],
    completed: ["completed"],
  }

  const filteredTasks = tasks.filter((t) => statusMap[filter].includes(t.status.toLowerCase()))
  const totalPages = Math.ceil(filteredTasks.length / limit)
  const paginatedTasks = filteredTasks.slice((page - 1) * limit, page * limit)

  // Modal handlers
  const handleViewDetails = (task: Task) => {
    setSelectedTask(task)
    setDetailsOpen(true)
  }

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setEditOpen(true)
  }

  const handleCreate = () => {
    setCreateOpen(true)
  }

  const handleTaskUpdated = () => {
    loadTasks()
    setEditOpen(false)
    setDetailsOpen(false)
    setCreateOpen(false)
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-400">Loading tasks...</p>
      </div>
    )
  }

  return (
    <div className="p-6 min-h-screen bg-slate-950">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-4">Tasks</h1>
          <TaskTabs active={filter} onChange={setFilter} />
        </div>

        {isAdmin && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            <Plus size={20} />
            New Task
          </button>
        )}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {paginatedTasks.length > 0 ? (
          paginatedTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              isAdmin={isAdmin}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400">No tasks found in this category.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
          >
            Previous
          </button>
          <span className="text-white font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <TaskViewDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        task={selectedTask as Task}
        onEdit={() => {
          setDetailsOpen(false)
          setEditOpen(true)
        }}
        isAdmin={isAdmin}
      />

      <TaskEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={selectedTask as Task}
        onTaskUpdated={handleTaskUpdated}
      />

      <TaskCreateModal open={createOpen} onClose={() => setCreateOpen(false)} onTaskCreated={handleTaskUpdated} />
    </div>
  )
}
