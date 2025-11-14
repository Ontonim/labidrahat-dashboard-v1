"use client"

import type React from "react"
import { X, AlertCircle, Calendar, User, UserX } from "lucide-react"
import { useState, useEffect } from "react"
import { updateTask } from "@/actions/task/updateTask"
import { Task, TaskPriority, TaskStatus } from "@/types/task/task"
import { getAllMemberEmails } from "@/actions/team-members/getMembers"
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

interface FormData {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  assigneeEmails: string[]
  dueDate?: string
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
    priority: "medium" as TaskPriority,
    status: "to do" as TaskStatus,
    assigneeEmails: [] as string[],
    dueDate: undefined as Date | undefined,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [members, setMembers] = useState<string[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)

  // Sync formData whenever task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "to do",
        assigneeEmails: task.assignee?.map(a => a.email) || [],
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      })
    }
  }, [task])

  // Load members
  useEffect(() => {
    if (open) {
      loadMembers()
    }
  }, [open])

  const loadMembers = async () => {
    setLoadingMembers(true)
    try {
      const result = await getAllMemberEmails()
      if (Array.isArray(result.data)) {
        setMembers(result.data.map((email: string) => email.trim()))
      }
    } catch (err) {
      console.error("Failed to load members", err)
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const updateData: FormData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority as TaskPriority,
        status: formData.status as TaskStatus,
        assigneeEmails: formData.assigneeEmails,
        dueDate: formData.dueDate ? formData.dueDate.toISOString() : undefined,
      }
      await updateTask(updateData, task._id)
      onTaskUpdated()
      onClose()
    } catch (err) {
      setError("Failed to update task. Please try again.")
      console.error("Failed to update task", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAssigneeChange = (value: string) => {
    if (!formData.assigneeEmails.includes(value)) {
      setFormData({
        ...formData,
        assigneeEmails: [...formData.assigneeEmails, value]
      })
    }
  }

  const removeAssignee = (email: string) => {
    setFormData({
      ...formData,
      assigneeEmails: formData.assigneeEmails.filter(assignee => assignee !== email)
    })
  }

  const getAvailableMembers = () => {
    return members.filter(member => !formData.assigneeEmails.includes(member))
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "border-red-500 text-red-400"
      case "medium":
        return "border-yellow-500 text-yellow-400"
      case "low":
      
        return "border-pink-500 text-pink-400"
      default:
        return "border-gray-500 text-gray-400"
    }
  }

  if (!open || !task) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500 rounded-xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-blue-500 bg-slate-800/50">
          <h2 className="text-2xl font-bold text-white">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-blue-400 hover:text-blue-200 transition p-1 hover:bg-blue-900/50 rounded-lg"
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

          {/* Assignees */}
          <div>
            <label className="text-gray-400 text-sm font-semibold block mb-2">Assignees</label>
            {formData.assigneeEmails.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.assigneeEmails.map((email) => (
                  <Badge 
                    key={email} 
                    variant="secondary"
                    className="bg-blue-900/50 text-blue-300 border-blue-700 flex items-center gap-1"
                  >
                    <User className="h-3 w-3" />
                    {email}
                    <button
                      type="button"
                      onClick={() => removeAssignee(email)}
                      className="hover:text-red-400 ml-1"
                    >
                      <UserX className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <Select 
              disabled={loadingMembers || getAvailableMembers().length === 0}
              onValueChange={handleAssigneeChange}
            >
              <SelectTrigger className="w-full bg-black border border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder={
                  loadingMembers ? "Loading members..." : 
                  getAvailableMembers().length === 0 ? "All members selected" : 
                  "Select assignees"
                } />
              </SelectTrigger>
              <SelectContent className="bg-black border-slate-700 text-white">
                {getAvailableMembers().map((email) => (
                  <SelectItem 
                    key={email} 
                    value={email}
                    className="focus:bg-blue-900/50 focus:text-blue-300"
                  >
                    {email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Select multiple assignees for this task</p>
          </div>

          {/* Priority, Status, Due Date */}
          <div className="grid grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="text-gray-400 text-sm font-semibold flex items-center gap-2 block mb-2">
                <AlertCircle size={16} />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className={`w-full px-4 py-2.5 bg-black border rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition ${getPriorityColor(formData.priority)}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-gray-400 text-sm font-semibold block mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="w-full px-4 py-2.5 bg-black border rounded-lg font-semibold text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition"
              >
                <option value="to do">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-gray-400 text-sm font-semibold block mb-2">Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition text-left flex items-center justify-between"
                  >
                    <span>
                      {formData.dueDate ? format(formData.dueDate, "MMM dd, yyyy") : "Pick a date"}
                    </span>
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-blue-500 bg-slate-800" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                    disabled={(date: Date) => date < new Date()}
                    className="text-white bg-slate-800 border-0"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Buttons */}
          <div className="border-t border-blue-500 pt-6 flex justify-end gap-3">
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
              className={`px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
