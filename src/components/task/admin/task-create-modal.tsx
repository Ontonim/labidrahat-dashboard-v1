"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Calendar, User, UserX } from 'lucide-react'
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
import { format } from "date-fns"
import { createTask } from "@/actions/task/createTask"
import { Badge } from "@/components/ui/badge"
import { getAllMemberEmails } from "@/actions/team-members/getMembers"
import { createTaskSchema } from "@/components/task/TaskZodSchema/TaskZodSchema"
import { ZodError } from "zod"

interface CreateTaskModalProps {
  open: boolean
  onClose: () => void
  onTaskCreated: () => void
}

interface FormErrors {
  title?: string
  description?: string
  assigneeEmails?: string
  priority?: string
  dueDate?: string
  general?: string
}

interface ZodFieldError {
  path: (string | number)[]
  message: string
}

export default function TaskCreateModal({ open, onClose, onTaskCreated }: CreateTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [members, setMembers] = useState<string[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [priority, setPriority] = useState("medium")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (open) {
      loadMembers()
      // Reset form when modal opens
      resetForm()
    }
  }, [open])

  const loadMembers = async () => {
    setLoadingMembers(true)
    try {
      const result = await getAllMemberEmails()
      if (Array.isArray(result.data)) {
        setMembers(result.data.map((email: string) => email.trim()))
      } else {
        console.error("Failed to load members:", result.message)
      }
    } catch (err) {
      console.error("Failed to load members", err)
    } finally {
      setLoadingMembers(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setSelectedAssignees([])
    setPriority("medium")
    setDueDate(undefined)
    setErrors({})
  }

  const handleAssigneeChange = (value: string) => {
    if (!selectedAssignees.includes(value)) {
      setSelectedAssignees([...selectedAssignees, value])
      // Clear assignee error when user selects someone
      if (errors.assigneeEmails) {
        setErrors(prev => ({ ...prev, assigneeEmails: undefined }))
      }
    }
  }

  const removeAssignee = (email: string) => {
    setSelectedAssignees(selectedAssignees.filter(a => a !== email))
  }

  const getAvailableMembers = () => {
    return members.filter(member => !selectedAssignees.includes(member))
  }

const validateForm = (): boolean => {
  try {
    const formData = {
      title: title.trim(),
      description: description.trim() || undefined,
      assigneeEmails: selectedAssignees,
      priority: priority as "low" | "medium" | "high",
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      tags: [] // Optional, empty array দিলাম
    }

    // Zod validation
    createTaskSchema.parse(formData)
    setErrors({})
    return true
  } catch (error: unknown) {
    // Zod errors process করুন
    const newErrors: FormErrors = {}
    
    if (error instanceof ZodError) {
      // ZodError has an 'issues' property that contains the validation errors
      error.issues.forEach((err) => {
        const field = err.path[0]
        if (typeof field === 'string') {
          switch (field) {
            case 'title':
              newErrors.title = err.message
              break
            case 'description':
              newErrors.description = err.message
              break
            case 'assigneeEmails':
              newErrors.assigneeEmails = err.message
              break
            case 'priority':
              newErrors.priority = err.message
              break
            case 'dueDate':
              newErrors.dueDate = err.message
              break
            default:
              newErrors.general = err.message
          }
        } else {
          newErrors.general = err.message
        }
      })
    } else if (error instanceof Error) {
      newErrors.general = error.message || "Validation failed"
    } else {
      newErrors.general = "Validation failed"
    }
    
    setErrors(newErrors)
    return false
  }
}

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Client-side validation
    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("description", description.trim() || "")
      formData.append("priority", priority)
      if (dueDate) {
        formData.append("dueDate", dueDate.toISOString())
      }
      selectedAssignees.forEach(email => {
        formData.append("assigneeEmails", email)
      })

      const result = await createTask(formData)

      if (result.success) {
        onTaskCreated()
        resetForm()
        onClose()
      } else {
        setErrors({ general: result.message || "Failed to create task" })
      }
    } catch (err: unknown) {
      console.error("Create task error:", err)
      setErrors({ 
        general: err instanceof Error ? err.message : "An error occurred while creating task" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Real-time validation for specific fields
  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (errors.title && value.trim().length >= 3) {
      setErrors(prev => ({ ...prev, title: undefined }))
    }
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    if (errors.description && value.length <= 2000) {
      setErrors(prev => ({ ...prev, description: undefined }))
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/80" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-lg bg-gray-900 shadow-lg border-2 border-blue-500">

          {/* Header */}
          <div className="border-b border-blue-500 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Create New Task</h2>
            <button onClick={onClose} className="p-1 hover:bg-blue-900 rounded transition-colors">
              <X className="h-5 w-5 text-blue-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {errors.general && (
              <div className="rounded-lg bg-red-900/50 p-3 text-sm text-red-400 border border-red-700">
                {errors.general}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title *
                {errors.title && (
                  <span className="text-red-400 text-xs ml-2">({errors.title})</span>
                )}
              </label>
              <Input
                type="text"
                name="title"
                placeholder="Task title"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
                {errors.description && (
                  <span className="text-red-400 text-xs ml-2">({errors.description})</span>
                )}
              </label>
              <textarea
                name="description"
                placeholder="Task description"
                rows={3}
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-blue-500 ${
                  errors.description 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-700 focus:ring-blue-500'
                }`}
              />
              <div className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>Optional</span>
                <span>{description.length}/2000</span>
              </div>
            </div>

            {/* Assignees */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Assignees *
                {errors.assigneeEmails && (
                  <span className="text-red-400 text-xs ml-2">({errors.assigneeEmails})</span>
                )}
              </label>
              
              {selectedAssignees.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedAssignees.map(email => (
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
                <SelectTrigger className={`w-full bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500 ${
                  errors.assigneeEmails ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700'
                }`}>
                  <SelectValue placeholder={
                    loadingMembers ? "Loading members..." :
                    getAvailableMembers().length === 0 ? "All members selected" :
                    "Select assignees"
                  } />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {getAvailableMembers().map(email => (
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
              <p className="text-xs text-gray-500 mt-1">
                {selectedAssignees.length === 0 
                  ? "Please select at least one assignee" 
                  : `Selected ${selectedAssignees.length} assignee(s)`}
              </p>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Priority
                {errors.priority && (
                  <span className="text-red-400 text-xs ml-2">({errors.priority})</span>
                )}
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border bg-gray-800 text-white focus:outline-none focus:ring-2 ${
                  errors.priority 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-700 focus:ring-blue-500 focus:border-blue-500'
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Due Date
                {errors.dueDate && (
                  <span className="text-red-400 text-xs ml-2">({errors.dueDate})</span>
                )}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal bg-gray-800 text-white hover:bg-blue-900/50 hover:text-blue-300 ${
                      errors.dueDate 
                        ? 'border-red-500 hover:border-red-500' 
                        : 'border-gray-700 hover:border-blue-500'
                    }`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "MMM dd, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-blue-500 bg-gray-800" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    disabled={date => date < new Date()}
                    className="text-white bg-gray-800 border-0"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500 mt-1">Optional</p>
            </div>

            {/* Footer */}
            <div className="flex gap-2 pt-4 border-t border-blue-500">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-900 disabled:text-blue-400"
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}