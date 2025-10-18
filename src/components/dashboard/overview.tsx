"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { FileText, MessageSquare, Users, CheckSquare, Mail, TrendingUp } from "lucide-react"

const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 200 },
  { name: "Apr", value: 278 },
  { name: "May", value: 190 },
  { name: "Jun", value: 239 },
]

const pieData = [
  { name: "Published", value: 45 },
  { name: "Draft", value: 25 },
  { name: "Archived", value: 30 },
]

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899"]

export function DashboardOverview() {
  const stats = [
    { label: "Blog Posts", value: "24", icon: FileText, color: "bg-blue-500" },
    { label: "Comments", value: "156", icon: MessageSquare, color: "bg-purple-500" },
    { label: "Team Members", value: "8", icon: Users, color: "bg-pink-500" },
    { label: "Pending Tasks", value: "12", icon: CheckSquare, color: "bg-green-500" },
    { label: "Newsletter Subs", value: "2.4K", icon: Mail, color: "bg-orange-500" },
    { label: "Engagement Rate", value: "8.2%", icon: TrendingUp, color: "bg-cyan-500" },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here&apos;s your content overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Monthly Views</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Post Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: "Published blog post", item: '"10 Tips for Content Creation"', time: "2 hours ago" },
            { action: "Approved comment on", item: '"Getting Started with AI"', time: "4 hours ago" },
            { action: "Added team member", item: "john@example.com", time: "1 day ago" },
            { action: "Sent newsletter to", item: "2,400 subscribers", time: "2 days ago" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
              <div>
                <p className="text-slate-200">
                  {activity.action} <span className="text-blue-400">{activity.item}</span>
                </p>
              </div>
              <p className="text-slate-500 text-sm">{activity.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
