"use client"
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import dynamic from 'next/dynamic'
import { Upload, X, Loader2, ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import 'react-quill-new/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

// Zod validation schema
const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  date: z.string().min(1, 'Date is required'),
  category: z.string().min(1, 'Category is required'),
  source: z.string().url('Must be a valid URL').or(z.literal('')),
  readTime: z.string().min(1, 'Read time is required'),
})

type BlogFormData = z.infer<typeof blogSchema>

// Mock existing blog data (replace with actual API call)
const fetchExistingBlogData = async (): Promise<
  BlogFormData & { image?: string }
> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: 'Understanding React Server Components',
        excerpt:
          'A comprehensive guide to React Server Components and how they revolutionize the way we build applications.',
        content:
          '<h2>Introduction to React Server Components</h2><p>React Server Components represent a new paradigm in React development. They allow developers to build applications that seamlessly blend server-side and client-side rendering.</p><p><strong>Key benefits include:</strong></p><ul><li>Improved performance</li><li>Better SEO</li><li>Reduced bundle size</li></ul>',
        date: '2024-03-15',
        category: 'Technology',
        source: 'https://react.dev',
        readTime: '8 min',
        image:
          'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
      })
    }, 1000)
  })
}

// Quill toolbar modules
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
  'background',
]

export default function EditBlog() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [existingImage, setExistingImage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      date: '',
      category: '',
      source: '',
      readTime: '',
    },
  })

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        setLoading(true)
        const data = await fetchExistingBlogData()

        reset({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          date: data.date,
          category: data.category,
          source: data.source,
          readTime: data.readTime,
        })

        if (data.image) {
          setExistingImage(data.image)
          setImagePreview(data.image)
          setFileName('existing-image.jpg')
        }
      } catch (error) {
        console.error('Error loading blog data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBlogData()
  }, [reset])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setExistingImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setFileName('')
    setExistingImage(null)
  }

  const onSubmit = (data: BlogFormData) => {
    console.log('Updated Form Data:', data)
    console.log('Image:', fileName)
    console.log('Is new image:', !existingImage)
    alert('Blog post updated successfully!')
  }

  const handleBack = () => {
    window.history.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D293D] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
          <p className="text-white text-xl font-medium">Loading blog data...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D293D] via-[#1a2332] to-[#1D293D] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-[#2A3A52] mb-6 -ml-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="bg-gradient-to-r from-[#2A3A52] to-[#243248] rounded-2xl p-8 shadow-xl border border-[#3A4A62]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="w-2 h-10 bg-blue-500 rounded-full"></span>
                  Edit Blog Post
                </h1>
                <p className="text-gray-300 text-sm">
                  Update your blog content and settings
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#1D293D] px-4 py-2 rounded-lg border border-[#3A4A62]">
                  <p className="text-xs text-gray-400">Last Updated</p>
                  <p className="text-sm text-white font-medium">
                    {new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Side - Form Fields (2 columns) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card className="bg-[#2A3A52] border-[#3A4A62] shadow-lg">
              <div className="p-8">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                  Basic Information
                </h2>

                <div className="space-y-6">
                  {/* Title */}
                  <div className="group">
                    <Label
                      htmlFor="title"
                      className="text-gray-200 text-sm font-medium mb-3  flex items-center gap-2"
                    >
                      Blog Title
                      <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="Enter an engaging title for your blog"
                      className="bg-[#1D293D] border-[#3A4A62] text-white placeholder:text-gray-500 h-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    {errors.title && (
                      <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title.message}
                      </div>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div className="group">
                    <Label
                      htmlFor="excerpt"
                      className="text-gray-200 text-sm font-medium mb-3  flex items-center gap-2"
                    >
                      Excerpt
                      <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="excerpt"
                      {...register('excerpt')}
                      placeholder="Write a compelling summary that will attract readers"
                      rows={4}
                      className="bg-[#1D293D] border-[#3A4A62] text-white placeholder:text-gray-500 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    {errors.excerpt && (
                      <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.excerpt.message}
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
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                  Content Editor
                </h2>

                <div className="group">
                  <Label className="text-gray-200 text-sm font-medium mb-3  flex items-center gap-2">
                    Blog Content
                    <span className="text-red-400">*</span>
                  </Label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <div className="transition-all">
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                          modules={modules}
                          formats={formats}
                          placeholder="Start writing your amazing content here..."
                          className="h-80  "
                        />
                      </div>
                    )}
                  />
                  {errors.content && (
                    <div className="flex items-center gap-2 mt-16 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.content.message}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Additional Details Card */}
            <Card className="bg-[#2A3A52] border-[#3A4A62] shadow-lg">
              <div className="p-8">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                  Additional Details
                </h2>

                <div className="space-y-6">
                  {/* Date and Category Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <Label
                        htmlFor="date"
                        className="text-gray-200 text-sm font-medium mb-3  flex items-center gap-2"
                      >
                        Publish Date
                        <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        {...register('date')}
                        className="bg-[#1D293D] border-[#3A4A62] text-white h-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      {errors.date && (
                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.date.message}
                        </div>
                      )}
                    </div>

                    <div className="group">
                      <Label
                        htmlFor="category"
                        className="text-gray-200 text-sm font-medium mb-3  flex items-center gap-2"
                      >
                        Category
                        <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="category"
                        {...register('category')}
                        placeholder="e.g., Technology, Lifestyle"
                        className="bg-[#1D293D] border-[#3A4A62] text-white placeholder:text-gray-500 h-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      {errors.category && (
                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.category.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Source and Read Time Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <Label
                        htmlFor="source"
                        className="text-gray-200 text-sm font-medium mb-3 block"
                      >
                        Source URL
                        <span className="text-gray-400 text-xs ml-2">(Optional)</span>
                      </Label>
                      <Input
                        id="source"
                        {...register('source')}
                        placeholder="https://example.com"
                        className="bg-[#1D293D] border-[#3A4A62] text-white placeholder:text-gray-500 h-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      {errors.source && (
                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.source.message}
                        </div>
                      )}
                    </div>

                    <div className="group">
                      <Label
                        htmlFor="readTime"
                        className="text-gray-200 text-sm font-medium mb-3  flex items-center gap-2"
                      >
                        Read Time
                        <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="readTime"
                        {...register('readTime')}
                        placeholder="e.g., 5 min"
                        className="bg-[#1D293D] border-[#3A4A62] text-white placeholder:text-gray-500 h-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      {errors.readTime && (
                        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.readTime.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Image and Info */}
          <div className="xl:col-span-1 space-y-6">
            {/* Image Upload Card */}
            <Card className="bg-[#2A3A52] border-[#3A4A62] shadow-lg sticky top-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                  Featured Image
                  {existingImage && (
                    <span className="ml-auto text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </h3>

                {!imagePreview ? (
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
                      <p className="text-white font-medium mb-2">Upload Image</p>
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
                        {existingImage && imagePreview === existingImage ? (
                          <div className="absolute bottom-3 left-3 bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                            Current Image
                          </div>
                        ) : (
                          <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                            New Image
                          </div>
                        )}
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
                  <p className="text-xs text-gray-400 mb-2">Recommended Size</p>
                  <p className="text-sm text-white font-medium">1200 x 630 pixels</p>
                </div>
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                  Quick Tips
                </h3>
                <ul className="space-y-3">
                  {[
                    'Review all changes carefully',
                    'Use high-quality images',
                    'Write clear, engaging content',
                    'Add relevant categories',
                    'Preview before updating',
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons - Fixed Bottom */}
        <div className="mt-8 bg-[#2A3A52] border-[#3A4A62] rounded-2xl p-6 shadow-xl border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              All changes will be saved automatically
            </p>
            <div className="flex gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="border-[#3A4A62] text-gray-300 hover:text-white hover:bg-[#1D293D] h-12 px-6 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white h-12 px-8 shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                <Save className="w-5 h-5 mr-2" />
                Update Blog Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}