"use client";

import { useState, useCallback } from "react";

interface UploadProgress {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useImageUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    error: null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  const uploadToImgbb = useCallback(
    async (file: File): Promise<string | null> => {
      setUploadProgress({
        isUploading: true,
        progress: 0,
        error: null,
      });

      try {
        const formData = new FormData();
        formData.append("image", file);

        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress((prev) => ({
              ...prev,
              progress,
            }));
          }
        });

        return new Promise((resolve, reject) => {
          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              const imageUrl = response?.data?.url;
              setUploadProgress({
                isUploading: false,
                progress: 100,
                error: null,
              });
              resolve(imageUrl);
            } else {
              reject(new Error("Upload failed"));
            }
          });

          xhr.addEventListener("error", () => {
            setUploadProgress({
              isUploading: false,
              progress: 0,
              error: "Upload failed. Please try again.",
            });
            reject(new Error("Upload error"));
          });

          xhr.open("POST", `https://api.imgbb.com/1/upload?key=${apiKey}`);
          xhr.send(formData);
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setUploadProgress({
          isUploading: false,
          progress: 0,
          error: errorMessage,
        });
        return null;
      }
    },
    []
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setUploadProgress({
          isUploading: false,
          progress: 0,
          error: "Please select an image file",
        });
        return null;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadProgress({
          isUploading: false,
          progress: 0,
          error: "Image size must be less than 5MB",
        });
        return null;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const url = await uploadToImgbb(file);
      return url;
    },
    [uploadToImgbb]
  );

  const clearPreview = useCallback(() => {
    setPreview(null);
    setUploadProgress({
      isUploading: false,
      progress: 0,
      error: null,
    });
  }, []);

  return {
    uploadProgress,
    preview,
    handleFileSelect,
    clearPreview,
  };
}
