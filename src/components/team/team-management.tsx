"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Shield,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { deleteMember, getAllMembers } from "@/actions/team-members/getMembers";
import { Member, MemberRole } from "@/types/team-members/team-members";
import { formatDate } from "@/utils/formatDate";

export function TeamManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Load members
  useEffect(() => {
    loadMembers(currentPage);
  }, [currentPage]);

  const loadMembers = async (page: number) => {
    setLoading(true);
    const result = await getAllMembers({
      page,
      limit: 10,
    });

    if (result.success) {
      setMembers(result.members);
      setMeta(result.meta);
    }
    setLoading(false);
  };

  // Handle delete
  const handleDelete = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to delete ${memberName}?`)) return;

    setProcessingIds((prev) => new Set(prev).add(memberId));

    const result = await deleteMember(memberId);

    if (result.success) {
      // Reload current page
      loadMembers(currentPage);
    } else {
      alert(result.message);
    }

    setProcessingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(memberId);
      return newSet;
    });
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getRoleIcon = (role: MemberRole) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "moderator":
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: MemberRole) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400";
      case "moderator":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "inactive":
        return "bg-gray-500/20 text-gray-400";
      case "suspended":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-slate-400">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Members</h1>
          <p className="text-slate-400 mt-1">
            Manage your team and assign roles ({meta.total} total members)
          </p>
        </div>
        <Link href="/team/add">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
        </Link>
      </div>

      {members.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700 p-8 text-center">
          <p className="text-slate-400">No team members found</p>
        </Card>
      ) : (
        <>
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
                  {members.map((member) => {
                    const isProcessing = processingIds.has(member._id);

                    return (
                      <tr
                        key={member._id}
                        className="hover:bg-slate-700/50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="text-white font-medium">
                              {member.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {member.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getRoleColor(
                              member.role
                            )}`}
                          >
                            {getRoleIcon(member.role)}
                            {member.role.charAt(0).toUpperCase() +
                              member.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              member.status
                            )}`}
                          >
                            {member.status.charAt(0).toUpperCase() +
                              member.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {formatDate(member.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-slate-700"
                            onClick={() =>
                              handleDelete(member._id, member.name)
                            }
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">
                Showing page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page === 1 || loading}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page === meta.totalPages || loading}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
