"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, LogOut, Bell } from "lucide-react";

interface TopBarProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export function TopBar({
  user,
  onLogout,
  darkMode,
  onDarkModeToggle,
}: TopBarProps) {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <Input
          type="search"
          placeholder="Search..."
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-300 hover:bg-slate-700"
        >
          <Bell className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDarkModeToggle}
          className="text-slate-300 hover:bg-slate-700"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-slate-300 hover:bg-slate-700"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
