"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState, useEffect } from "react"
import CreateTaskModal from "./create-task-modal"
import { isAdminFromAccess } from "@/utils/isAdmin"

interface CreateTaskButtonProps {
  onTaskCreated: () => void
}

export default function CreateTaskButton({ onTaskCreated }: CreateTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(isAdminFromAccess())
  }, [])

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={!isAdmin}
        title={!isAdmin ? "Only admins can create tasks" : "Create new task"}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Task
      </Button>

      {isOpen && (
        <CreateTaskModal
          onClose={() => setIsOpen(false)}
          onTaskCreated={() => {
            setIsOpen(false)
            onTaskCreated()
          }}
        />
      )}
    </>
  )
}
