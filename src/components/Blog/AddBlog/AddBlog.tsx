"use client";
import React, { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
import {
  Upload,
  X,
  Send,
  RotateCcw,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import "react-quill-new/dist/quill.snow.css";
import { createBlogPost } from "@/actions/blogs/createBlog";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "background",
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 px-8 shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Publishing...
        </>
      ) : (
        <>
          <Send className="w-5 h-5 mr-2" />
          Publish Blog
        </>
      )}
    </Button>
  );
}

export default function AddBlog() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFileName("");
    setImageFile(null);
  };

  const handleReset = () => {
    formRef.current?.reset();
    setContent("");
    removeImage();
    setErrors({});
    setSuccessMessage("");
  };

  async function handleSubmit(formData: FormData) {
    setErrors({});
    setSuccessMessage("");

    // Add content to formData
    formData.set("content", content);

    // Add image file if exists
    if (imageFile) {
      formData.set("image", imageFile);
    }

    const result = await createBlogPost(formData);

    if (result.success) {
      setSuccessMessage(result.message);
      handleReset();
      // Optional: Redirect or show success notification
    } else {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        alert(result.message);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D293D] via-[#1a2332] to-[#1D293D] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#2A3A52] to-[#243248] rounded-2xl p-8 shadow-xl border border-[#3A4A62]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="w-2 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                  Create New Blog Post
                </h1>
                <p className="text-gray-300 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Share your thoughts with the world
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#1D293D] px-4 py-2 rounded-lg border border-[#3A4A62]">
                  <p className="text-xs text-gray-400">Today</p>
                  <p className="text-sm text-white font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {successMessage}
            </p>
          </div>
        )}

        {/* Form Section */}
        <form ref={formRef} action={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Side - Form Fields */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <Card className="bg-[#2A3A52] border-[#3A4A62] shadow-lg">
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    Basic Information
                  </h2>

                  <div className="space-y-6">
                    {/* Title */}
                    <div className="group">
                      <Label
                        htmlFor="title"
                        className="text-gray-200 text-sm font-medium mb-3 flex items-center gap-2"
                      >
                        Blog Title
                        <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter a captivating title for your blog"
                        className="bg-[#1D293D] border-[#3A4A62] text-white placeholder:text-gray-400 h-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      {errors.title && (
                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.title[0]}
                        </div>
                      )}
                    </div>

                    {/* Excerpt */}
                    <div className="group">
                      <Label
                        htmlFor="excerpt"
                        className="text-gray-200 text-sm font-medium mb-3 flex items-center gap-2"
                      >
                        Excerpt
                        <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        id="excerpt"
                        name="excerpt"
                        placeholder="Write a compelling summary that will attract readers"
                        rows={4}
                        className="bg-[#1D293D] border-[#3A4A62] text-white placeholder:text-gray-400 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      {errors.excerpt && (
                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.excerpt[0]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Content Editor Card */}
              <Card className="bg-[#2A3A52] border-[#3A4A62] shadow-lg">
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    Content Editor
                  </h2>

                  <div className="group">
                    <Label className="text-gray-200 text-sm font-medium mb-3 flex items-center gap-2">
                      Blog Content
                      <span className="text-red-400">*</span>
                    </Label>
                    <div className="transition-all">
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        placeholder="Start writing your amazing content here..."
                        className="h-80 bg-white text-black"
                      />
                    </div>
                    {errors.content && (
                      <div className="flex items-center gap-2 mt-16 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.content[0]}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Additional Details Card */}
              <Card className="bg-[#2A3A52] border-[#3A4A62] shadow-lg">
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    Additional Details
                  </h2>

                  <div className="space-y-6">
                    <div className="group">
                      <Label
                        htmlFor="source"
                        className="text-gray-200 text-sm font-medium mb-3 block"
                      >
                        Source URL
                        <span className="text-red-400"> *</span>
                      </Label>
                      <Input
                        id="source"
                        name="source"
                        placeholder="https://example.com"
                        className="bg-[#1D293D] border-[#3A4A62] text-white placeholder:text-gray-500 h-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      {errors.source && (
                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.source[0]}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <Label
                          htmlFor="readTime"
                          className="text-gray-200 text-sm font-medium mb-3 flex items-center gap-2"
                        >
                          Read Time
                          <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="readTime"
                          name="readTime"
                          placeholder="e.g., 5 min"
                          className="bg-[#1D293D] border-[#3A4A62] text-white placeholder:text-gray-500 h-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        {errors.readTime && (
                          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {errors.readTime[0]}
                          </div>
                        )}
                      </div>
                      <div className="group">
                        <Label
                          htmlFor="category"
                          className="text-gray-200 text-sm font-medium mb-3 flex items-center gap-2"
                        >
                          Category
                          <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="category"
                          name="category"
                          placeholder="e.g., Technology, Lifestyle"
                          className="bg-[#1D293D] border-[#3A4A62] text-white placeholder:text-gray-500 h-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        {errors.category && (
                          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {errors.category[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Image Upload Card */}
              <Card className="bg-[#2A3A52] border-[#3A4A62] shadow-lg sticky top-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    Featured Image
                  </h3>

                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-[#3A4A62] rounded-xl p-10 text-center bg-[#1D293D] hover:bg-[#232f42] hover:border-blue-500/50 transition-all cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        name="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="w-16 h-16 mx-auto mb-4 bg-[#2A3A52] rounded-full flex items-center justify-center group-hover:bg-[#344154] transition-all">
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-400 transition-all" />
                        </div>
                        <p className="text-white font-medium mb-2">
                          Upload Image
                        </p>
                        <p className="text-gray-400 text-sm">
                          PNG, JPG, GIF up to 10MB
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          Click or drag to upload
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="rounded-xl overflow-hidden border-2 border-[#3A4A62] shadow-lg">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-56 object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full transition-all shadow-lg opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-2">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Ready to Upload
                          </div>
                        </div>
                        <div className="p-4 bg-[#1D293D]">
                          <p className="text-white text-sm truncate font-medium">
                            {fileName}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-[#1D293D] rounded-lg border border-[#3A4A62]">
                    <p className="text-xs text-gray-400 mb-2">
                      Recommended Size
                    </p>
                    <p className="text-sm text-white font-medium">
                      1200 x 630 pixels
                    </p>
                  </div>
                </div>
              </Card>

              {/* Writing Tips Card */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 shadow-lg">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    Writing Tips
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Start with a captivating headline",
                      "Use high-quality images",
                      "Break content into sections",
                      "Add relevant categories",
                      "Proofread before publishing",
                    ].map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 bg-[#2A3A52] border-[#3A4A62] rounded-2xl p-6 shadow-xl border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                All changes up to date
              </p>
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  className="border-[#3A4A62] text-gray-300 hover:text-white hover:bg-[#1D293D] h-12 px-6 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Form
                </Button>
                <SubmitButton />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
