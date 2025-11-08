"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendNewsletter } from "@/actions/newsletter/newsletter";

export function NewsletterForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccess("");

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);

    const result = await sendNewsletter(formData);

    if (result.success) {
      setSuccess(result.message);
      setSubject("");
      setMessage("");
    } else {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        alert(result.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-8">
      {success && (
        <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Subject
        </label>
        <Input
          type="text"
          placeholder="Enter newsletter subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
          disabled={isLoading}
        />
        {errors.subject && (
          <p className="text-red-400 text-sm mt-1">{errors.subject[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Message
        </label>
        <Textarea
          placeholder="Enter newsletter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white min-h-32"
          disabled={isLoading}
        />
        {errors.message && (
          <p className="text-red-400 text-sm mt-1">{errors.message[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Newsletter"}
      </Button>
    </form>
  );
}
