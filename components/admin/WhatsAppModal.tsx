"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import {
  type WhatsAppTemplateType,
  type WhatsAppAppointmentData,
  buildWhatsAppMessage,
  generateWhatsAppUrl,
  normalizePhoneNumber,
} from "@/lib/utils/whatsapp";
import {
  MessageSquare,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  CalendarCheck,
  CalendarDays,
  XCircle,
  Phone,
} from "lucide-react";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    reference_code: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    patient: {
      full_name: string;
      phone: string;
    };
  } | null;
  initialTemplate?: WhatsAppTemplateType;
}

export default function WhatsAppModal({
  isOpen,
  onClose,
  appointment,
  initialTemplate,
}: WhatsAppModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplateType>("confirmation");
  const [phoneOverride, setPhoneOverride] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  // Set default template based on appointment status
  useEffect(() => {
    if (appointment) {
      setPhoneOverride(appointment.patient.phone || "");
      setHasOpened(false);
      setIsCopied(false);

      if (initialTemplate) {
        setSelectedTemplate(initialTemplate);
      } else if (appointment.status === "confirmed") {
        setSelectedTemplate("confirmation");
      } else if (appointment.status === "cancelled") {
        setSelectedTemplate("cancellation");
      } else {
        setSelectedTemplate("reminder");
      }
    }
  }, [appointment, initialTemplate, isOpen]);

  // Update generated message when template or appointment changes
  useEffect(() => {
    if (!appointment) return;

    const data: WhatsAppAppointmentData = {
      patientName: appointment.patient.full_name,
      phone: phoneOverride || appointment.patient.phone,
      appointmentDate: appointment.appointment_date,
      appointmentTime: appointment.appointment_time,
      referenceCode: appointment.reference_code,
    };

    setCustomMessage(buildWhatsAppMessage(selectedTemplate, data));
  }, [selectedTemplate, appointment, phoneOverride]);

  if (!appointment) return null;

  const phoneCheck = normalizePhoneNumber(phoneOverride);
  const { url, isValid, error } = generateWhatsAppUrl(phoneOverride, customMessage);

  function handleCopy() {
    if (!customMessage) return;
    navigator.clipboard.writeText(customMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  }

  function handleOpenWhatsApp() {
    if (!isValid || !url) return;
    window.open(url, "_blank", "noopener,noreferrer");
    setHasOpened(true);
  }

  const templates: {
    id: WhatsAppTemplateType;
    label: string;
    icon: any;
    allowedStatus?: string[];
  }[] = [
    {
      id: "confirmation",
      label: "Confirmation",
      icon: CalendarCheck,
    },
    {
      id: "reminder",
      label: "Reminder",
      icon: Clock,
    },
    {
      id: "reschedule",
      label: "Reschedule",
      icon: CalendarDays,
    },
    {
      id: "cancellation",
      label: "Cancellation",
      icon: XCircle,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Prepare WhatsApp Message"
      description={`Send a verified clinic communication to ${appointment.patient.full_name} for Ref: ${appointment.reference_code}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Recipient Contact Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {appointment.patient.full_name}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="font-mono">{phoneCheck.formatted || phoneOverride}</span>
                {phoneCheck.isValid ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified WhatsApp
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <AlertCircle className="w-3 h-3" />
                    Needs Country Code
                  </span>
                )}
              </div>
            </div>
          </div>

          {!phoneCheck.isValid && (
            <div className="text-xs">
              <input
                type="text"
                value={phoneOverride}
                onChange={(e) => setPhoneOverride(e.target.value)}
                placeholder="e.g. 919846012345"
                className="px-3 py-1.5 rounded-lg border border-amber-300 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Template Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Message Template
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {templates.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedTemplate === t.id;
              const isRecommended =
                (t.id === "confirmation" && appointment.status === "confirmed") ||
                (t.id === "cancellation" && appointment.status === "cancelled");

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-500/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mb-1.5 ${
                      isSelected ? "text-emerald-700" : "text-slate-400"
                    }`}
                  />
                  <span className="text-xs">{t.label}</span>
                  {isRecommended && (
                    <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">
                      Matched Status
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Content & Preview */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Message Preview &amp; Customization
            </label>
            <span className="text-[11px] text-slate-400">Review before opening in WhatsApp</span>
          </div>

          <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-3">
            <textarea
              rows={8}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-800 font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed custom-scrollbar resize-none"
            />

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 px-1">
              <span className="text-[11px] text-slate-400">
                Variables filled: {appointment.patient.full_name}, {appointment.appointment_date}, {appointment.appointment_time}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition-colors"
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Guidance Notice */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-950 text-xs flex items-start gap-2.5">
          <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-emerald-900">
              WhatsApp Click-to-Send Workflow
            </div>
            <p className="text-[11px] text-emerald-800 leading-normal">
              Clicking &ldquo;Open in WhatsApp&rdquo; opens the official WhatsApp chat with this message prefilled.
              <strong> You must review the text and manually press the Send button inside WhatsApp.</strong>
            </p>
          </div>
        </div>

        {/* Status Confirmation if Opened */}
        {hasOpened && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              WhatsApp chat was opened in a new tab. Please confirm you have pressed <strong>Send</strong> in WhatsApp.
            </span>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            disabled={!isValid || !url}
            onClick={handleOpenWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in WhatsApp</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
