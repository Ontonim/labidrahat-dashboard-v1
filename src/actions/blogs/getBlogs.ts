"use server";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  source: string;
  status: string;
  author: string;
  authorModel: string;
  updatedAt: string;
}

interface BlogsResponse {
  success: boolean;
  data: {
    blogs: Blog[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export async function getBlogs(page: number, limit: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/blogs?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          tags: ["blogs"],
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BlogsResponse = await response.json();

    return {
      success: true,
      data: data.data.blogs,
      meta: data.data.meta,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
