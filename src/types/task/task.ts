export type TaskStatus = "to do" | "in progress" | "completed";

export type TaskPriority = "low" | "medium" | "high";

export interface Assignee {
  email: string;
  name?: string;
  role?: string;
  image?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  assignee?: Assignee[];  
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;  
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

