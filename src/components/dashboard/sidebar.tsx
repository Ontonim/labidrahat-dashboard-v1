"use client";

import {
  LayoutDashboard,
  FileText,
  Users,
  CheckSquare,
  Mail,
  MessageSquare,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "blog", label: "Blog Posts", icon: FileText },
    { id: "team", label: "Team Management", icon: Users },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "email", label: "Email & Newsletter", icon: Mail },
    { id: "comments", label: "Comments", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">Creator Hub</h1>
        <p className="text-slate-400 text-sm mt-1">Content Management</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <Link
              key={item.id}
              href={item.id === "dashboard" ? "/" : `/${item.id}`}
              className="block"
            >
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer ${
                  isActive
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
                onClick={() => onPageChange?.(item.id)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500">v1.0.0</p>
      </div>
    </aside>
  );
}
