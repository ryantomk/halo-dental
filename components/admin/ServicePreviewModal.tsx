"use client";

import Image from "next/image";
import Modal from "@/components/ui/Modal";
import { Clock, Tag, Stethoscope, Sparkles } from "lucide-react";
import type { ServiceData } from "./ServiceEditorModal";

interface ServicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Partial<ServiceData> | null;
}

export default function ServicePreviewModal({
  isOpen,
  onClose,
  service,
}: ServicePreviewModalProps) {
  if (!service) return null;

  const priceText = service.price_display || (service.price_starting_at ? `₹${service.price_starting_at}` : "Consultation Required");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Service Public Preview" maxWidth="lg">
      <div className="space-y-6">
        {/* Banner indicating this is a preview */}
        <div className="flex items-center justify-between p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="font-semibold">Live Website Simulation</span>
          </div>
          <span className="text-[11px] text-teal-700">Preview mode only</span>
        </div>

        {/* Card Simulation */}
        <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
          {service.image_url ? (
            <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
              <Image
                src={service.image_url}
                alt={service.name_en || "Service image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          ) : (
            <div className="h-44 w-full bg-gradient-to-br from-teal-50 to-slate-100 flex flex-col items-center justify-center text-teal-700/60">
              <Stethoscope className="w-12 h-12 stroke-[1.5]" />
              <span className="text-xs font-medium mt-2">No photo uploaded</span>
            </div>
          )}

          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100 uppercase tracking-wide">
                  <Tag className="w-3 h-3" />
                  {service.category || "General"}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2 tracking-tight">
                  {service.name_en || "Untitled Dental Service"}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-slate-400 font-medium">Starting at</div>
                <div className="text-lg font-bold text-slate-900">{priceText}</div>
              </div>
            </div>

            {service.short_description_en && (
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {service.short_description_en}
              </p>
            )}

            {service.description_en && (
              <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-3">
                {service.description_en}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{service.duration_minutes || 30} minutes appointment</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    service.is_active
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {service.is_active ? "Publicly Visible" : "Hidden (Inactive)"}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="w-full py-2.5 bg-teal-600/50 text-white font-semibold rounded-xl text-xs cursor-not-allowed text-center"
            >
              Book Appointment (Preview Mode)
            </button>
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
