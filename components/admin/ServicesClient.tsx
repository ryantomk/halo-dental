"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import ServiceEditorModal, { type ServiceData } from "./ServiceEditorModal";
import ServicePreviewModal from "./ServicePreviewModal";
import ConfirmDialog from "./ConfirmDialog";
import {
  toggleServiceStatusAction,
  deleteServiceAction,
} from "@/app/actions/admin";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Loader2,
  Filter,
  ArrowUpDown,
  Tag,
  Clock,
} from "lucide-react";

interface ServicesClientProps {
  initialServices: ServiceData[];
}

export default function ServicesClient({ initialServices }: ServicesClientProps) {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<ServiceData[]>(initialServices);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [previewService, setPreviewService] = useState<ServiceData | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceData | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"order" | "name" | "duration">("order");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Keep client services list in sync when initialServices changes (from server revalidation)
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  // Auto-open new modal if navigated via ?new=1
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setSelectedService(null);
      setIsEditorOpen(true);
    }
  }, [searchParams]);

  // Filter & Sort
  const filteredServices = useMemo(() => {
    return services
      .filter((s) => {
        const matchesQuery =
          s.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.short_description_en && s.short_description_en.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesQuery) return false;
        if (statusFilter === "active") return s.is_active;
        if (statusFilter === "inactive") return !s.is_active;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name_en.localeCompare(b.name_en);
        if (sortBy === "duration") return a.duration_minutes - b.duration_minutes;
        return a.sort_order - b.sort_order;
      });
  }, [services, searchQuery, statusFilter, sortBy]);

  async function handleToggleStatus(svc: ServiceData) {
    if (!svc.id) return;
    setTogglingId(svc.id);
    setFeedbackMessage(null);
    try {
      const res = await toggleServiceStatusAction(svc.id, !svc.is_active);
      if (!res.success) {
        setFeedbackMessage({ type: "error", text: res.error || "Failed to update service status." });
      } else {
        setServices((prev) =>
          prev.map((item) => (item.id === svc.id ? { ...item, is_active: !svc.is_active } : item))
        );
        setFeedbackMessage({
          type: "success",
          text: `✓ Service "${svc.name_en}" ${!svc.is_active ? "activated and visible" : "deactivated and hidden"}.`,
        });
      }
    } finally {
      setTogglingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!serviceToDelete?.id) return;
    setDeletingId(serviceToDelete.id);
    setFeedbackMessage(null);
    try {
      const res = await deleteServiceAction(serviceToDelete.id);
      if (!res.success) {
        setFeedbackMessage({ type: "error", text: res.error || "Failed to delete service." });
      } else {
        setServices((prev) => prev.filter((item) => item.id !== serviceToDelete.id));
        setFeedbackMessage({
          type: "success",
          text: `✓ Service "${serviceToDelete.name_en}" deleted successfully.`,
        });
        setIsDeleteOpen(false);
        setServiceToDelete(null);
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* CMS Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Services</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage the dental services displayed on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedService(null);
            setIsEditorOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Feedback Toast Banner */}
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

      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services by name or category..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Active/Inactive Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === "all" ? "bg-white text-slate-900 font-semibold shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              All ({services.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === "active" ? "bg-white text-emerald-800 font-semibold shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              Active ({services.filter((s) => s.is_active).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                statusFilter === "inactive" ? "bg-white text-slate-600 font-semibold shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              Inactive ({services.filter((s) => !s.is_active).length})
            </button>
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "order" | "name" | "duration")}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="order">Sort: Order</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="duration">Sort: Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services List / Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {filteredServices.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <Stethoscope className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No dental services matched your search.</p>
            <p className="text-slate-400">Try modifying filters or add a new service above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Service &amp; Photo</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Duration</th>
                  <th className="px-4 py-3.5">Pricing</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map((svc) => (
                  <tr key={svc.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Thumbnail & Service Name */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {svc.image_url ? (
                            <Image
                              src={svc.image_url}
                              alt={svc.name_en}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Stethoscope className="w-5 h-5 stroke-[1.5]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm truncate max-w-xs">
                            {svc.name_en}
                          </div>
                          {svc.short_description_en && (
                            <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                              {svc.short_description_en}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {svc.category}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{svc.duration_minutes} min</span>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {svc.price_display || (svc.price_starting_at ? `₹${svc.price_starting_at}` : "—")}
                    </td>

                    {/* Status Badge & Quick Toggle */}
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        disabled={togglingId === svc.id}
                        onClick={() => handleToggleStatus(svc)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          svc.is_active
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to toggle visibility on website"
                      >
                        {togglingId === svc.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : svc.is_active ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{svc.is_active ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* Actions: Edit, Preview, Delete */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewService(svc)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Preview public appearance"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedService(svc);
                            setIsEditorOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit service details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setServiceToDelete(svc);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete service"
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

      {/* Editor Modal */}
      <ServiceEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
        onSuccess={(savedService) => {
          if (savedService) {
            setServices((prev) => {
              const exists = prev.some((s) => s.id === savedService.id);
              if (exists) {
                return prev.map((s) => (s.id === savedService.id ? savedService : s));
              }
              return [savedService, ...prev];
            });
            setFeedbackMessage({
              type: "success",
              text: `✓ Service "${savedService.name_en}" saved successfully.`,
            });
          }
        }}
      />

      {/* Preview Modal */}
      <ServicePreviewModal
        isOpen={!!previewService}
        onClose={() => setPreviewService(null)}
        service={previewService}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setServiceToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Dental Service"
        message={
          <>
            Are you sure you want to delete{" "}
            <strong className="text-slate-900">&ldquo;{serviceToDelete?.name_en}&rdquo;</strong>?
            This will permanently remove the service from the CMS. If existing bookings use this service,
            deactivation is recommended instead.
          </>
        }
        confirmText="Delete Service"
        variant="danger"
        isLoading={deletingId === serviceToDelete?.id}
      />
    </div>
  );
}
