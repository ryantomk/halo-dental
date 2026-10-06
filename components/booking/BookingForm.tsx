"use client";

/**
 * Patient Appointment Booking Form
 *
 * WHAT THIS FILE DOES:
 * Real Supabase-backed client booking wizard allowing patients to select a real active service,
 * pick a valid date, view live slot availability with collision filtering, enter patient details,
 * and submit an appointment request through the secure server action.
 *
 * WHY THIS FILE EXISTS:
 * Primary patient conversion pipeline for Halo Dental Cosmetic & Orthodontic Centre.
 *
 * LOCALIZATION:
 * Fully localized for English and Malayalam using next-intl without hardcoded user-facing strings.
 *
 * SECURITY:
 * - Uses real active services from Supabase (no fake UUIDs).
 * - Queries real-time slot availability via server action (no client-side database credentials).
 * - Enforces honeypot bot trap, client & server-side Zod validation, and double-booking checks.
 * - Server action remains authoritative boundary.
 */

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { createBooking, getAvailableSlots, getActiveServices } from "@/app/actions/booking";
import type { TimeSlot } from "@/lib/booking/availability";
import { Phone, MessageCircle, Clock, Calendar, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";

export interface ServiceItem {
  id: string;
  name: string;
  category?: string;
  durationMinutes?: number;
}

interface BookingFormProps {
  initialServices?: ServiceItem[];
  locale?: string;
}

interface BookingSuccessState {
  referenceCode: string;
  message: string;
  serviceName: string;
  date: string;
  time: string;
  patientName: string;
  phone: string;
}

const CLINIC_PHONE = "+91 85470 85403";
const CLINIC_TEL = "tel:+918547085403";
const CLINIC_WHATSAPP_NUMBER = "918547085403";

function formatTimeSlot(timeStr: string): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":").map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDateDisplay(dateStr: string, locale: string = "en"): string {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-").map(Number);
    const y = parts[0] ?? 1970;
    const m = parts[1] ?? 1;
    const d = parts[2] ?? 1;
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString(locale === "ml" ? "ml-IN" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function BookingForm({ initialServices = [], locale = "en" }: BookingFormProps) {
  const t = useTranslations("booking");
  const isMalayalam = locale === "ml";

  // Services State
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(initialServices.length === 0);
  const [serviceId, setServiceId] = useState<string>(initialServices[0]?.id || "");

  // Form Field State
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [preferredTime, setPreferredTime] = useState<string>("");
  const [patientName, setPatientName] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [honeypot, setHoneypot] = useState<string>("");

  // Slot Availability State
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isSundayClosed, setIsSundayClosed] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [bookingSuccess, setBookingSuccess] = useState<BookingSuccessState | null>(null);
  const [copiedReference, setCopiedReference] = useState<boolean>(false);

  // Minimum date: tomorrow in local YYYY-MM-DD
  const today = new Date();
  const todayIso = today.toISOString().split("T")[0];

  // Fetch active services if not passed initially
  useEffect(() => {
    if (initialServices.length > 0) {
      setServices(initialServices);
      const first = initialServices[0];
      if (!serviceId && first) {
        setServiceId(first.id);
      }
      setIsLoadingServices(false);
      return;
    }

    let isMounted = true;
    async function loadServices() {
      setIsLoadingServices(true);
      try {
        const res = await getActiveServices(locale);
        if (isMounted) {
          if (res.success && res.services.length > 0) {
            setServices(res.services);
            const first = res.services[0];
            if (first) {
              setServiceId(first.id);
            }
          }
        }
      } catch (err) {
        console.error("[BookingForm] Error fetching services:", err);
      } finally {
        if (isMounted) setIsLoadingServices(false);
      }
    }

    loadServices();
    return () => {
      isMounted = false;
    };
  }, [initialServices, locale, serviceId]);

  // Load slots when date changes
  const loadSlots = useCallback(async (date: string) => {
    if (!date) {
      setSlots([]);
      setIsSundayClosed(false);
      setSlotsError(null);
      return;
    }

    // Check Sunday client-side
    const parts = date.split("-").map(Number);
    const y = parts[0] ?? 1970;
    const m = parts[1] ?? 1;
    const d = parts[2] ?? 1;
    const dayOfWeek = new Date(y, m - 1, d).getDay();
    if (dayOfWeek === 0) {
      setIsSundayClosed(true);
      setSlots([]);
      setPreferredTime("");
      setSlotsError(null);
      return;
    }

    setIsSundayClosed(false);
    setIsLoadingSlots(true);
    setSlotsError(null);

    try {
      const res = await getAvailableSlots(date);
      if (res.success) {
        if (res.isClosed) {
          setIsSundayClosed(true);
          setSlots([]);
          setPreferredTime("");
        } else {
          setSlots(res.slots);
          // Check if current preferredTime is available in newly loaded slots
          const currentSlotStillAvailable = res.slots.some(
            (s) => s.time === preferredTime && s.available
          );
          if (!currentSlotStillAvailable) {
            // Find first available slot
            const firstAvailable = res.slots.find((s) => s.available);
            setPreferredTime(firstAvailable ? firstAvailable.time : "");
          }
        }
      } else {
        setSlotsError(res.error || t("errors.selectTime"));
      }
    } catch (err) {
      console.error("[BookingForm] Error checking slots:", err);
      setSlotsError(t("errors.genericError"));
    } finally {
      setIsLoadingSlots(false);
    }
  }, [preferredTime, t]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setPreferredDate(newDate);
    setSubmitError(null);
    if (newDate) {
      loadSlots(newDate);
    } else {
      setSlots([]);
      setPreferredTime("");
      setIsSundayClosed(false);
    }
  };

  const handleCopyReference = (refCode: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(refCode);
      setCopiedReference(true);
      setTimeout(() => setCopiedReference(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isLoadingSlots) return;

    setSubmitError(null);
    setFieldErrors({});

    // Client-side validations using localized dictionary error messages
    if (!serviceId) {
      setFieldErrors((prev) => ({ ...prev, serviceId: [t("errors.selectService")] }));
      return;
    }
    if (!preferredDate) {
      setFieldErrors((prev) => ({ ...prev, preferredDate: [t("errors.selectDate")] }));
      return;
    }
    if (isSundayClosed) {
      setSubmitError(t("errors.sunday"));
      return;
    }
    if (!preferredTime) {
      setFieldErrors((prev) => ({ ...prev, preferredTime: [t("errors.selectTime")] }));
      return;
    }
    if (!patientName || patientName.trim().length < 2) {
      setFieldErrors((prev) => ({ ...prev, patientName: [t("errors.nameRequired")] }));
      return;
    }
    if (!patientPhone || patientPhone.trim().length < 7) {
      setFieldErrors((prev) => ({ ...prev, patientPhone: [t("errors.phoneRequired")] }));
      return;
    }

    // Verify chosen slot is currently available
    const selectedSlot = slots.find((s) => s.time === preferredTime);
    if (selectedSlot && !selectedSlot.available) {
      setSubmitError(t("errors.slotOccupied"));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        serviceId,
        preferredDate,
        preferredTime,
        patientName,
        patientPhone,
        patientEmail,
        note,
        honeypot,
      });

      if (result.success && result.referenceCode) {
        const selectedServiceObj = services.find((s) => s.id === serviceId);
        setBookingSuccess({
          referenceCode: result.referenceCode,
          message: result.message || t("successDesc"),
          serviceName: selectedServiceObj?.name || result.appointmentDetails?.serviceName || t("service"),
          date: preferredDate,
          time: preferredTime,
          patientName,
          phone: patientPhone,
        });
      } else {
        const errorMsg =
          result.error?.toLowerCase().includes("reserved") ||
          result.error?.toLowerCase().includes("choose another")
            ? t("errors.slotOccupied")
            : result.error || t("errors.genericError");

        setSubmitError(errorMsg);
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        // If slot collision occurred on server, reload slots immediately to show new occupied state
        if (
          result.error?.toLowerCase().includes("reserved") ||
          result.error?.toLowerCase().includes("choose another")
        ) {
          await loadSlots(preferredDate);
        }
      }
    } catch (err) {
      console.error("[BookingForm] Submission error:", err);
      setSubmitError(t("errors.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Success State
  if (bookingSuccess) {
    const whatsappText = encodeURIComponent(
      isMalayalam
        ? `ഹലോ ഹാലോ ഡെന്റൽ, ഞാൻ ഓൺലൈനായി അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്തിട്ടുണ്ട്.\nറഫറൻസ്: ${bookingSuccess.referenceCode}\nചികിത്സ: ${bookingSuccess.serviceName}\nതീയതി: ${bookingSuccess.date} (${formatTimeSlot(bookingSuccess.time)})\nരോഗിയുടെ പേര്: ${bookingSuccess.patientName}\nഫോൺ: ${bookingSuccess.phone}`
        : `Hello Halo Dental, I have requested an appointment online.\nReference: ${bookingSuccess.referenceCode}\nProcedure: ${bookingSuccess.serviceName}\nDate: ${bookingSuccess.date} (${formatTimeSlot(bookingSuccess.time)})\nPatient: ${bookingSuccess.patientName}\nPhone: ${bookingSuccess.phone}`
    );

    return (
      <Card className="mx-auto max-w-xl text-center border-brand-gold/30 bg-white p-6 sm:p-10 shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          {t("successBadge")}
        </span>

        <CardTitle className="mt-3 text-2xl sm:text-3xl text-brand-charcoal font-display">
          {t("successTitle")}
        </CardTitle>

        <CardDescription className="mt-3 text-sm sm:text-base text-brand-charcoal/80 leading-relaxed">
          {t("successDesc")}
        </CardDescription>

        {/* Reference Box */}
        <div className="mt-6 rounded-xl border border-brand-gold/30 bg-brand-linen/60 p-4">
          <p className="text-xs uppercase tracking-wider font-semibold text-brand-charcoal/60">
            {t("referenceCode")}
          </p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-brand-charcoal">
              {bookingSuccess.referenceCode}
            </span>
            <button
              type="button"
              onClick={() => handleCopyReference(bookingSuccess.referenceCode)}
              className="inline-flex items-center gap-1 rounded-lg border border-brand-charcoal/15 bg-white px-2.5 py-1 text-xs font-medium text-brand-charcoal hover:bg-brand-linen transition-colors"
              title={t("copy")}
            >
              {copiedReference ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">{t("copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-brand-charcoal/60" />
                  <span>{t("copy")}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Details */}
        <div className="mt-6 rounded-xl border border-brand-charcoal/10 bg-white p-4 sm:p-5 text-left text-sm space-y-2.5">
          <div className="flex justify-between border-b border-brand-charcoal/5 pb-2">
            <span className="text-brand-charcoal/60">{t("service")}:</span>
            <span className="font-semibold text-brand-charcoal">{bookingSuccess.serviceName}</span>
          </div>
          <div className="flex justify-between border-b border-brand-charcoal/5 pb-2">
            <span className="text-brand-charcoal/60">{t("date")}:</span>
            <span className="font-semibold text-brand-charcoal">
              {formatDateDisplay(bookingSuccess.date, locale)}
            </span>
          </div>
          <div className="flex justify-between border-b border-brand-charcoal/5 pb-2">
            <span className="text-brand-charcoal/60">{t("time")}:</span>
            <span className="font-semibold text-brand-charcoal">
              {formatTimeSlot(bookingSuccess.time)}
            </span>
          </div>
          <div className="flex justify-between border-b border-brand-charcoal/5 pb-2">
            <span className="text-brand-charcoal/60">{t("patientName")}:</span>
            <span className="font-semibold text-brand-charcoal">{bookingSuccess.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-charcoal/60">{t("phone")}:</span>
            <span className="font-semibold text-brand-charcoal">{bookingSuccess.phone}</span>
          </div>
        </div>

        {/* Instant Contact CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            {t("confirmWhatsApp")}
          </a>
          <a
            href={CLINIC_TEL}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-brand-charcoal/20 bg-white px-5 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-linen transition-colors"
          >
            <Phone className="h-4 w-4 text-brand-gold" />
            {t("callClinic")}
          </a>
        </div>

        <Button
          className="mt-6 w-full sm:w-auto"
          variant="secondary"
          onClick={() => {
            setBookingSuccess(null);
            setPreferredDate("");
            setPreferredTime("");
            setPatientName("");
            setPatientPhone("");
            setPatientEmail("");
            setNote("");
            setSlots([]);
          }}
        >
          {t("bookAnother")}
        </Button>
      </Card>
    );
  }

  // 2. Empty or Error Services State
  if (!isLoadingServices && services.length === 0) {
    return (
      <Card className="mx-auto max-w-xl text-center border-brand-charcoal/10 bg-white p-8">
        <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-3" />
        <CardTitle className="text-xl text-brand-charcoal">
          {t("unavailableTitle")}
        </CardTitle>
        <CardDescription className="mt-2 text-sm text-brand-charcoal/70">
          {t("unavailableDesc")}
        </CardDescription>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={CLINIC_TEL}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors"
          >
            <Phone className="h-4 w-4" />
            {t("callClinic")}
          </a>
          <a
            href={`https://wa.me/${CLINIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-brand-charcoal/20 px-5 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-linen transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-emerald-600" />
            WhatsApp
          </a>
        </div>
      </Card>
    );
  }

  const availableSlotsCount = slots.filter((s) => s.available).length;

  return (
    <Card className="mx-auto max-w-xl shadow-md border-brand-charcoal/10 bg-white p-6 sm:p-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("formTitle")}</CardTitle>
          <Badge variant="gold">{t("clinicBranch")}</Badge>
        </div>
        <CardDescription>{t("formDescription")}</CardDescription>
      </CardHeader>

      {/* Global Form Submission Error */}
      {submitError && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-2.5"
        >
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{t("noticeTitle")}</p>
            <p className="mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Service Picker */}
        <div>
          {isLoadingServices ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold tracking-wide uppercase text-brand-charcoal/80">
                {t("selectServiceLabel")}
              </label>
              <div className="h-10 w-full animate-pulse rounded-xl bg-brand-linen/60" />
            </div>
          ) : (
            <Select
              label={t("selectServiceLabel")}
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setFieldErrors((prev) => ({ ...prev, serviceId: [] }));
              }}
              options={services.map((s) => ({
                value: s.id,
                label: s.durationMinutes ? `${s.name} (~${s.durationMinutes} mins)` : s.name,
              }))}
              error={fieldErrors.serviceId?.[0]}
              required
            />
          )}
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Date Picker */}
          <div>
            <Input
              label={t("dateLabel")}
              type="date"
              min={todayIso}
              value={preferredDate}
              onChange={handleDateChange}
              error={fieldErrors.preferredDate?.[0]}
              required
            />
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase text-brand-charcoal/80">
              {t("timeLabel")}
            </label>
            <div className="relative">
              <select
                value={preferredTime}
                disabled={!preferredDate || isSundayClosed || isLoadingSlots || slots.length === 0}
                onChange={(e) => {
                  setPreferredTime(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, preferredTime: [] }));
                  setSubmitError(null);
                }}
                className="w-full appearance-none rounded-xl border border-brand-charcoal/20 bg-white px-4 py-2.5 pr-10 text-sm text-brand-charcoal transition-colors focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:bg-brand-linen/40 disabled:opacity-60"
                required
              >
                {!preferredDate ? (
                  <option value="">{t("pickDateFirst")}</option>
                ) : isSundayClosed ? (
                  <option value="">{t("closedOnSundays")}</option>
                ) : isLoadingSlots ? (
                  <option value="">{t("checkingAvailability")}</option>
                ) : slots.length === 0 ? (
                  <option value="">{t("noSlotsAvailable")}</option>
                ) : (
                  <>
                    <option value="">{t("selectTimeSlot")}</option>
                    {slots.map((slot) => (
                      <option
                        key={slot.time}
                        value={slot.time}
                        disabled={!slot.available}
                      >
                        {formatTimeSlot(slot.time)} {slot.available ? "" : `(${t("reserved")})`}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-brand-charcoal/50">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            {fieldErrors.preferredTime?.[0] && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {fieldErrors.preferredTime[0]}
              </p>
            )}
          </div>
        </div>

        {/* Date Status Notices */}
        {isSundayClosed && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-600 shrink-0" />
            <span>{t("sundayWarning")}</span>
          </div>
        )}

        {isLoadingSlots && (
          <div className="rounded-xl border border-brand-charcoal/10 bg-brand-linen/40 p-3 text-xs text-brand-charcoal/70 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-gold animate-ping" />
            <span>{t("verifyingSlots")}</span>
          </div>
        )}

        {slotsError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{slotsError}</span>
          </div>
        )}

        {preferredDate && !isSundayClosed && !isLoadingSlots && slots.length > 0 && (
          <div className="flex items-center justify-between text-xs text-brand-charcoal/60 px-1">
            <span>
              {availableSlotsCount > 0 ? (
                <>
                  <span className="font-semibold text-emerald-600">{availableSlotsCount}</span>{" "}
                  {t("slotsAvailable", { count: availableSlotsCount, date: preferredDate })}
                </>
              ) : (
                <span className="text-red-600 font-semibold">
                  {t("allSlotsReserved")}
                </span>
              )}
            </span>
            <span className="text-[11px] text-brand-charcoal/40">{t("slotDuration")}</span>
          </div>
        )}

        {/* Visual Slot Selector Chips */}
        {preferredDate && !isSundayClosed && !isLoadingSlots && slots.length > 0 && availableSlotsCount > 0 && (
          <div>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-brand-charcoal/50">
              {t("quickSelect")}
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
              {slots.map((slot) => {
                const isSelected = preferredTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => {
                      setPreferredTime(slot.time);
                      setFieldErrors((prev) => ({ ...prev, preferredTime: [] }));
                      setSubmitError(null);
                    }}
                    className={`rounded-lg py-1.5 px-2 text-xs font-medium transition-all text-center border ${
                      !slot.available
                        ? "border-dashed border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through"
                        : isSelected
                        ? "border-brand-gold bg-brand-charcoal text-white shadow-sm ring-1 ring-brand-gold"
                        : "border-brand-charcoal/15 bg-white text-brand-charcoal hover:border-brand-gold/60 hover:bg-brand-linen/40"
                    }`}
                    title={slot.available ? `Book ${formatTimeSlot(slot.time)}` : t("reserved")}
                  >
                    {formatTimeSlot(slot.time)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Patient Details */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t("nameLabel")}
            placeholder={t("namePlaceholder")}
            value={patientName}
            onChange={(e) => {
              setPatientName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, patientName: [] }));
            }}
            error={fieldErrors.patientName?.[0]}
            required
          />

          <Input
            label={t("phoneLabel")}
            type="tel"
            placeholder={t("phonePlaceholder")}
            value={patientPhone}
            onChange={(e) => {
              setPatientPhone(e.target.value);
              setFieldErrors((prev) => ({ ...prev, patientPhone: [] }));
            }}
            error={fieldErrors.patientPhone?.[0]}
            required
          />
        </div>

        <Input
          label={t("emailLabel")}
          type="email"
          placeholder={t("emailPlaceholder")}
          value={patientEmail}
          onChange={(e) => {
            setPatientEmail(e.target.value);
            setFieldErrors((prev) => ({ ...prev, patientEmail: [] }));
          }}
          error={fieldErrors.patientEmail?.[0]}
          helperText={t("emailHelper")}
        />

        {/* Patient Note */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase text-brand-charcoal/80">
            {t("notesLabel")}
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("notesPlaceholder")}
            className="w-full rounded-xl border border-brand-charcoal/20 bg-white px-4 py-2.5 text-sm text-brand-charcoal placeholder:text-brand-charcoal/40 transition-colors focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
          />
        </div>

        {/* Honeypot field (hidden from real users, caught if bots fill it) */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Leave this field blank</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
          disabled={isSubmitting || isLoadingSlots || isSundayClosed || !serviceId || !preferredTime}
        >
          {isSubmitting ? t("submittingBtn") : t("submitBtn")}
        </Button>

        <p className="text-center text-xs text-brand-charcoal/50">
          {t("privacyNote")}
        </p>
      </form>
    </Card>
  );
}
