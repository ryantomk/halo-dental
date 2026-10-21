"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import ImageUploader from "@/components/admin/ImageUploader";
import { saveTestimonialAction } from "@/app/actions/admin";
import type { TestimonialFormInput } from "@/lib/validations/adminSchema";
import { Star, AlertCircle, Loader2, Check, Send } from "lucide-react";
import type { TestimonialRecord } from "./TestimonialsClient";

interface ServiceOption {
  id: string;
  name_en: string;
}

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial?: TestimonialRecord | null;
  services: ServiceOption[];
  onSuccess?: () => void;
}

export default function TestimonialModal({
  isOpen,
  onClose,
  testimonial,
  services,
  onSuccess,
}: TestimonialModalProps) {
  const isEditing = !!testimonial?.id;

  const [patientName, setPatientName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState("");
  const [treatment, setTreatment] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (testimonial) {
      setPatientName(testimonial.patient_name || "");
      setQuote(testimonial.quote_en || "");
      setRating(testimonial.rating || 5);
      setServiceId(testimonial.service_id || "");
      setTreatment(testimonial.treatment || "");
      setPhotoUrl(testimonial.photo_url || null);
      setIsApproved(testimonial.is_approved ?? true);
    } else {
      setPatientName("");
      setQuote("");
      setRating(5);
      setServiceId("");
      setTreatment("");
      setPhotoUrl(null);
      setIsApproved(true);
    }
    setErrorMessage("");
  }, [testimonial, isOpen]);

  // When serviceId changes, update treatment name
  function handleServiceChange(selectedId: string) {
    setServiceId(selectedId);
    const svc = services.find((s) => s.id === selectedId);
    if (svc) {
      setTreatment(svc.name_en);
    }
  }

  async function handleSave(targetApproval: boolean) {
    setErrorMessage("");

    if (!patientName.trim()) {
      setErrorMessage("Patient name is required.");
      return;
    }
    if (!quote.trim()) {
      setErrorMessage("Testimonial review text is required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload: TestimonialFormInput = {
        patientName: patientName.trim(),
        quote: quote.trim(),
        rating,
        treatment: treatment.trim() || "General Treatment",
        serviceId: serviceId || undefined,
        photoUrl: photoUrl || undefined,
        isApproved: targetApproval,
        isFeatured: testimonial?.is_featured || false,
        displayOrder: testimonial?.display_order || 0,
      };

      const result = await saveTestimonialAction(testimonial?.id || null, payload);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to save testimonial.");
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

  const activeRating = hoverRating ?? rating;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => (!submitting ? onClose() : undefined)}
      title={isEditing ? "Edit Patient Testimonial" : "Add Patient Testimonial"}
      description="Add patient feedback and star rating to highlight clinical satisfaction."
      maxWidth="lg"
    >
      <div className="space-y-6">
        {errorMessage && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Visual Star Rating Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Star Rating <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 max-w-fit">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setRating(star)}
                className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= activeRating
                      ? "text-amber-500 fill-amber-400 drop-shadow-xs"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-amber-900 ml-2">
              {rating} of 5 Stars
            </span>
          </div>
        </div>

        {/* Patient Name & Service */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Patient Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Ananya Menon"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Service / Procedure <span className="text-slate-400 font-normal">Optional</span>
            </label>
            <select
              value={serviceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
            >
              <option value="">Select Treatment...</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {svc.name_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Testimonial <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            required
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="&ldquo;Dr. and team made my root canal experience painless and comfortable...&rdquo;"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 leading-relaxed resize-none"
          />
        </div>

        {/* Patient Photo (Optional) */}
        <div>
          <ImageUploader
            label="Patient Photo (Optional)"
            helperText="Upload optional avatar/photo of patient (JPG, PNG, WebP)"
            value={photoUrl}
            onChange={setPhotoUrl}
            folder="testimonials"
            aspectRatio="square"
            onUploadingChange={setIsUploadingImage}
          />
        </div>

        {/* Status / Publish Toggle */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-800">Status</div>
            <div className="text-[11px] text-slate-500">
              Approved reviews are displayed on the public homepage and reviews section.
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isApproved}
              onChange={(e) => setIsApproved(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
            />
            <span className="text-xs font-semibold text-slate-800">
              {isApproved ? "Approved & Live" : "Pending Moderation"}
            </span>
          </label>
        </div>

        {/* Action Buttons: Cancel, Save, Publish */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={submitting || isUploadingImage}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={submitting || isUploadingImage}
            onClick={() => handleSave(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isUploadingImage ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading Photo...</span>
              </>
            ) : submitting ? (
              "Saving..."
            ) : (
              "Save as Pending"
            )}
          </button>

          <button
            type="button"
            disabled={submitting || isUploadingImage}
            onClick={() => handleSave(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isUploadingImage ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading Photo...</span>
              </>
            ) : submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Approve &amp; Publish</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
