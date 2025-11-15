"use client";
import { isAdminFromAccess } from "@/lib/adminUtils";
import { useEffect, useState } from "react";
import AdminTasksManagement from "./admin/admin-task-management";
import MyTasksManagement from "./member/my-task-management";

export default function TasksManagement() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    const adminStatus = isAdminFromAccess();
    setIsAdmin(adminStatus);
  }, []);

  if (isAdmin === null) {
    // Loader while checking
    return (
      <div className="p-6 text-center text-gray-400">Checking access...</div>
    );
  }

  return isAdmin ? <AdminTasksManagement /> : <MyTasksManagement />;
}
