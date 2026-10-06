"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import Image from "next/image";
import { uploadAdminImageAction } from "@/app/actions/admin";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface ImageUploaderProps {
  label?: string;
  helperText?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  aspectRatio?: "square" | "video" | "wide" | "auto";
  maxSizeMb?: number;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export default function ImageUploader({
  label = "Upload Image",
  helperText = "PNG, JPG, WebP, or SVG up to 10MB",
  value,
  onChange,
  folder = "uploads",
  aspectRatio = "auto",
  maxSizeMb = 10,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass = {
    square: "aspect-square max-w-[240px]",
    video: "aspect-video max-w-md",
    wide: "aspect-[21/9] max-w-lg",
    auto: "h-48 w-full max-w-md",
  }[aspectRatio];

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only JPG, PNG, WebP, and SVG images are supported.";
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `Image exceeds maximum allowed size of ${maxSizeMb}MB. Please choose a smaller file.`;
    }
    return null;
  }

  async function handleFileUpload(file: File) {
    setErrorMessage("");
    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const result = await uploadAdminImageAction(formData);

      if (!result.success || !result.url) {
        setErrorMessage(result.error || "Failed to upload image. Please try again.");
      } else {
        onChange(result.url);
      }
    } catch {
      setErrorMessage("Network error while uploading image. Please check your connection.");
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // reset input so same file can be re-selected if replaced
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }

  function handleRemove() {
    onChange(null);
    setErrorMessage("");
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 tracking-tight">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="sr-only"
        aria-label={label}
        disabled={uploading}
      />

      {value ? (
        /* Preview View */
        <div className={`relative ${aspectClass} rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-xs`}>
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold rounded-xl transition-colors shadow-sm"
              title="Replace image"
            >
              <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          <div className="absolute bottom-2 left-2 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white backdrop-blur-xs">
              <CheckCircle2 className="w-3 h-3" />
              Uploaded
            </span>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative ${aspectClass} flex flex-col items-center justify-center text-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none ${
            isDragging
              ? "border-teal-500 bg-teal-50/50 scale-[1.01]"
              : "border-slate-200 hover:border-teal-400 bg-slate-50/60 hover:bg-slate-50"
          } ${uploading ? "pointer-events-none opacity-80" : ""}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2.5">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <div className="text-xs font-semibold text-slate-700">Uploading image to CDN...</div>
              <div className="text-[11px] text-slate-400">Optimizing and storing safely</div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100/60 shadow-xs">
                {isDragging ? (
                  <UploadCloud className="w-6 h-6 animate-bounce" />
                ) : (
                  <ImageIcon className="w-6 h-6" />
                )}
              </div>
              <div className="text-xs font-semibold text-slate-800">
                Drag & drop image here or{" "}
                <span className="text-teal-600 underline underline-offset-2">choose image</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
