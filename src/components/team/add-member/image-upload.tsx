"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  preview: string | null;
  isUploading: boolean;
  progress: number;
  error: string | null;
  onFileSelect: (file: File) => Promise<string | null>;
  onImageUrl: (url: string) => void;
  onClear: () => void;
}

export function ImageUpload({
  preview,
  isUploading,
  progress,
  error,
  onFileSelect,
  onImageUrl,
  onClear,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const url = await onFileSelect(files[0]);
      if (url) {
        onImageUrl(url);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const url = await onFileSelect(files[0]);
      if (url) {
        onImageUrl(url);
      }
    }
  };

  if (preview) {
    return (
      <div className="space-y-3">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted border border-input">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-2" />
                <p className="text-white text-sm font-medium">{progress}%</p>
              </div>
            </div>
          )}
        </div>
        {!isUploading && (
          <button
            onClick={() => {
              onClear();
              fileInputRef.current?.click();
            }}
            className="w-full px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          >
            Change Image
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full aspect-square rounded-lg border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-input bg-muted/30 hover:border-primary/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Upload
            size={40}
            className={`mb-3 transition-colors ${
              isDragging ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <p className="text-sm font-medium text-foreground text-center px-4">
            Drag and drop your image here
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            or click to browse
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload image"
        />
      </div>

      {error && (
        <div className="px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
