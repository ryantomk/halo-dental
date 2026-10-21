"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import ImageUploader from "@/components/admin/ImageUploader";
import ServicePreviewModal from "@/components/admin/ServicePreviewModal";
import { saveServiceAction } from "@/app/actions/admin";
import type { ServiceFormInput } from "@/lib/validations/adminSchema";
import { AlertCircle, Loader2, Eye, Check } from "lucide-react";

export interface ServiceData {
  id?: string;
  name_en: string;
  name_ml?: string;
  slug?: string;
  category: "cosmetic" | "orthodontics" | "general" | "restorative" | "implants" | "pediatric";
  duration_minutes: number;
  price_display?: string | null;
  price_starting_at?: number | null;
  short_description_en?: string | null;
  short_description_ml?: string | null;
  description_en?: string | null;
  description_ml?: string | null;
  image_url?: string | null;
  is_featured?: boolean;
  is_active: boolean;
  sort_order: number;
}

interface ServiceEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceData | null;
  onSuccess?: (savedService?: ServiceData) => void;
}


const CATEGORIES: { label: string; value: ServiceData["category"] }[] = [
  { label: "Cosmetic Dentistry", value: "cosmetic" },
  { label: "Orthodontics", value: "orthodontics" },
  { label: "Dental Implants", value: "implants" },
  { label: "Restorative Dentistry", value: "restorative" },
  { label: "General Dentistry", value: "general" },
  { label: "Pediatric Dentistry", value: "pediatric" },
];

export default function ServiceEditorModal({
  isOpen,
  onClose,
  service,
  onSuccess,
}: ServiceEditorModalProps) {
  const isEditing = !!service?.id;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ServiceData["category"]>("cosmetic");
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [priceDisplay, setPriceDisplay] = useState("");
  const [priceStartingAt, setPriceStartingAt] = useState<number | "">("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (service) {
      setName(service.name_en || "");
      setCategory(service.category || "cosmetic");
      setDurationMinutes(service.duration_minutes || 30);
      setPriceDisplay(service.price_display || "");
      setPriceStartingAt(service.price_starting_at ?? "");
      setShortDescription(service.short_description_en || "");
      setDescription(service.description_en || "");
      setImageUrl(service.image_url || null);
      setIsActive(service.is_active ?? true);
      setSortOrder(service.sort_order || 0);
    } else {
      setName("");
      setCategory("cosmetic");
      setDurationMinutes(30);
      setPriceDisplay("");
      setPriceStartingAt("");
      setShortDescription("");
      setDescription("");
      setImageUrl(null);
      setIsActive(true);
      setSortOrder(0);
    }
    setErrorMessage("");
  }, [service, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Service name is required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload: ServiceFormInput = {
        name: name.trim(),
        category,
        durationMinutes: Number(durationMinutes) || 30,
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim() || undefined,
        priceDisplay: priceDisplay.trim() || undefined,
        priceStartingAt: priceStartingAt === "" ? undefined : Number(priceStartingAt),
        imageUrl: imageUrl || undefined,
        isFeatured: service?.is_featured ?? false,
        isActive,
        sortOrder: Number(sortOrder) || 0,
      };

      const result = await saveServiceAction(service?.id || null, payload);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to save dental service.");
      } else {
        onClose();
        if (onSuccess) {
          onSuccess(result.service as ServiceData | undefined);
        } else {
          window.location.reload();
        }
      }
    } catch {
      setErrorMessage("A network error occurred while saving. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const currentPreviewData: Partial<ServiceData> = {
    name_en: name,
    category,
    duration_minutes: durationMinutes,
    price_display: priceDisplay,
    price_starting_at: priceStartingAt === "" ? null : Number(priceStartingAt),
    short_description_en: shortDescription,
    description_en: description,
    image_url: imageUrl,
    is_active: isActive,
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => (!submitting ? onClose() : undefined)}
        title={isEditing ? "Edit Dental Service" : "Add New Dental Service"}
        description="Configure details, duration, pricing, and photo for patient booking."
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Service Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Service Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Invisible Clear Aligners"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceData["category"])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Short Description
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief 1-sentence summary shown on cards"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Complete overview of procedure, candidate criteria, and patient benefits"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 resize-y"
            />
          </div>

          {/* Duration & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={5}
                step={5}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Starting Price (₹) <span className="text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="number"
                min={0}
                value={priceStartingAt}
                onChange={(e) => setPriceStartingAt(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 2500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Display Price <span className="text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="text"
                value={priceDisplay}
                onChange={(e) => setPriceDisplay(e.target.value)}
                placeholder="e.g. Starting from ₹2,500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>
          </div>

          {/* Service Image (Reusable ImageUploader) */}
          <div>
            <ImageUploader
              label="Service Image"
              helperText="Upload a crisp photo representing this dental treatment (JPG, PNG, WebP)"
              value={imageUrl}
              onChange={setImageUrl}
              folder="services"
              aspectRatio="video"
              onUploadingChange={setIsUploadingImage}
            />
          </div>

          {/* Display Order & Active Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700">Display Order:</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
              />
              <span className="text-[11px] text-slate-400">Lower numbers appear first</span>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                Active (Display on website &amp; booking)
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={submitting || isUploadingImage}
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || isUploadingImage}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading Photo...</span>
                  </>
                ) : submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Service...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isEditing ? "Save Changes" : "Save Service"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Embedded Live Preview Modal */}
      <ServicePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        service={currentPreviewData}
      />
    </>
  );
}
