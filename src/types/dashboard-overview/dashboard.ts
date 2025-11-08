export interface CommentStats {
  pending: number;
  approved: number;
  rejected: number;
}

export interface DashboardStats {
  pendingTasks: number;
  totalMembers: number;
  totalSubscribers: number;
  totalBlogs: number;
  comments: CommentStats;
  totalContacts: number;
}

export interface DashboardOverviewResponse {
  StatusCode: number;
  success: boolean;
  message: string;
  data: DashboardStats;
}
