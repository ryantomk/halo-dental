"use client";

import Image from "next/image";
import Modal from "@/components/ui/Modal";
import { Calendar, User, Tag, Sparkles, BookOpen, Clock } from "lucide-react";
import type { BlogPostRecord } from "./BlogClient";

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Partial<BlogPostRecord> & { authorName?: string } | null;
  onPublish?: () => void;
}

export default function BlogPreviewModal({
  isOpen,
  onClose,
  post,
  onPublish,
}: BlogPreviewModalProps) {
  if (!post) return null;

  // Estimate read time: ~200 words per minute
  const wordCount = (post.content_en || "").trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Article Public Preview" maxWidth="2xl">
      <div className="space-y-6">
        {/* Banner indicating this is a preview */}
        <div className="flex items-center justify-between p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-900 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold">Patient Article Preview</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              post.status === "published"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {post.status === "published" ? "Live / Published" : "Draft (Unpublished)"}
          </span>
        </div>

        {/* Article Container */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {post.cover_image_url ? (
            <div className="relative aspect-[21/9] w-full bg-slate-900 overflow-hidden">
              <Image
                src={post.cover_image_url}
                alt={post.title_en || "Blog cover"}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          ) : (
            <div className="h-40 w-full bg-gradient-to-br from-indigo-50 to-slate-100 flex flex-col items-center justify-center text-indigo-700/60">
              <BookOpen className="w-12 h-12 stroke-[1.5]" />
              <span className="text-xs font-medium mt-2">No cover image uploaded</span>
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-5">
            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
                <Tag className="w-3 h-3" />
                {post.category || "Dental Guide"}
              </span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{readTimeMinutes} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Draft Date"}
                </span>
              </div>
              {post.authorName && (
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{post.authorName}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {post.title_en || "Untitled Article"}
            </h1>

            {/* Excerpt */}
            {post.excerpt_en && (
              <p className="text-base text-slate-600 font-medium italic border-l-4 border-teal-500 pl-4 py-1">
                {post.excerpt_en}
              </p>
            )}

            {/* Content Body */}
            <div className="text-sm text-slate-700 leading-relaxed space-y-4 pt-3 border-t border-slate-100 whitespace-pre-line">
              {post.content_en || "No article content written yet."}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Close Preview
          </button>

          {post.status !== "published" && onPublish && (
            <button
              type="button"
              onClick={() => {
                onPublish();
                onClose();
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
            >
              Publish Article Live
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
