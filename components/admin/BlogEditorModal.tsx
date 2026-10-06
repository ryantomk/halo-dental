"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import ImageUploader from "@/components/admin/ImageUploader";
import BlogPreviewModal from "@/components/admin/BlogPreviewModal";
import { saveBlogPostAction } from "@/app/actions/admin";
import type { BlogPostFormInput } from "@/lib/validations/adminSchema";
import { AlertCircle, Loader2, Eye, Send, FileEdit, Check } from "lucide-react";
import type { BlogPostRecord } from "./BlogClient";

interface DoctorOption {
  id: string;
  name: string;
  title: string;
  specialization?: string;
}

interface BlogEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: BlogPostRecord | null;
  doctors: DoctorOption[];
  onSuccess?: () => void;
}

const CATEGORIES = [
  "Oral Hygiene & Preventive Care",
  "Cosmetic Dentistry & Veneers",
  "Clear Aligners & Orthodontics",
  "Dental Implants & Restorative",
  "Root Canal & Endodontics",
  "Pediatric Dental Health",
  "Clinic Updates & Technology",
];

export default function BlogEditorModal({
  isOpen,
  onClose,
  post,
  doctors,
  onSuccess,
}: BlogEditorModalProps) {
  const isEditing = !!post?.id;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<string>(CATEGORIES[0] || "Dental Health");
  const [authorId, setAuthorId] = useState<string>("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title_en || "");
      setExcerpt(post.excerpt_en || "");
      setContent(post.content_en || "");
      setCoverImageUrl(post.cover_image_url || null);
      setCategory(post.category || CATEGORIES[0] || "Dental Health");
      setAuthorId(post.author_id || "");
      setStatus((post.status as "draft" | "published") || "draft");
    } else {
      setTitle("");
      setExcerpt("");
      setContent("");
      setCoverImageUrl(null);
      setCategory(CATEGORIES[0] || "Dental Health");
      setAuthorId(doctors[0]?.id || "");
      setStatus("draft");
    }
    setSeoTitle("");
    setSeoDescription("");
    setErrorMessage("");
  }, [post, doctors, isOpen]);

  async function handleSave(targetStatus: "draft" | "published") {
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Article title is required.");
      return;
    }
    if (!content.trim()) {
      setErrorMessage("Article content is required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload: BlogPostFormInput = {
        title: title.trim(),
        excerpt: excerpt.trim() || undefined,
        content: content.trim(),
        category,
        coverImageUrl: coverImageUrl || undefined,
        authorId: authorId || undefined,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
        status: targetStatus,
      };

      const result = await saveBlogPostAction(post?.id || null, payload);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to save article.");
      } else {
        onClose();
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      }
    } catch {
      setErrorMessage("A network error occurred while saving article. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedDoctor = doctors.find((d) => d.id === authorId);

  const previewData: Partial<BlogPostRecord> & { authorName?: string } = {
    title_en: title,
    excerpt_en: excerpt,
    content_en: content,
    category,
    cover_image_url: coverImageUrl,
    status,
    author_id: authorId,
    authorName: selectedDoctor ? `${selectedDoctor.title} ${selectedDoctor.name}` : undefined,
    published_at: post?.published_at || new Date().toISOString(),
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => (!submitting ? onClose() : undefined)}
        title={isEditing ? "Edit Dental Article" : "Write New Dental Article"}
        description="Write clinical guides or patient education articles without complex code or markup."
        maxWidth="2xl"
      >
        <div className="space-y-6">
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Article Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5 Common Signs You Might Need Clear Aligners"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-semibold"
            />
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Author (Doctor / Specialist)
              </label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
              >
                <option value="">Clinic Staff Editorial Team</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title} {doc.name} {doc.specialization ? `(${doc.specialization})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Short Summary / Excerpt
              </label>
              <span className="text-[11px] text-slate-400">Shown in article previews</span>
            </div>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief introductory summary to hook patient interest..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 resize-none"
            />
          </div>

          {/* Main Article Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Article Content <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Plain text with natural paragraphs</span>
            </div>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your dental article here. Press Enter twice between paragraphs for clear formatting. Non-technical staff friendly — no HTML or Markdown required."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 leading-relaxed font-normal"
            />
          </div>

          {/* Cover Image Upload (Reusable ImageUploader) */}
          <div>
            <ImageUploader
              label="Cover Image"
              helperText="Upload an engaging high-resolution image for this article (JPG, PNG, WebP)"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              folder="blog"
              aspectRatio="wide"
            />
          </div>

          {/* Optional SEO fields in collapsible or compact section */}
          <details className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 group">
            <summary className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
              Advanced SEO Fields (Optional)
            </summary>
            <div className="pt-3 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Search Engine Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Defaults to article title if left empty"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Meta Description
                </label>
                <input
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Defaults to excerpt if left empty"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </details>

          {/* Footer Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview Article</span>
            </button>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={submitting}
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSave("draft")}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileEdit className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSave("published")}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Publish Live</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Live Blog Preview Modal */}
      <BlogPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        post={previewData}
        onPublish={() => handleSave("published")}
      />
    </>
  );
}
