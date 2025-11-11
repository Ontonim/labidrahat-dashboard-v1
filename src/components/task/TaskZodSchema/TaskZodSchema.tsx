import { z } from "zod";

// Status & priority enums
export const taskStatusEnum = z.enum(["to do", "in progress", "completed"]);
export const taskPriorityEnum = z.enum(["low", "medium", "high"]);

// Create Task schema
export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 chars").max(200),
  description: z.string().max(2000).optional(),
  assigneeEmails: z
    .array(z.string().email("Invalid email"))
    .min(1, "At least one assignee required"),
  status: taskStatusEnum.default("to do"),
  priority: taskPriorityEnum.default("medium").optional(),
  dueDate: z
    .string()
    .optional()
    .refine((d) => !d || !Number.isNaN(Date.parse(d)), { message: "Invalid due date" }),
  tags: z.array(z.string().min(1).max(50)).max(5).optional(),
});

// Update Task schema (all optional, taskId handled via URL)
export const updateTaskSchema = createTaskSchema.partial();

// Update only status schema (for status updates)
export const updateTaskStatusSchema = z.object({
  status: taskStatusEnum,
});

// Type exports
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusSchema = z.infer<typeof updateTaskStatusSchema>;
