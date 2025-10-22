// "use client";
// import React, { useState, useEffect, useMemo, useRef } from "react";
// import dynamic from "next/dynamic";
// import type ReactQuillType from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { Save, Eye, FileText, Loader2 } from "lucide-react";

// // Dynamically import ReactQuill with proper typing and error handling
// const ReactQuill = dynamic(
//   async () => {
//     const { default: RQ } = await import("react-quill");
//     return function ReactQuillWrapper(props: any) {
//       const ref = useRef<ReactQuillType>(null);
//       return <RQ ref={ref} {...props} />;
//     };
//   },
//   {
//     ssr: true,
//     loading: () => (
//       <div className="bg-white rounded-lg p-8 min-h-[500px] flex items-center justify-center">
//         <div className="flex items-center gap-3 text-gray-600">
//           <Loader2 className="animate-spin" size={24} />
//           <span>Loading editor...</span>
//         </div>
//       </div>
//     ),
//   }
// );

// interface BlogPost {
//   title: string;
//   content: string;
//   category: string;
//   tags: string[];
//   coverImage: string;
//   date: string;
// }

// const BlogEditor: React.FC = () => {
//   const [mounted, setMounted] = useState(false);
//   const [title, setTitle] = useState<string>("");
//   const [content, setContent] = useState<string>("");
//   const [category, setCategory] = useState<string>("");
//   const [tags, setTags] = useState<string>("");
//   const [coverImage, setCoverImage] = useState<string>("");
//   const [showPreview, setShowPreview] = useState<boolean>(false);
//   const quillRef = useRef<ReactQuillType>(null);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Quill modules configuration
//   const modules = useMemo(
//     () => ({
//       toolbar: [
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         [{ font: [] }],
//         [{ size: ["small", false, "large", "huge"] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ color: [] }, { background: [] }],
//         [{ script: "sub" }, { script: "super" }],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ indent: "-1" }, { indent: "+1" }],
//         [{ align: [] }],
//         ["blockquote", "code-block"],
//         ["link", "image", "video"],
//         ["clean"],
//       ],
//       clipboard: {
//         matchVisual: false,
//       },
//     }),
//     []
//   );

//   const formats = [
//     "header",
//     "font",
//     "size",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "color",
//     "background",
//     "script",
//     "list",
//     "bullet",
//     "indent",
//     "align",
//     "blockquote",
//     "code-block",
//     "link",
//     "image",
//     "video",
//   ];

//   const handleSave = () => {
//     const blogPost: BlogPost = {
//       title,
//       content,
//       category,
//       tags: tags.split(",").map((tag) => tag.trim()),
//       coverImage,
//       date: new Date().toISOString(),
//     };

//     console.log("Blog Post Saved:", blogPost);
//     alert("Your blog post has been saved successfully! ✅");
//   };

//   const handlePublish = () => {
//     if (!title || !content) {
//       alert("Please write title and content!");
//       return;
//     }

//     const blogPost: BlogPost = {
//       title,
//       content,
//       category,
//       tags: tags.split(",").map((tag) => tag.trim()),
//       coverImage,
//       date: new Date().toISOString(),
//     };

//     console.log("Blog Post Published:", blogPost);
//     alert("Your blog post has been published! 🎉");
//   };

//   if (!mounted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
//         <div className="flex items-center gap-3 text-white text-xl">
//           <Loader2 className="animate-spin" size={28} />
//           <span>Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-slate-800 rounded-t-2xl p-6 border-b border-slate-700 shadow-xl">
//           <div className="flex items-center gap-3 mb-2">
//             <FileText className="text-blue-400" size={32} />
//             <h1 className="text-3xl font-bold text-white">Blog Editor</h1>
//           </div>
//           <p className="text-slate-400">
//             Write your thoughts and share with the world
//           </p>
//         </div>

//         {/* Main Content */}
//         <div className="bg-slate-800 p-6 space-y-6">
//           {/* Title Input */}
//           <div>
//             <label className="block text-slate-300 mb-2 font-medium">
//               Title *
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Write an attractive title for your blog post..."
//               className="w-full bg-slate-900 text-white text-xl px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-all"
//             />
//           </div>

//           {/* Cover Image */}
//           <div>
//             <label className="block text-slate-300 mb-2 font-medium">
//               Cover Image URL
//             </label>
//             <input
//               type="text"
//               value={coverImage}
//               onChange={(e) => setCoverImage(e.target.value)}
//               placeholder="https://example.com/image.jpg"
//               className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-all"
//             />
//           </div>

//           {/* Category and Tags */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-slate-300 mb-2 font-medium">
//                 Category
//               </label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
//               >
//                 <option value="">Select Category</option>
//                 <option value="technology">Technology</option>
//                 <option value="lifestyle">Lifestyle</option>
//                 <option value="education">Education</option>
//                 <option value="health">Health</option>
//                 <option value="travel">Travel</option>
//                 <option value="food">Food</option>
//                 <option value="business">Business</option>
//                 <option value="entertainment">Entertainment</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-slate-300 mb-2 font-medium">
//                 Tags (separate with commas)
//               </label>
//               <input
//                 type="text"
//                 value={tags}
//                 onChange={(e) => setTags(e.target.value)}
//                 placeholder="Example: Technology, AI, Programming"
//                 className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-all"
//               />
//             </div>
//           </div>

//           {/* Editor/Preview Toggle */}
//           <div className="flex gap-3">
//             <button
//               onClick={() => setShowPreview(false)}
//               className={`px-6 py-2 rounded-lg font-medium transition-all ${
//                 !showPreview
//                   ? "bg-blue-600 text-white shadow-lg"
//                   : "bg-slate-700 text-slate-300 hover:bg-slate-600"
//               }`}
//             >
//               Edit
//             </button>
//             <button
//               onClick={() => setShowPreview(true)}
//               className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
//                 showPreview
//                   ? "bg-blue-600 text-white shadow-lg"
//                   : "bg-slate-700 text-slate-300 hover:bg-slate-600"
//               }`}
//             >
//               <Eye size={18} />
//               Preview
//             </button>
//           </div>

//           {/* Editor/Preview Area */}
//           {!showPreview ? (
//             <div className="bg-white rounded-lg overflow-hidden quill-wrapper">
//               <ReactQuill
//                 theme="snow"
//                 value={content}
//                 onChange={setContent}
//                 modules={modules}
//                 formats={formats}
//                 placeholder="Write your blog post here... ✍️"
//               />
//             </div>
//           ) : (
//             <div className="bg-white rounded-lg p-8 min-h-[500px]">
//               {coverImage && (
//                 <img
//                   src={coverImage}
//                   alt="Cover"
//                   className="w-full h-64 object-cover rounded-lg mb-6"
//                   onError={(e) => {
//                     e.currentTarget.style.display = "none";
//                   }}
//                 />
//               )}
//               <h1 className="text-4xl font-bold mb-2 text-gray-900">
//                 {title || "No Title"}
//               </h1>
//               {category && (
//                 <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
//                   {category}
//                 </span>
//               )}
//               {tags && (
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {tags.split(",").map((tag, index) => (
//                     <span
//                       key={index}
//                       className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
//                     >
//                       #{tag.trim()}
//                     </span>
//                   ))}
//                 </div>
//               )}
//               <div
//                 className="prose prose-lg max-w-none"
//                 dangerouslySetInnerHTML={{
//                   __html: content || "<p>No content available</p>",
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="bg-slate-800 rounded-b-2xl p-6 shadow-xl">
//           <div className="flex gap-4 justify-end">
//             <button
//               onClick={handleSave}
//               className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
//             >
//               <Save size={20} />
//               Save Draft
//             </button>
//             <button
//               onClick={handlePublish}
//               className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
//             >
//               Publish 🚀
//             </button>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         .quill-wrapper .ql-container {
//           min-height: 500px;
//           font-size: 16px;
//         }

//         .quill-wrapper .ql-editor {
//           min-height: 500px;
//         }

//         .ql-toolbar {
//           background: #f8fafc;
//           border: none !important;
//           border-bottom: 1px solid #e2e8f0 !important;
//         }

//         .ql-container {
//           border: none !important;
//         }

//         .ql-editor.ql-blank::before {
//           color: #94a3b8;
//           font-style: normal;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BlogEditor;

import React from "react";

const AddBlog = () => {
  return <div>This New post section.. Under Development</div>;
};

export default AddBlog;
