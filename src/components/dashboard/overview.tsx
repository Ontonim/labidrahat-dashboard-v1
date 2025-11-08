"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  FileText,
  MessageSquare,
  Users,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { DashboardStats } from "@/types/dashboard-overview/dashboard";
import { getDashboardOverview } from "@/actions/dashboard-overview/dashboard";

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const result = await getDashboardOverview();
    if (result.success && result.data) {
      setStats(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <p className="text-red-400">Failed to load dashboard data</p>
      </div>
    );
  }

  const totalComments =
    stats.comments.pending + stats.comments.approved + stats.comments.rejected;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">
          Welcome back! Here&apos;s what&apos;s happening
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Blogs</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.totalBlogs.toLocaleString()}
              </p>
            </div>
            <FileText className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Comments</p>
              <p className="text-3xl font-bold text-white mt-2">
                {totalComments.toLocaleString()}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {stats.comments.pending} pending
              </p>
            </div>
            <MessageSquare className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Team Members</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.totalMembers.toLocaleString()}
              </p>
            </div>
            <Users className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Contact Messages</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.totalContacts.toLocaleString()}
              </p>
            </div>
            <Mail className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Comment Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-slate-300">Pending</span>
              </div>
              <span className="text-white font-semibold">
                {stats.comments.pending}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-300">Approved</span>
              </div>
              <span className="text-white font-semibold">
                {stats.comments.approved}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-slate-300">Rejected</span>
              </div>
              <span className="text-white font-semibold">
                {stats.comments.rejected}
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Tasks</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stats.pendingTasks}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div>
                <p className="text-slate-400 text-sm">Newsletter Subscribers</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.totalSubscribers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
