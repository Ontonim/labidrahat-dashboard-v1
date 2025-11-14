import { z } from "zod";

// Status & priority enums
export const taskStatusEnum = z.enum(["to do", "in progress", "completed"]);
export const taskPriorityEnum = z.enum(["low", "medium", "high"]);

// Custom email validation (more flexible)
const emailSchema = z.string().email("Invalid email").or(z.string().min(1));

// Create Task schema
export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 chars").max(200),
  description: z.string().max(2000).optional(),
  assigneeEmails: z
    .array(emailSchema)
    .min(1, "At least one assignee required"),
  status: taskStatusEnum.default("to do"),
  priority: taskPriorityEnum.default("medium"),
  dueDate: z
    .string()
    .refine((d) => !d || !Number.isNaN(Date.parse(d)), { 
      message: "Provided due date is not a valid date" 
    }),
  tags: z.array(z.string().min(1).max(50)).max(5).optional(),
});

// Update Task schema (all optional, taskId handled via URL)
export const updateTaskSchema = createTaskSchema.partial().extend({
  assigneeEmails: z.array(emailSchema).optional(),
});

// Update only status schema (for status updates)
export const updateTaskStatusSchema = z.object({
  status: taskStatusEnum,
});

// Type exports
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusSchema = z.infer<typeof updateTaskStatusSchema>;