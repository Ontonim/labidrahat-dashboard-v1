"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Blog, getBlogs } from "@/actions/blogs/getBlogs";
import { formatDate } from "@/utils/formatDate";

export function BlogManagement() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await getBlogs(currentPage, postsPerPage);
        if (response?.success) {
          setPosts(response.data || []);
          setTotalPages(response.meta?.totalPages || 1);
          setTotalPosts(response.meta?.total || 0);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
          <p className="text-slate-400 mt-1">
            Manage your blog content ({totalPosts} total posts)
          </p>
        </div>
        <Link href={"/blog/add"}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Posts Table */}
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No blog posts found
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post._id}
                    className="hover:bg-slate-700/50 transition"
                  >
                    <td className="px-6 py-4 text-white">{post?.title}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium`}
                      >
                        {post?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Under maintenance
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {formatDate(post?.createdAt)}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link href={`/blog/edit/${post._id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:bg-slate-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-slate-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) =>
                typeof page === "number" ? (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={`border-slate-600 min-w-[40px] ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                        : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {page}
                  </Button>
                ) : (
                  <span key={index} className="px-2 text-slate-400">
                    {page}
                  </span>
                )
              )}

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
