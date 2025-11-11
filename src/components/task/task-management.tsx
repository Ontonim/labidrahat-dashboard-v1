"use client"

import { useState, useEffect } from "react"
import { isAdminFromAccess } from "@/utils/isAdmin"
import type { Task } from "@/types/task/task"
import TaskList from "@/components/task/task-list"
import TaskDetailModal from "@/components/task/task-detail-modal"
import CreateTaskButton from "@/components/task/create-task-button"
import { getTasks } from "@/actions/task/getTask"

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<"to do" | "in progress" | "completed">("to do")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
console.log("isAdmin in task management:", isAdmin);
  useEffect(() => {
    setIsAdmin(isAdminFromAccess())
  }, [])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        const result = await getTasks({ status: activeTab })
        setTasks(result.data || [])
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [activeTab])

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleTaskRefresh = async () => {
    const result = await getTasks({ status: activeTab })
    setTasks(result.data || [])
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage your teams work</p>
            </div>
            <CreateTaskButton onTaskCreated={handleTaskRefresh} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-border">
          {(["to do", "in progress", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading tasks...</p>
          </div>
        ) : tasks.length > 0 ? (
          <TaskList tasks={tasks} onTaskClick={handleTaskClick} onTaskUpdated={handleTaskRefresh} />
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No tasks in this category yet</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTask(null)
          }}
          onTaskUpdated={handleTaskRefresh}
        />
      )}
    </main>
  )
}
