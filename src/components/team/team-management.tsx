"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, Plus, Shield, PenTool, Search } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Researcher" | "Contributor";
  status: "active" | "inactive";
  joinDate: string;
}

export function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Admin",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@example.com",
      role: "Editor",
      status: "active",
      joinDate: "2024-02-20",
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma@example.com",
      role: "Researcher",
      status: "active",
      joinDate: "2024-03-10",
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      email: "alex@example.com",
      role: "Contributor",
      status: "inactive",
      joinDate: "2024-04-05",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Shield className="w-4 h-4" />;
      case "Editor":
        return <PenTool className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-500/20 text-red-400";
      case "Editor":
        return "bg-blue-500/20 text-blue-400";
      case "Researcher":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Members</h1>
          <p className="text-slate-400 mt-1">
            Manage your team and assign roles
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      <Input
        placeholder="Search members..."
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-700/50 transition"
                >
                  <td className="px-6 py-4 text-white font-medium">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{member.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getRoleColor(
                        member.role
                      )}`}
                    >
                      {getRoleIcon(member.role)}
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {member.status.charAt(0).toUpperCase() +
                        member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {member.joinDate}
                  </td>
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
