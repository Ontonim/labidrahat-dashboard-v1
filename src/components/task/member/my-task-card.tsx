"use client";

import type React from "react";
import { useState } from "react";
import { Calendar, Flag, User, Eye } from "lucide-react";

import TaskDetailsModal from "../admin/task-view-details";
import { TaskPriority, TaskStatus } from "@/types/task/task";
import { updateTask } from "@/actions/task/updateTask";

interface Task {
  _id: string;
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: Array<{ name: string; email: string; role: string; status?: string }>;
  createdAt: string;
  updatedAt: string;
}

export default function MyTaskCard({
  task,
  onStatusUpdate,
}: {
  task: Task;
  onStatusUpdate: () => void;
}) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus;
    setError("");
    setLoading(true);

    try {
      // Send status in payload using updateTask
      const payload = { status: newStatus };
      const result = await updateTask(payload, task._id);

      if (result.success) {
        setStatus(newStatus);
        onStatusUpdate();
      } else {
        setError(result.message || "Failed to update status");
        setStatus(task.status);
      }
    } catch (err) {
      setError("Failed to update status");
      setStatus(task.status);
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getStatusColor = (statusVal: string) => {
    switch (statusVal?.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "in progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "to do":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "No date";
    }
  };

  return (
    <>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition">
        <div className="mb-3 flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{task.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
          </div>
          <button
            onClick={() => setShowDetailsModal(true)}
            className="text-gray-400 hover:text-blue-400 transition p-1 flex-shrink-0"
            title="View Details"
          >
            <Eye size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className={`text-xs font-semibold px-2.5 py-1 rounded border ${getPriorityColor(task.priority)}`}>
            <Flag size={12} className="inline mr-1" />
            {task.priority}
          </div>

          <select
            value={status}
            onChange={handleStatusChange}
            disabled={loading}
            className={`text-xs font-semibold px-2.5 py-1 rounded border cursor-pointer transition appearance-none pr-6 ${getStatusColor(
              status
            )} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <option value="to do">To Do</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {error && <div className="text-xs text-red-400 mb-2">{error}</div>}

        <div className="space-y-2 text-sm text-gray-400 border-t border-slate-700 pt-3">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
          {task.assignee?.[0] && (
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>{task.assignee[0].name}</span>
            </div>
          )}
        </div>
      </div>

      <TaskDetailsModal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        task={task as Task}
    
      />
    </>
  );
}
