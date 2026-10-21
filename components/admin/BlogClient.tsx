"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import BlogEditorModal from "./BlogEditorModal";
import BlogPreviewModal from "./BlogPreviewModal";
import ConfirmDialog from "./ConfirmDialog";
import {
  toggleBlogPostStatusAction,
  deleteBlogPostAction,
} from "@/app/actions/admin";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
  Loader2,
  FileText,
  Search,
  Eye,
  Edit,
  Tag,
  Clock,
  Send,
  FileEdit,
} from "lucide-react";

export interface BlogPostRecord {
  id: string;
  slug: string;
  title_en: string;
  title_ml: string | null;
  category: string;
  excerpt_en: string | null;
  excerpt_ml: string | null;
  content_en: string;
  content_ml: string | null;
  cover_image_url: string | null;
  author_id: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
}

interface DoctorOption {
  id: string;
  name: string;
  title: string;
  specialization?: string;
}

interface BlogClientProps {
  initialPosts: BlogPostRecord[];
  doctors: DoctorOption[];
}

export default function BlogClient({ initialPosts, doctors }: BlogClientProps) {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPostRecord[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPostRecord | null>(null);
  const [previewPost, setPreviewPost] = useState<BlogPostRecord | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPostRecord | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto-open create modal if navigated via ?new=1
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setSelectedPost(null);
      setIsEditorOpen(true);
    }
  }, [searchParams]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesQuery =
        p.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt_en && p.excerpt_en.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesQuery) return false;
      if (statusFilter === "published") return p.status === "published";
      if (statusFilter === "draft") return p.status === "draft";
      return true;
    });
  }, [posts, searchQuery, statusFilter]);

  async function handleToggleStatus(post: BlogPostRecord) {
    const newStatus = post.status === "published" ? "draft" : "published";
    setTogglingId(post.id);
    setFeedbackMessage(null);
    try {
      const res = await toggleBlogPostStatusAction(post.id, newStatus);
      if (!res.success) {
        setFeedbackMessage({ type: "error", text: res.error || "Failed to update article status." });
      } else {
        setPosts((prev) =>
          prev.map((item) =>
            item.id === post.id
              ? {
                  ...item,
                  status: newStatus,
                  published_at: newStatus === "published" ? new Date().toISOString() : item.published_at,
                }
              : item
          )
        );
        setFeedbackMessage({
          type: "success",
          text: `✓ Article "${post.title_en}" is now ${newStatus === "published" ? "published live" : "saved as draft"}.`,
        });
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!postToDelete) return;
    setDeletingId(postToDelete.id);
    setFeedbackMessage(null);
    try {
      const res = await deleteBlogPostAction(postToDelete.id);
      if (!res.success) {
        setFeedbackMessage({ type: "error", text: res.error || "Failed to delete article." });
      } else {
        setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
        setFeedbackMessage({
          type: "success",
          text: `✓ Article "${postToDelete.title_en}" deleted successfully.`,
        });
        setIsDeleteOpen(false);
        setPostToDelete(null);
      }
    } finally {
      setDeletingId(null);
    }
  }

  function getAuthorName(authorId: string | null) {
    if (!authorId) return "Clinic Staff";
    const doc = doctors.find((d) => d.id === authorId);
    return doc ? `${doc.title} ${doc.name}` : "Doctor";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Blog</h2>
          <p className="text-xs text-slate-500 mt-1">
            Create and manage dental articles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedPost(null);
            setIsEditorOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Blog Post</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl text-xs font-semibold animate-in fade-in duration-200 ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-xs opacity-60 hover:opacity-100 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title or topic..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "all" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "hover:text-slate-900"
            }`}
          >
            All ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("published")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "published" ? "bg-white text-emerald-800 font-semibold shadow-2xs" : "hover:text-slate-900"
            }`}
          >
            Published ({posts.filter((p) => p.status === "published").length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("draft")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === "draft" ? "bg-white text-slate-700 font-semibold shadow-2xs" : "hover:text-slate-900"
            }`}
          >
            Drafts ({posts.filter((p) => p.status === "draft").length})
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No blog articles found.</p>
            <p className="text-slate-400">Click &ldquo;+ New Blog Post&rdquo; to write your first dental health guide.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Cover &amp; Title</th>
                  <th className="px-4 py-3.5">Category &amp; Author</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Published / Updated</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Cover Image & Title */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {post.cover_image_url ? (
                            <Image
                              src={post.cover_image_url}
                              alt={post.title_en}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <BookOpen className="w-4 h-4 stroke-[1.5]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm truncate max-w-sm">
                            {post.title_en}
                          </div>
                          {post.excerpt_en && (
                            <div className="text-[11px] text-slate-400 truncate max-w-sm mt-0.5">
                              {post.excerpt_en}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category & Author */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                          <Tag className="w-3 h-3 text-indigo-400" />
                          {post.category}
                        </span>
                        <div className="text-[11px] text-slate-500 font-medium pl-0.5">
                          By {getAuthorName(post.author_id)}
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          post.status === "published"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {post.status === "published" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <FileEdit className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span className="capitalize">{post.status}</span>
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Not published yet"}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[10px] mt-0.5">
                        Created {new Date(post.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </td>

                    {/* Actions: Edit, Preview, Publish/Unpublish, Delete */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Publish / Unpublish */}
                        <button
                          type="button"
                          disabled={togglingId === post.id}
                          onClick={() => handleToggleStatus(post)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            post.status === "published"
                              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              : "bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200"
                          }`}
                          title={post.status === "published" ? "Unpublish to Draft" : "Publish to Public"}
                        >
                          {togglingId === post.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : post.status === "published" ? (
                            "Unpublish"
                          ) : (
                            "Publish"
                          )}
                        </button>

                        {/* Preview */}
                        <button
                          type="button"
                          onClick={() => setPreviewPost(post)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Preview article"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPost(post);
                            setIsEditorOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit article"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            setPostToDelete(post);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Blog Editor Modal */}
      <BlogEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
        doctors={doctors}
        onSuccess={() => window.location.reload()}
      />

      {/* Blog Preview Modal */}
      <BlogPreviewModal
        isOpen={!!previewPost}
        onClose={() => setPreviewPost(null)}
        post={
          previewPost
            ? {
                ...previewPost,
                authorName: getAuthorName(previewPost.author_id),
              }
            : null
        }
        onPublish={previewPost ? () => handleToggleStatus(previewPost) : undefined}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Blog Article"
        message={
          <>
            Are you sure you want to permanently delete article{" "}
            <strong className="text-slate-900">&ldquo;{postToDelete?.title_en}&rdquo;</strong>?
            This will permanently remove the article from the website and cannot be undone.
          </>
        }
        confirmText="Delete Article"
        variant="danger"
        isLoading={deletingId === postToDelete?.id}
      />
    </div>
  );
}
