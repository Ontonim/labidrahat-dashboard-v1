"use server";

import { CommentsResponse, CommentStatus, UpdateCommentStatusResponse } from "@/types/comments/comments";
import { universalApi } from "../universal-api";



export async function getAllComments() {
  const result = await universalApi<CommentsResponse>({
    endpoint: "/comments",
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to fetch comments",
      comments: [],
    };
  }

  return {
    success: true,
    message: result.data?.message || "Comments retrieved successfully",
    comments: result.data?.data.comments || [],
  };
}

export async function updateCommentStatus(
  commentId: string,
  status: CommentStatus
) {
  if (!commentId) {
    return {
      success: false,
      message: "Comment ID is required",
    };
  }

  if (!["APPROVED", "PENDING", "REJECTED"].includes(status)) {
    return {
      success: false,
      message: "Invalid status. Must be APPROVED, PENDING, or REJECTED",
    };
  }

  const result = await universalApi<UpdateCommentStatusResponse>({
    endpoint: `/comments/${commentId}`,
    method: "PATCH",
    data: { status },
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to update comment status",
    };
  }

  return {
    success: true,
    message: result.data?.message || "Comment status updated successfully",
    comment: result.data?.data.comment,
  };
}

export async function deleteComment(commentId: string) {
  if (!commentId) {
    return {
      success: false,
      message: "Comment ID is required",
    };
  }

  const result = await universalApi({
    endpoint: `/comments/${commentId}`,
    method: "DELETE",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to delete comment",
    };
  }

  return {
    success: true,
    message: "Comment deleted successfully",
  };
}
