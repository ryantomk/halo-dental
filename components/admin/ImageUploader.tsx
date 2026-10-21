"use client";

import { useState, useRef, useId, type DragEvent, type ChangeEvent } from "react";
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
  Link as LinkIcon,
  Upload,
} from "lucide-react";

interface ImageUploaderProps {
  label?: string;
  helperText?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  aspectRatio?: "square" | "video" | "wide" | "auto";
  maxSizeMb?: number;
  onUploadingChange?: (uploading: boolean) => void;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export default function ImageUploader({
  label = "Upload Image",
  helperText = "PNG, JPG, WebP, or SVG up to 10MB",
  value,
  onChange,
  folder = "uploads",
  aspectRatio = "auto",
  maxSizeMb = 10,
  onUploadingChange,
}: ImageUploaderProps) {
  const inputId = useId();
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value || "");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSelectedFile, setLastSelectedFile] = useState<File | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass = {
    square: "aspect-square max-w-[240px]",
    video: "aspect-video max-w-md",
    wide: "aspect-[21/9] max-w-lg",
    auto: "h-48 w-full max-w-md",
  }[aspectRatio];

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function validateFile(file: File): string | null {
    const type = file.type?.toLowerCase();
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isValidType = ALLOWED_TYPES.includes(type) || ["jpg", "jpeg", "png", "webp", "svg"].includes(ext);

    if (!isValidType) {
      return "Only JPG, PNG, WebP, and SVG images are supported.";
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `Image exceeds maximum allowed size of ${maxSizeMb}MB (${formatBytes(file.size)}). Please choose a smaller file.`;
    }
    return null;
  }

  async function handleFileUpload(file: File) {
    setErrorMessage("");
    setLastSelectedFile(file);
    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      setUploading(true);
      if (onUploadingChange) onUploadingChange(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const result = await uploadAdminImageAction(formData);

      if (!result.success || !result.url) {
        setErrorMessage(result.error || "Failed to upload image. Please try again.");
      } else {
        onChange(result.url);
        setUrlInput(result.url);
        setFileMeta({
          name: file.name,
          size: formatBytes(file.size),
        });
      }
    } catch {
      setErrorMessage("Network error while uploading image. Please check your connection and try again.");
    } finally {
      setUploading(false);
      if (onUploadingChange) onUploadingChange(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDragOver(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }

  function handleRemove() {
    onChange(null);
    setUrlInput("");
    setFileMeta(null);
    setErrorMessage("");
    setLastSelectedFile(null);
  }

  function handleApplyUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      handleRemove();
      return;
    }
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      setErrorMessage("Please enter a valid image URL starting with https:// or http://");
      return;
    }
    setErrorMessage("");
    onChange(trimmed);
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 tracking-tight">
            {label}
          </label>
        )}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
              mode === "upload" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "hover:text-slate-900"
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
              mode === "url" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "hover:text-slate-900"
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg"
        onChange={handleFileChange}
        className="sr-only"
        aria-label={label}
        disabled={uploading}
      />

      {value ? (
        /* Preview View with unoptimized image to prevent Next.js image domain errors */
        <div className={`relative ${aspectClass} rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-xs`}>
          <Image
            src={value}
            alt={label}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
            {mode === "upload" ? (
              <label
                htmlFor={inputId}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
                title="Replace image"
              >
                <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                <span>Replace</span>
              </label>
            ) : (
              <button
                type="button"
                onClick={() => setUrlInput(value)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                <LinkIcon className="w-3.5 h-3.5 text-teal-600" />
                <span>Edit URL</span>
              </button>
            )}
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
              Photo Attached
            </span>
          </div>
        </div>
      ) : mode === "url" ? (
        /* Direct URL Input Mode */
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
          <label className="block text-[11px] font-semibold text-slate-600">
            Paste Direct Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyUrl();
                }
              }}
              placeholder="https://example.com/photo.jpg or Supabase CDN URL"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 shadow-xs"
            >
              Set Photo
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Paste any direct link to an image on the web or Supabase Storage.
          </p>
        </div>
      ) : (
        /* Empty Upload Dropzone with Native Label Binding */
        <label
          htmlFor={inputId}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative ${aspectClass} flex flex-col items-center justify-center text-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none ${
            isDragging
              ? "border-teal-500 bg-teal-50/50 scale-[1.01]"
              : "border-slate-200 hover:border-teal-400 bg-slate-50/60 hover:bg-slate-50"
          } ${uploading ? "pointer-events-none opacity-80" : ""}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2.5">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <div className="text-xs font-semibold text-slate-700">Uploading to cloud CDN...</div>
              <div className="text-[11px] text-slate-400">Verifying dimensions & format</div>
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
        </label>
      )}

      {errorMessage && (
        <div className="flex items-center justify-between gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (lastSelectedFile) {
                handleFileUpload(lastSelectedFile);
              } else {
                setErrorMessage("");
              }
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-[11px] font-semibold transition-colors shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
