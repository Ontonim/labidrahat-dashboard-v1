"use client";

import { logoutAction } from "@/actions/auth/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface TopBarProps {
  user: { email: string | null; name: string } | null;
}

export function TopBar({ user }: TopBarProps) {
  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-end">
      {/* <div className="flex-1 max-w-md">
        <Input
          type="search"
          placeholder="Search..."
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
        />
      </div> */}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleLogout()}
            className="text-slate-300 hover:bg-slate-700 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
