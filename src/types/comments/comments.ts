export type CommentStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface BlogReference {
  _id: string;
  title: string;
}

export interface Comment {
  _id: string;
  name: string;
  email: string;
  comment: string;
  blogId: BlogReference;
  status: CommentStatus;
  approved: boolean;
  isdeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CommentsResponse {
  StatusCode: number;
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
  };
}

export interface UpdateCommentStatusResponse {
  StatusCode: number;
  success: boolean;
  message: string;
  data: {
    comment: Comment;
  };
}
