export interface BlogDetail {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  source: string;
  image: string;
  readTime: string;
  date: string;
  status: string;
  author: string;
  authorModel: string;
  createdAt: string;
  updatedAt: string;
  comments: unknown[];
}

export interface BlogDetailResponse {
  StatusCode: number;
  success: boolean;
  message: string;
  data: BlogDetail;
}
