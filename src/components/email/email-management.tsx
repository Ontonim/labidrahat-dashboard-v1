"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Send, Users } from "lucide-react";

interface Email {
  id: number;
  from: string;
  subject: string;
  message: string;
  date: string;
  type: "contact" | "newsletter";
}

export function EmailManagement() {
  const [emails, ] = useState<Email[]>([
    {
      id: 1,
      from: "john@example.com",
      subject: "Great content!",
      message: "Love your latest blog post...",
      date: "2024-10-15",
      type: "contact",
    },
    {
      id: 2,
      from: "jane@example.com",
      subject: "Collaboration opportunity",
      message: "Would love to collaborate on...",
      date: "2024-10-14",
      type: "contact",
    },
    {
      id: 3,
      from: "system",
      subject: "Newsletter sent",
      message: "Successfully sent to 2,400 subscribers",
      date: "2024-10-13",
      type: "newsletter",
    },
  ]);

  const [subscribers] = useState(2400);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmails = emails.filter(
    (email) =>
      email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Email & Newsletter</h1>
          <p className="text-slate-400 mt-1">
            Manage communications and subscribers
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Send className="w-4 h-4" />
          Send Newsletter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Newsletter Subscribers</p>
              <p className="text-3xl font-bold text-white mt-2">
                {subscribers.toLocaleString()}
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div>
            <p className="text-slate-400 text-sm">Contact Messages</p>
            <p className="text-3xl font-bold text-white mt-2">
              {emails.filter((e) => e.type === "contact").length}
            </p>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Input
        placeholder="Search emails..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-xs bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
      />

      {/* Emails List */}
      <div className="space-y-3">
        {filteredEmails.map((email) => (
          <Card
            key={email.id}
            className="bg-slate-800 border-slate-700 p-4 hover:border-slate-600 transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-white">{email.from}</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      email.type === "contact"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {email.type}
                  </span>
                </div>
                <p className="text-slate-300 font-medium">{email.subject}</p>
                <p className="text-slate-400 text-sm mt-1">{email.message}</p>
                <p className="text-slate-500 text-xs mt-2">{email.date}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:bg-slate-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
