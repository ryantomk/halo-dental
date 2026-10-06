"use client";

import { useState } from "react";
import { updateClinicContactAction } from "@/app/actions/admin";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ClinicSettingsData {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address_line1: string;
  address_line2?: string | null;
  opening_hours?: Record<string, string>;
}

interface SettingsClientProps {
  clinic: ClinicSettingsData;
}

export default function SettingsClient({ clinic }: SettingsClientProps) {
  const [phone, setPhone] = useState(clinic.phone || "+91 85470 85403");
  const [whatsapp, setWhatsapp] = useState(clinic.whatsapp || "+91 85470 85403");
  const [email, setEmail] = useState(clinic.email || "info@halodental.in");
  const [addressLine1, setAddressLine1] = useState(clinic.address_line1 || "");
  const [addressLine2, setAddressLine2] = useState(clinic.address_line2 || "");
  const [monSatHours, setMonSatHours] = useState(
    (clinic.opening_hours as any)?.mon_sat || "09:00 - 20:00"
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setErrorMessage("");

    try {
      const res = await updateClinicContactAction({
        phone,
        whatsapp,
        email,
        address_line1: addressLine1,
        address_line2: addressLine2 || undefined,
        opening_hours: {
          mon_sat: monSatHours,
          sun: "Closed",
        },
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to update clinic settings.");
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Error saving settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Clinic & Practice Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Authoritative contact channels, address details, and clinic hours stored in Supabase
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {success && (
          <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Clinic settings successfully updated across all database tables and public pages!</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2.5 p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-2xl shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Contact Numbers */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Phone className="w-4 h-4 text-teal-600" />
            <span>Clinic Communication Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Official Clinic Phone *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                WhatsApp Hotline *
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Public Inquiry Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Physical Address */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>Physical Location & Landmark</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Address Line 1 *
              </label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Address Line 2 (City / District)
              </label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Clinic Operating Hours</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Monday to Saturday *
              </label>
              <input
                type="text"
                required
                value={monSatHours}
                onChange={(e) => setMonSatHours(e.target.value)}
                placeholder="09:00 - 20:00"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Sunday
              </label>
              <input
                type="text"
                disabled
                value="Closed (Enforced in Booking Engine)"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 rounded-xl shadow-sm transition-colors"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Clinic Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
