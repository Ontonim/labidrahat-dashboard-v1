"use client";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import "./globals.css";
import { TopBar } from "@/components/dashboard/topbar";

interface User {
  email: string;
  name: string;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user] = useState<User>({ email: "user@example.com", name: "User" });
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <html lang="en">
      <body>
        <div className={darkMode ? "dark" : ""}>
          <div className="flex h-screen bg-background text-foreground">
            <Sidebar
              currentPage={currentPage}
              onPageChange={(page) => {
                setCurrentPage(page);
                router.push(`/dashboard/${page === "dashboard" ? "" : page}`);
              }}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar
                user={user}
                onLogout={handleLogout}
                darkMode={darkMode}
                onDarkModeToggle={() => setDarkMode(!darkMode)}
              />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
