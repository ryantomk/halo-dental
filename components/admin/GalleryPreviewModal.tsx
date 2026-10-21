"use client";

import Image from "next/image";
import Modal from "@/components/ui/Modal";
import { Sparkles, Clock, Tag, CheckCircle2, Eye } from "lucide-react";
import type { GalleryItemRecord } from "./GalleryClient";

interface GalleryPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Partial<GalleryItemRecord> & { serviceName?: string } | null;
}

export default function GalleryPreviewModal({
  isOpen,
  onClose,
  item,
}: GalleryPreviewModalProps) {
  if (!item) return null;

  const isBeforeAfter = item.before_image_url && item.after_image_url && item.before_image_url !== item.after_image_url;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gallery Showcase Preview" maxWidth="xl">
      <div className="space-y-6">
        {/* Banner */}
        <div className="flex items-center justify-between p-3.5 bg-sky-50 border border-sky-200 rounded-2xl text-sky-900 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className="font-semibold">Public Transformation Showcase</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              item.is_published
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {item.is_published ? "Published (Live)" : "Unpublished (Hidden)"}
          </span>
        </div>

        {/* Visual Showcase Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {isBeforeAfter ? (
            /* Dual Before & After View */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-slate-950 p-1.5">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900">
                <Image
                  src={item.before_image_url!}
                  alt="Before treatment"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
                <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs">
                  Before
                </span>
              </div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900">
                <Image
                  src={item.after_image_url!}
                  alt="After treatment"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
                <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-teal-500 text-slate-950 font-black backdrop-blur-xs shadow-xs">
                  After
                </span>
              </div>
            </div>
          ) : (
            /* Single Normal Gallery Photo */
            <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
              {item.after_image_url ? (
                <Image
                  src={item.after_image_url}
                  alt={item.title_en || "Gallery image"}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <span>No image uploaded</span>
                </div>
              )}
            </div>
          )}

          <div className="p-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {item.serviceName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                  <Tag className="w-3 h-3" />
                  {item.serviceName}
                </span>
              )}
              {item.treatment_duration && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Treatment time: {item.treatment_duration}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {item.title_en || "Untitled Case Study"}
            </h3>

            {item.description_en && (
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {item.description_en}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </Modal>
  );
}
