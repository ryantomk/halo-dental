"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import TestimonialModal from "./TestimonialModal";
import ConfirmDialog from "./ConfirmDialog";
import {
  updateTestimonialModerationAction,
  deleteTestimonialAction,
} from "@/app/actions/admin";
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Filter,
  MessageSquare,
  Loader2,
  Plus,
  Search,
  Edit,
  Tag,
  Eye,
  EyeOff,
} from "lucide-react";

export interface TestimonialRecord {
  id: string;
  patient_name: string;
  treatment: string;
  rating: number;
  quote_en: string;
  quote_ml: string | null;
  photo_url: string | null;
  service_id: string | null;
  is_approved: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  services?: { name_en: string } | null;
}

interface ServiceOption {
  id: string;
  name_en: string;
}

interface TestimonialsClientProps {
  initialTestimonials: TestimonialRecord[];
  services: ServiceOption[];
}

export default function TestimonialsClient({ initialTestimonials, services }: TestimonialsClientProps) {
  const searchParams = useSearchParams();
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>(initialTestimonials);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TestimonialRecord | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setSelectedTestimonial(null);
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    return testimonials.filter((t) => {
      const treatmentName = t.services?.name_en || t.treatment || "";
      const matchesSearch =
        t.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        treatmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.quote_en.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (statusFilter === "approved") return t.is_approved;
      if (statusFilter === "pending") return !t.is_approved;
      if (ratingFilter !== "all" && t.rating !== Number(ratingFilter)) return false;
      return true;
    });
  }, [testimonials, searchQuery, statusFilter, ratingFilter]);

  async function handleToggleApproval(t: TestimonialRecord) {
    setActionLoadingId(t.id);
    setFeedbackMessage(null);
    try {
      const res = await updateTestimonialModerationAction(t.id, !t.is_approved);
      if (!res.success) {
        setFeedbackMessage({ type: "error", text: res.error || "Failed to update review status." });
      } else {
        setTestimonials((prev) =>
          prev.map((item) => (item.id === t.id ? { ...item, is_approved: !t.is_approved } : item))
        );
        setFeedbackMessage({
          type: "success",
          text: `✓ Review from "${t.patient_name}" is now ${!t.is_approved ? "approved and live" : "hidden"}.`,
        });
      }
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;
    setActionLoadingId(itemToDelete.id);
    setFeedbackMessage(null);
    try {
      const res = await deleteTestimonialAction(itemToDelete.id);
      if (!res.success) {
        setFeedbackMessage({ type: "error", text: res.error || "Failed to delete review." });
      } else {
        setTestimonials((prev) => prev.filter((item) => item.id !== itemToDelete.id));
        setFeedbackMessage({
          type: "success",
          text: `✓ Review from "${itemToDelete.patient_name}" deleted successfully.`,
        });
        setIsDeleteOpen(false);
        setItemToDelete(null);
      }
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Testimonials</h2>
          <p className="text-xs text-slate-500 mt-1">
            Moderate and publish patient reviews displayed on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedTestimonial(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
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

      {/* Search, Status & Rating Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews by patient or treatment..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Rating filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">★★★★★ (5 Stars)</option>
            <option value="4">★★★★☆ (4 Stars)</option>
            <option value="3">★★★☆☆ (3 Stars)</option>
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
              All ({testimonials.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("approved")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === "approved" ? "bg-white text-emerald-800 font-semibold shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              Approved ({testimonials.filter((t) => t.is_approved).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === "pending" ? "bg-white text-amber-800 font-semibold shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              Pending ({testimonials.filter((t) => !t.is_approved).length})
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-500 shadow-2xs space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No testimonials found.</p>
            <p className="text-slate-400">Click &ldquo;+ Add Testimonial&rdquo; to add patient feedback.</p>
          </div>
        ) : (
          filtered.map((t) => {
            const procedureName = t.services?.name_en || t.treatment;

            return (
              <div
                key={t.id}
                className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  {/* Rating Stars & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        t.is_approved
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {t.is_approved ? (
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{t.is_approved ? "Approved & Live" : "Pending Review"}</span>
                    </span>
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-xs text-slate-700 font-normal leading-relaxed italic border-l-2 border-teal-500 pl-3">
                    &ldquo;{t.quote_en}&rdquo;
                  </blockquote>

                  {/* Patient Info */}
                  <div className="flex items-center gap-3 pt-1">
                    {t.photo_url ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
                        <Image
                          src={t.photo_url}
                          alt={t.patient_name}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {t.patient_name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {t.patient_name}
                      </div>
                      {procedureName && (
                        <div className="text-[11px] text-teal-700 font-medium truncate">
                          {procedureName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={actionLoadingId === t.id}
                    onClick={() => handleToggleApproval(t)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      t.is_approved
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        : "bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                    }`}
                  >
                    {actionLoadingId === t.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : t.is_approved ? (
                      <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-white" />
                    )}
                    <span>{t.is_approved ? "Hide Review" : "Approve & Publish"}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTestimonial(t);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit review"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setItemToDelete(t);
                        setIsDeleteOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTestimonial(null);
        }}
        testimonial={selectedTestimonial}
        services={services}
        onSuccess={() => window.location.reload()}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Patient Review"
        message={
          <>
            Are you sure you want to permanently delete the review by{" "}
            <strong className="text-slate-900">&ldquo;{itemToDelete?.patient_name}&rdquo;</strong>?
            This will permanently remove the review from the website.
          </>
        }
        confirmText="Delete Review"
        variant="danger"
        isLoading={actionLoadingId === itemToDelete?.id}
      />
    </div>
  );
}
