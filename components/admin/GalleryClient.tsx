"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import GalleryUploadModal from "./GalleryUploadModal";
import GalleryPreviewModal from "./GalleryPreviewModal";
import ConfirmDialog from "./ConfirmDialog";
import {
  toggleGalleryItemPublishAction,
  deleteGalleryItemAction,
} from "@/app/actions/admin";
import {
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
  Loader2,
  Tag,
  Search,
  Eye,
  Edit,
  Clock,
  Sparkles,
} from "lucide-react";

export interface GalleryItemRecord {
  id: string;
  title_en: string;
  title_ml: string | null;
  description_en: string | null;
  description_ml: string | null;
  before_image_url: string;
  after_image_url: string;
  treatment_duration: string | null;
  service_id: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  services?: { name_en: string } | null;
}

interface ServiceOption {
  id: string;
  name_en: string;
}

interface GalleryClientProps {
  initialGalleryItems: GalleryItemRecord[];
  services: ServiceOption[];
}

export default function GalleryClient({ initialGalleryItems, services }: GalleryClientProps) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<GalleryItemRecord[]>(initialGalleryItems);
  const [selectedItem, setSelectedItem] = useState<GalleryItemRecord | null>(null);
  const [previewItem, setPreviewItem] = useState<GalleryItemRecord | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GalleryItemRecord | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "unpublished">("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setSelectedItem(null);
      setIsUploadOpen(true);
    }
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const serviceName = item.services?.name_en || "";
      const matchesSearch =
        item.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description_en && item.description_en.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (statusFilter === "published") return item.is_published;
      if (statusFilter === "unpublished") return !item.is_published;
      if (serviceFilter !== "all") {
        if (!item.service_id || item.service_id !== serviceFilter) return false;
      }
      return true;
    });
  }, [items, searchQuery, statusFilter, serviceFilter]);

  async function handleTogglePublish(item: GalleryItemRecord) {
    setTogglingId(item.id);
    setFeedbackMessage(null);
    try {
      const res = await toggleGalleryItemPublishAction(item.id, !item.is_published);
      if (!res.success) {
        setFeedbackMessage({ type: "error", text: res.error || "Failed to update gallery status." });
      } else {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_published: !item.is_published } : i))
        );
        setFeedbackMessage({
          type: "success",
          text: `✓ Showcase "${item.title_en}" is now ${!item.is_published ? "published live" : "unpublished"}.`,
        });
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;
    setDeletingId(itemToDelete.id);
    setFeedbackMessage(null);
    try {
      const res = await deleteGalleryItemAction(itemToDelete.id);
      if (!res.success) {
        setFeedbackMessage({ type: "error", text: res.error || "Failed to delete showcase." });
      } else {
        setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
        setFeedbackMessage({
          type: "success",
          text: `✓ Showcase "${itemToDelete.title_en}" deleted successfully.`,
        });
        setIsDeleteOpen(false);
        setItemToDelete(null);
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Gallery</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage clinic photos and treatment results.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedItem(null);
            setIsUploadOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Photos</span>
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

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search showcases by title or procedure..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Service Dropdown */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Procedures</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name_en}
              </option>
            ))}
          </select>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === "all" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === "published" ? "bg-white text-emerald-800 font-semibold shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              Published ({items.filter((i) => i.is_published).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("unpublished")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === "unpublished" ? "bg-white text-slate-600 font-semibold shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              Unpublished ({items.filter((i) => !i.is_published).length})
            </button>
          </div>
        </div>
      </div>

      {/* Visual Responsive Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-500 space-y-2 shadow-2xs">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No gallery photos or transformations found.</p>
          <p className="text-slate-400">Click &ldquo;+ Upload Photos&rdquo; to showcase your dental work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isDual =
              item.before_image_url &&
              item.after_image_url &&
              item.before_image_url !== item.after_image_url;

            const serviceName = item.services?.name_en;

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-slate-300 transition-all"
              >
                <div>
                  {/* Photo Display */}
                  {isDual ? (
                    <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1">
                      <div className="relative aspect-4/3 bg-slate-800 overflow-hidden rounded-l-xl">
                        <Image
                          src={item.before_image_url}
                          alt="Before"
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 200px"
                        />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white">
                          Before
                        </span>
                      </div>
                      <div className="relative aspect-4/3 bg-slate-800 overflow-hidden rounded-r-xl">
                        <Image
                          src={item.after_image_url}
                          alt="After"
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 200px"
                        />
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500 text-slate-950 font-black">
                          After
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <Image
                        src={item.after_image_url || item.before_image_url}
                        alt={item.title_en}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700">
                        <Tag className="w-3 h-3 text-sky-400" />
                        {serviceName || "Smile Showcase"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.is_published
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {item.is_published ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-slate-400" />
                        )}
                        <span>{item.is_published ? "Published" : "Hidden"}</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm tracking-tight line-clamp-1">
                      {item.title_en}
                    </h3>

                    {item.description_en && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description_en}
                      </p>
                    )}

                    {item.treatment_duration && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                        <Clock className="w-3 h-3" />
                        <span>Duration: {item.treatment_duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50/70 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={togglingId === item.id}
                    onClick={() => handleTogglePublish(item)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      item.is_published
                        ? "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    }`}
                  >
                    {togglingId === item.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : item.is_published ? (
                      "Unpublish"
                    ) : (
                      "Publish"
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewItem({
                          ...item,
                          services: item.services,
                        })
                      }
                      className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Preview showcase"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsUploadOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Edit details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setItemToDelete(item);
                        setIsDeleteOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete showcase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload/Edit Modal */}
      <GalleryUploadModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        services={services}
        onSuccess={() => window.location.reload()}
      />

      {/* Preview Modal */}
      <GalleryPreviewModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        item={
          previewItem
            ? {
                ...previewItem,
                serviceName: previewItem.services?.name_en,
              }
            : null
        }
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Gallery Showcase"
        message={
          <>
            Are you sure you want to permanently delete showcase{" "}
            <strong className="text-slate-900">&ldquo;{itemToDelete?.title_en}&rdquo;</strong>?
            This will permanently remove the photos from the website gallery.
          </>
        }
        confirmText="Delete Showcase"
        variant="danger"
        isLoading={deletingId === itemToDelete?.id}
      />
    </div>
  );
}
