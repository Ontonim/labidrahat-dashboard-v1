"use client";

import { useState } from "react";
import { DashboardOverview } from "./overview";
import { BlogManagement } from "../Blog/blogManagement";
import { TeamManagement } from "../team/team-management";

import { EmailManagement } from "../email/email-management";
import { CommentManagement } from "../comment/comment-management";
// import { SettingsPage } from "../settings/settings";
import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import TasksManagement from "../task/task-managment";

interface DashboardLayoutProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function DashboardLayout({ user }: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview />;
      case "blog":
        return <BlogManagement />;
      case "team":
        return <TeamManagement />;
      case "tasks":
        return <TasksManagement />;
      case "email":
        return <EmailManagement />;
      case "comments":
        return <CommentManagement />;
      // case "settings":
      //   return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar user={user} />
          <main className="flex-1 overflow-auto">{renderPage()}</main>
        </div>
      </div>
    </div>
  );
}
