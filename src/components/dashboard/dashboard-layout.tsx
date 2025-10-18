"use client";

import { useState } from "react";
import { DashboardOverview } from "./overview";
import { BlogManagement } from "../Blog/blogManagement";
import { ResearchManagement } from "../research/research-management";
import { TeamManagement } from "../team/team-management";
import { TaskManagement } from "../task/task-management";
import { EmailManagement } from "../email/email-management";
import { CommentManagement } from "../comment/comment-management";
import { SettingsPage } from "../settings/settings";
import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";

interface DashboardLayoutProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview />;
      case "blog":
        return <BlogManagement />;
      case "research":
        return <ResearchManagement />;
      case "team":
        return <TeamManagement />;
      case "tasks":
        return <TaskManagement />;
      case "email":
        return <EmailManagement />;
      case "comments":
        return <CommentManagement />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar
            user={user}
            onLogout={onLogout}
            darkMode={darkMode}
            onDarkModeToggle={() => setDarkMode(!darkMode)}
          />
          <main className="flex-1 overflow-auto">{renderPage()}</main>
        </div>
      </div>
    </div>
  );
}
