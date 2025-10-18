"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Check, X } from "lucide-react";

interface Comment {
  id: number;
  author: string;
  post: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export function CommentManagement() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "John Doe",
      post: "10 Tips for Content Creation",
      content: "Great tips! Really helpful for my channel.",
      status: "approved",
      date: "2024-10-15",
    },
    {
      id: 2,
      author: "Jane Smith",
      post: "Getting Started with AI",
      content: "Can you elaborate on the third point?",
      status: "pending",
      date: "2024-10-14",
    },
    {
      id: 3,
      author: "Spam User",
      post: "Advanced Analytics Guide",
      content: "Buy cheap followers now!!!",
      status: "rejected",
      date: "2024-10-13",
    },
    {
      id: 4,
      author: "Mike Johnson",
      post: "10 Tips for Content Creation",
      content: "Thanks for sharing this!",
      status: "approved",
      date: "2024-10-12",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || comment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateCommentStatus = (id: number, status: "approved" | "rejected") => {
    setComments(comments.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Comments</h1>
        <p className="text-slate-400 mt-1">Moderate and manage all comments</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Search comments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
        />
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map(
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

      {/* Comments List */}
      <div className="space-y-3">
        {filteredComments.map((comment) => (
          <Card
            key={comment.id}
            className="bg-slate-800 border-slate-700 p-4 hover:border-slate-600 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white">{comment.author}</p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        comment.status
                      )}`}
                    >
                      {comment.status.charAt(0).toUpperCase() +
                        comment.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    On: <span className="text-blue-400">{comment.post}</span>
                  </p>
                </div>
              </div>

              <p className="text-slate-300">{comment.content}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <p className="text-slate-500 text-xs">{comment.date}</p>
                {comment.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white gap-1"
                      onClick={() =>
                        updateCommentStatus(comment.id, "approved")
                      }
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white gap-1"
                      onClick={() =>
                        updateCommentStatus(comment.id, "rejected")
                      }
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                )}
                {comment.status !== "pending" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-slate-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
