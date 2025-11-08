"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Loader2 } from "lucide-react";
import { Comment, CommentStatus } from "@/types/comments/comments";
import {
  getAllComments,
  updateCommentStatus,
} from "@/actions/comments/comments";

export function CommentManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | CommentStatus>(
    "all"
  );
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    setLoading(true);
    const result = await getAllComments();
    if (result.success) {
      setComments(result?.comments);
    }
    setLoading(false);
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment?.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment?.blogId?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || comment?.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (
    commentId: string,
    status: CommentStatus
  ) => {
    setProcessingIds((prev) => new Set(prev).add(commentId));

    const result = await updateCommentStatus(commentId, status);

    if (result.success) {
      // Update local state
      setComments((prevComments) =>
        prevComments.map((c) =>
          c._id === commentId
            ? { ...c, status, approved: status === "APPROVED" }
            : c
        )
      );
    } else {
      alert(result.message);
    }

    setProcessingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(commentId);
      return newSet;
    });
  };

  const getStatusColor = (status: CommentStatus) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/20 text-green-400";
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400";
      case "REJECTED":
        return "bg-red-500/20 text-red-400";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-slate-400">Loading comments...</p>
        </div>
      </div>
    );
  }

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
          {(["all", "PENDING", "APPROVED", "REJECTED"] as const).map(
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
                {status === "all"
                  ? "All"
                  : status.charAt(0) + status.slice(1).toLowerCase()}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700 p-8 text-center">
          <p className="text-slate-400">No comments found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredComments.map((comment) => {
            const isProcessing = processingIds.has(comment._id);

            return (
              <Card
                key={comment?._id}
                className="bg-slate-800 border-slate-700 p-4 hover:border-slate-600 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-white">
                          {comment?.name}
                        </p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            comment?.status
                          )}`}
                        >
                          {comment?.status.charAt(0) +
                            comment?.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">
                        Email:{" "}
                        <span className="text-slate-500">{comment?.email}</span>
                      </p>
                      <p className="text-slate-400 text-sm">
                        On:{" "}
                        <span className="text-blue-400">
                          {comment?.blogId?.title}
                        </span>
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-300">{comment?.comment}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <p className="text-slate-500 text-xs">
                      {formatDate(comment?.createdAt)}
                    </p>
                    {comment?.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white gap-1"
                          onClick={() =>
                            handleStatusUpdate(comment?._id, "APPROVED")
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white gap-1"
                          onClick={() =>
                            handleStatusUpdate(comment?._id, "REJECTED")
                          }
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
