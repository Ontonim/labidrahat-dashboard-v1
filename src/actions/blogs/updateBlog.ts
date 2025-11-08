"use server";
import { z } from "zod";
import { universalApi } from "../universal-api";
import { BlogDetailResponse } from "@/types/blog/blog";

const updateBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().min(1, "Category is required"),
  source: z.string().min(1, "Source URL is required"),
  readTime: z.string().min(1, "Read time is required"),
  image: z.string().optional(),
});

interface ServerActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function getBlogForEdit(blogId: string) {
  if (!blogId) {
    return {
      success: false,
      message: "Blog ID is required",
      blog: null,
    };
  }

  const result = await universalApi<BlogDetailResponse>({
    endpoint: `/blogs/${blogId}`,
    method: "GET",
    requireAuth: true,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to fetch blog",
      blog: null,
    };
  }

  return {
    success: true,
    message: "Blog fetched successfully",
    blog: result.data?.data || null,
  };
}

export async function updateBlogPost(
  blogId: string,
  formData: FormData
): Promise<ServerActionResult> {
  try {
    if (!blogId) {
      return {
        success: false,
        message: "Blog ID is required",
      };
    }
    const rawData = {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      category: formData.get("category"),
      source: formData.get("source"),
      readTime: formData.get("readTime"),
      image: formData.get("image") || undefined,
    };

    const validatedData = updateBlogSchema.parse(rawData);

    const result = await universalApi({
      endpoint: `/blogs/${blogId}`,
      method: "PATCH",
      data: validatedData,
      requireAuth: true,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to update blog post",
      };
    }

    return {
      success: true,
      message: "Blog post updated successfully!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path[0] as string;
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

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
