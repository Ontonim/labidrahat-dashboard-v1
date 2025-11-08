"use server";

import { z } from "zod";
import { universalApi } from "../universal-api";
import { NewsletterResponse } from "@/types/newsletter/newsletter";

const newsletterSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface ServerActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function sendNewsletter(
  formData: FormData
): Promise<ServerActionResult> {
  try {
    const rawData = {
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    const validatedData = newsletterSchema.parse(rawData);

    const result = await universalApi<NewsletterResponse>({
      endpoint: "/newsletter",
      method: "POST",
      data: validatedData,
      requireAuth: true,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to send newsletter",
      };
    }

    return {
      success: true,
      message: result.data?.message || "Newsletter sent successfully!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((err) => {
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
