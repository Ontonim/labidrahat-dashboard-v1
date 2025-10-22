"use client";

import type React from "react";

import { useState, useRef } from "react";
import { X } from "lucide-react";

interface ExpertiseInputProps {
  expertise: string[];
  onAdd: (expertise: string) => void;
  onRemove: (expertise: string) => void;
}

export function ExpertiseInput({
  expertise,
  onAdd,
  onRemove,
}: ExpertiseInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        onAdd(input);
        setInput("");
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type expertise and press Enter"
          className="w-full px-4 py-3 border border-input rounded-lg bg-[#17202E] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {expertise.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {expertise.map((item) => (
            <div
              key={item}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium"
            >
              <span>{item}</span>
              <button
                onClick={() => onRemove(item)}
                className="hover:opacity-80 transition-opacity"
                aria-label={`Remove ${item}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
