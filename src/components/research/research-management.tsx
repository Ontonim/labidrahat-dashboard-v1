"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, Tag, Plus } from "lucide-react";

interface ResearchArticle {
  id: number;
  title: string;
  category: string;
  tags: string[];
  date: string;
  status: "published" | "draft";
}

export function ResearchManagement() {
  const [articles, setArticles] = useState<ResearchArticle[]>([
    {
      id: 1,
      title: "The Future of AI in Content Creation",
      category: "AI",
      tags: ["AI", "Content", "Future"],
      date: "2024-10-15",
      status: "published",
    },
    {
      id: 2,
      title: "Video Analytics Deep Dive",
      category: "Analytics",
      tags: ["Analytics", "Video", "Data"],
      date: "2024-10-12",
      status: "published",
    },
    {
      id: 3,
      title: "Emerging Social Media Trends",
      category: "Social Media",
      tags: ["Trends", "Social", "Marketing"],
      date: "2024-10-10",
      status: "draft",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Research Articles</h1>
          <p className="text-slate-400 mt-1">Manage your research content</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          New Article
        </Button>
      </div>

      <Input
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-xs bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            className="bg-slate-800 border-slate-700 p-6 hover:border-slate-600 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white flex-1">
                  {article.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    article.status === "published"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {article.status}
                </span>
              </div>

              <p className="text-slate-400 text-sm">{article.category}</p>

              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-slate-500 text-xs">{article.date}</p>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:bg-slate-700 flex-1"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-slate-700 flex-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
