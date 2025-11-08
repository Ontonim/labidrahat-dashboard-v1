"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
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
import { BlogDetail } from "@/types/blog/blog";
import { getBlogForEdit, updateBlogPost } from "@/actions/blogs/updateBlog";

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
          Updating...
        </>
      ) : (
        <>
          <Send className="w-5 h-5 mr-2" />
          Update Blog
        </>
      )}
    </Button>
  );
}

export default function EditBlog() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Load blog data
  useEffect(() => {
    loadBlog();
  }, [blogId]);

  const loadBlog = async () => {
    setLoading(true);
    const result = await getBlogForEdit(blogId);

    if (result.success && result.blog) {
      setBlog(result.blog);
      setContent(result.blog.content);
      setImagePreview(result.blog.image);
    } else {
      alert(result.message);
      router.push("/blogs");
    }

    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(blog?.image || null);
    setFileName("");
    setNewImageFile(null);
  };

  const uploadToImgbb = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        console.error("Upload failed:", data);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  async function handleSubmit(formData: FormData) {
    setErrors({});
    setSuccessMessage("");

    let imageUrl = blog?.image || "";

    // Upload new image if selected
    if (newImageFile) {
      const uploadedUrl = await uploadToImgbb(newImageFile);
      if (!uploadedUrl) {
        setErrors({ image: ["Image upload failed. Please try again."] });
        return;
      }
      imageUrl = uploadedUrl;
    }

    formData.set("content", content);
    formData.set("image", imageUrl);

    const result = await updateBlogPost(blogId, formData);

    if (result.success) {
      setSuccessMessage(result.message);
      // Reload blog data
      loadBlog();
    } else {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        alert(result.message);
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1D293D] via-[#1a2332] to-[#1D293D] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-slate-400">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1D293D] via-[#1a2332] to-[#1D293D] flex items-center justify-center">
        <p className="text-red-400">Blog not found</p>
      </div>
    );
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
                  Edit Blog Post
                </h1>
                <p className="text-gray-300 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Update your existing content
                </p>
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
                        defaultValue={blog.title}
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
                        defaultValue={blog.excerpt}
                        placeholder="Write a compelling summary"
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
                        defaultValue={blog.source}
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
                          defaultValue={blog.readTime}
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
                          defaultValue={blog.category}
                          placeholder="e.g., Technology"
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

                  {imagePreview ? (
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
                          {newImageFile && (
                            <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-2">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                              New Image Selected
                            </div>
                          )}
                        </div>
                        {fileName && (
                          <div className="p-4 bg-[#1D293D]">
                            <p className="text-white text-sm truncate font-medium">
                              {fileName}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-[#3A4A62] text-gray-300 hover:bg-[#1D293D] cursor-pointer"
                            asChild
                          >
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              Change Image
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-[#3A4A62] rounded-xl p-10 text-center bg-[#1D293D] hover:bg-[#232f42] hover:border-blue-500/50 transition-all cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
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
                      </label>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 bg-[#2A3A52] border-[#3A4A62] rounded-2xl p-6 shadow-xl border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Editing: {blog.title}
              </p>
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => router.push("/blogs")}
                  variant="outline"
                  className="border-[#3A4A62] text-gray-300 hover:text-white hover:bg-[#1D293D] h-12 px-6 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Cancel
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