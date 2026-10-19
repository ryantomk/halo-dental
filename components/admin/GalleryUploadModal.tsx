"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import ImageUploader from "@/components/admin/ImageUploader";
import GalleryPreviewModal from "@/components/admin/GalleryPreviewModal";
import { saveGalleryItemAction } from "@/app/actions/admin";
import type { GalleryItemFormInput } from "@/lib/validations/adminSchema";
import { AlertCircle, Loader2, Eye, Check, Sparkles } from "lucide-react";
import type { GalleryItemRecord } from "./GalleryClient";

interface ServiceOption {
  id: string;
  name_en: string;
}

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: GalleryItemRecord | null;
  services: ServiceOption[];
  onSuccess?: () => void;
}

export default function GalleryUploadModal({
  isOpen,
  onClose,
  item,
  services,
  onSuccess,
}: GalleryUploadModalProps) {
  const isEditing = !!item?.id;

  const [isBeforeAfter, setIsBeforeAfter] = useState(true);
  const [normalImageUrl, setNormalImageUrl] = useState<string | null>(null);
  const [beforeImageUrl, setBeforeImageUrl] = useState<string | null>(null);
  const [afterImageUrl, setAfterImageUrl] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [treatmentDuration, setTreatmentDuration] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (item) {
      const isDual =
        item.before_image_url &&
        item.after_image_url &&
        item.before_image_url !== item.after_image_url;

      setIsBeforeAfter(!!isDual);
      if (isDual) {
        setBeforeImageUrl(item.before_image_url);
        setAfterImageUrl(item.after_image_url);
        setNormalImageUrl(null);
      } else {
        setNormalImageUrl(item.after_image_url || item.before_image_url || null);
        setBeforeImageUrl(null);
        setAfterImageUrl(null);
      }

      setServiceId(item.service_id || "");
      setTitle(item.title_en || "");
      setDescription(item.description_en || "");
      setTreatmentDuration(item.treatment_duration || "");
      setDisplayOrder(item.display_order || 0);
      setIsPublished(item.is_published ?? true);
    } else {
      setIsBeforeAfter(true);
      setNormalImageUrl(null);
      setBeforeImageUrl(null);
      setAfterImageUrl(null);
      setServiceId(services[0]?.id || "");
      setTitle("");
      setDescription("");
      setTreatmentDuration("");
      setDisplayOrder(0);
      setIsPublished(true);
    }
    setErrorMessage("");
  }, [item, services, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Case study title is required.");
      return;
    }

    if (isBeforeAfter) {
      if (!beforeImageUrl) {
        setErrorMessage("Please upload the 'Before' treatment image.");
        return;
      }
      if (!afterImageUrl) {
        setErrorMessage("Please upload the 'After' transformation image.");
        return;
      }
    } else {
      if (!normalImageUrl) {
        setErrorMessage("Please upload the gallery photo.");
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload: GalleryItemFormInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        isBeforeAfter,
        beforeImageUrl: isBeforeAfter ? beforeImageUrl! : normalImageUrl!,
        afterImageUrl: isBeforeAfter ? afterImageUrl! : normalImageUrl!,
        serviceId: serviceId || undefined,
        treatmentDuration: treatmentDuration.trim() || undefined,
        isPublished,
        displayOrder: Number(displayOrder) || 0,
      };

      const result = await saveGalleryItemAction(item?.id || null, payload);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to save gallery item.");
      } else {
        onClose();
        if (onSuccess) {
          onSuccess();
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

  const selectedService = services.find((s) => s.id === serviceId);

  const previewData: Partial<GalleryItemRecord> & { serviceName?: string } = {
    title_en: title,
    description_en: description,
    before_image_url: isBeforeAfter ? beforeImageUrl || "" : normalImageUrl || "",
    after_image_url: isBeforeAfter ? afterImageUrl || "" : normalImageUrl || "",
    treatment_duration: treatmentDuration,
    is_published: isPublished,
    serviceName: selectedService?.name_en,
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => (!submitting ? onClose() : undefined)}
        title={isEditing ? "Edit Gallery Item" : "Upload Gallery Showcase"}
        description="Showcase clinical transformations and clinic facility photos to prospective patients."
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Gallery Type Selector: Normal vs Before & After */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Gallery Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isBeforeAfter
                    ? "border-teal-600 bg-teal-50/50 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="galleryType"
                  checked={isBeforeAfter}
                  onChange={() => setIsBeforeAfter(true)}
                  className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Before &amp; After</div>
                  <div className="text-[11px] text-slate-500">Dual clinical transformation pair</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  !isBeforeAfter
                    ? "border-teal-600 bg-teal-50/50 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="galleryType"
                  checked={!isBeforeAfter}
                  onChange={() => setIsBeforeAfter(false)}
                  className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Normal Gallery</div>
                  <div className="text-[11px] text-slate-500">Single clinic photo or smile result</div>
                </div>
              </label>
            </div>
          </div>

          {/* Image Upload Area */}
          {isBeforeAfter ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <ImageUploader
                label="Before Image *"
                helperText="Pre-treatment photo (JPG, PNG, WebP)"
                value={beforeImageUrl}
                onChange={setBeforeImageUrl}
                folder="gallery/before"
                aspectRatio="square"
                onUploadingChange={setIsUploadingImage}
              />
              <ImageUploader
                label="After Image *"
                helperText="Final transformation result photo"
                value={afterImageUrl}
                onChange={setAfterImageUrl}
                folder="gallery/after"
                aspectRatio="square"
                onUploadingChange={setIsUploadingImage}
              />
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <ImageUploader
                label="Gallery Photo *"
                helperText="Upload crisp clinical or clinic facility photo"
                value={normalImageUrl}
                onChange={setNormalImageUrl}
                folder="gallery"
                aspectRatio="video"
                onUploadingChange={setIsUploadingImage}
              />
            </div>
          )}

          {/* Treatment Service & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Treatment (Dental Service)
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
              >
                <option value="">General Smile Enhancement</option>
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Treatment Duration <span className="text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="text"
                value={treatmentDuration}
                onChange={(e) => setTreatmentDuration(e.target.value)}
                placeholder="e.g. 6 Months, Single Visit, 4 Weeks"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Arch Alignment & Veneers Transformation"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Clinical Case Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of patient concern, procedure performed, and aesthetic outcome..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 resize-none"
            />
          </div>

          {/* Display Order & Published Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700">Display Order:</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                Published (Display live on website gallery)
              </span>
            </label>
          </div>

          {/* Actions */}
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
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Showcase...</span>
                  </>
                ) : isUploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading Photo...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Showcase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Live Showcase Preview */}
      <GalleryPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        item={previewData}
      />
    </>
  );
}
