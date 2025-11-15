"use client";

import { useState, useEffect } from "react";

import TaskTabs from "../admin/task-tabs";
import MyTasksList from "./my-tasks-list";
import { getEmailFromToken } from "@/utils/userEmail";

export default function MyTasksManagement() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"to do" | "in progress" | "completed">(
    "to do"
  );
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    setMounted(true);
    const userEmail = getEmailFromToken();
    setEmail(userEmail);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">My Tasks</h1>
            <p className="text-sm text-gray-400 mt-1">
              View and manage your assigned tasks
            </p>
          </div>
          <div className="bg-slate-800 p-4">
            <div className="container mx-auto">
              <TaskTabs active={filter} onChange={setFilter} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-slate-900 py-6">
        {email ? (
          <MyTasksList filter={filter} email={email} />
        ) : (
          <p className="text-center text-gray-400">Loading...</p>
        )}
      </div>
    </div>
  );
}
