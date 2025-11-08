"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Users, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { ContactMessage } from "@/types/contact/contact";
import { getAllContactMessages } from "@/actions/contact/getContact";
import { formatDate } from "@/utils/formatDate";

export function EmailManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const result = await getAllContactMessages();
    if (result.success) {
      setMessages(result.messages);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-slate-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Email & Newsletter</h1>
          <p className="text-slate-400 mt-1">
            Manage communications and subscribers
          </p>
        </div>
        <Link href="/email/send-email">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer">
            <Send className="w-4 h-4" />
            Send Newsletter
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Contact Messages</p>
              <p className="text-3xl font-bold text-white mt-2">
                {messages.length}
              </p>
            </div>
            <Mail className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </Card>
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Recent Messages</p>
              <p className="text-3xl font-bold text-white mt-2">
                {
                  messages.filter((msg) => {
                    const msgDate = new Date(msg.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return msgDate > weekAgo;
                  }).length
                }
              </p>
              <p className="text-slate-500 text-xs mt-1">Last 7 days</p>
            </div>
            <Users className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700 p-8 text-center">
          <Mail className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400">No contact messages yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            return (
              <Card
                key={msg._id}
                className="bg-slate-800 border-slate-700 p-4 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <p className="font-semibold text-white">{msg.name}</p>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                        contact
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-1">
                      <span className="text-slate-500">From:</span>{" "}
                      <span className="text-blue-400">{msg.email}</span>
                    </p>
                    <p className="text-slate-300 font-medium mb-2">
                      {msg.subject}
                    </p>
                    <p className="text-slate-400 text-sm">{msg.message}</p>
                    <p className="text-slate-500 text-xs mt-2">
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
