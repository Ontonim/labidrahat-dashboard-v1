"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, Plus, Flag } from "lucide-react";

interface Task {
  id: number;
  title: string;
  assignee: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
}

export function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Write blog post on AI trends",
      assignee: "Sarah Johnson",
      status: "in-progress",
      priority: "high",
      dueDate: "2024-10-20",
    },
    {
      id: 2,
      title: "Review research article",
      assignee: "Mike Chen",
      status: "todo",
      priority: "medium",
      dueDate: "2024-10-22",
    },
    {
      id: 3,
      title: "Update newsletter template",
      assignee: "Emma Davis",
      status: "done",
      priority: "low",
      dueDate: "2024-10-18",
    },
    {
      id: 4,
      title: "Moderate comments",
      assignee: "Alex Rodriguez",
      status: "todo",
      priority: "medium",
      dueDate: "2024-10-19",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-500/20 text-green-400";
      case "in-progress":
        return "bg-blue-500/20 text-blue-400";
      case "todo":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "";
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks</h1>
          <p className="text-slate-400 mt-1">Assign and track team tasks</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </Button>
      </div>

      <Input
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-xs bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
      />

      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Assignee
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-700/50 transition">
                  <td className="px-6 py-4 text-white">{task.title}</td>
                  <td className="px-6 py-4 text-slate-300">{task.assignee}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status.replace("-", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center gap-1 ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      <Flag className="w-4 h-4" />
                      {task.priority.charAt(0).toUpperCase() +
                        task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{task.dueDate}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:bg-slate-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:bg-slate-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
