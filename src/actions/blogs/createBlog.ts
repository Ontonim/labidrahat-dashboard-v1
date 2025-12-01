"use server";

import { z, ZodError } from "zod";
import { universalApi } from "../universal-api";

const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Category is required"),
  source: z.string().min(1, "Source URL is required"),
  readTime: z.string().min(1, "Read time is required"),
  image: z.string().min(1, "Invalid image URL").optional(),
});

interface ServerActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function createBlogPost(
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      category: formData.get("category"),
      source: formData.get("source"),
      readTime: formData.get("readTime"),
      image: formData.get("image"),
    };

    const validatedData = blogSchema.parse(rawData);

    const blogData = {
      ...validatedData,
      date: new Date().toISOString(),
    };

    const result = await universalApi({
      endpoint: "/blogs",
      method: "POST",
      data: blogData,
      requireAuth: true,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to create blog post",
      };
    }

    return {
      success: true,
      message: "Blog post published successfully!",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {};

      for (const err of error.issues) {
        const path = err.path[0] as string;
        if (!errors[path]) errors[path] = [];
        errors[path].push(err.message);
      }

      return {
        success: false,
        message: "Validation failed",
        errors,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
