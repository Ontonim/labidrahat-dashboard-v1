"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, Eye, MessageCircle, Plus } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  status: "published" | "draft" | "archived";
  comments: number;
  views: number;
  date: string;
}

export function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "10 Tips for Content Creation",
      status: "published",
      comments: 24,
      views: 1250,
      date: "2024-10-15",
    },
    {
      id: 2,
      title: "Getting Started with AI",
      status: "published",
      comments: 18,
      views: 890,
      date: "2024-10-12",
    },
    {
      id: 3,
      title: "Advanced Analytics Guide",
      status: "draft",
      comments: 0,
      views: 0,
      date: "2024-10-10",
    },
    {
      id: 4,
      title: "Social Media Strategy 2024",
      status: "published",
      comments: 32,
      views: 2100,
      date: "2024-10-08",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft" | "archived"
  >("all");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      case "archived":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "";
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
          <p className="text-slate-400 mt-1">Manage your blog content</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
        />
        <div className="flex gap-2">
          {(["all", "published", "draft", "archived"] as const).map(
            (status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                className={
                  filterStatus === status
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-slate-600 text-slate-300 hover:bg-slate-700"
                }
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Posts Table */}
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Comments
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-700/50 transition">
                  <td className="px-6 py-4 text-white">{post.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        post.status
                      )}`}
                    >
                      {post.status.charAt(0).toUpperCase() +
                        post.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.views}
                  </td>
                  <td className="px-6 py-4 text-slate-300 flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{post.date}</td>
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
