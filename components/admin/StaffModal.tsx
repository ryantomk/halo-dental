"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { createStaffUserAction, updateStaffUserAction } from "@/app/actions/admin";
import { AlertCircle, Loader2, ShieldCheck, UserCheck, Stethoscope, Users, Key } from "lucide-react";

export interface StaffData {
  id?: string;
  email: string;
  full_name: string;
  role: "admin" | "staff" | "doctor";
  is_active: boolean;
  created_at?: string;
  last_sign_in_at?: string | null;
}

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffData | null;
  onSuccess?: () => void;
}

export default function StaffModal({
  isOpen,
  onClose,
  staff,
  onSuccess,
}: StaffModalProps) {
  const isEditing = !!staff?.id;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "staff" | "doctor">("staff");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (staff) {
      setFullName(staff.full_name || "");
      setEmail(staff.email || "");
      setRole(staff.role || "staff");
      setPassword("");
      setIsActive(staff.is_active ?? true);
    } else {
      setFullName("");
      setEmail("");
      setRole("staff");
      setPassword("");
      setIsActive(true);
    }
    setErrorMessage("");
  }, [staff, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage("Please enter a valid full name (at least 2 characters).");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!isEditing) {
      if (!password || password.length < 8) {
        setErrorMessage("Password must be at least 8 characters.");
        return;
      }
    }

    try {
      setSubmitting(true);

      if (isEditing && staff?.id) {
        const res = await updateStaffUserAction({
          id: staff.id,
          fullName: fullName.trim(),
          role,
          isActive,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Failed to update staff member.");
        } else {
          onClose();
          if (onSuccess) onSuccess();
        }
      } else {
        const res = await createStaffUserAction({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          role,
          password,
          isActive,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Failed to create staff member.");
        } else {
          onClose();
          if (onSuccess) onSuccess();
        }
      }
    } catch {
      setErrorMessage("An unexpected network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => (!submitting ? onClose() : undefined)}
      title={isEditing ? "Edit Staff Account" : "Add New Staff Member"}
      description={
        isEditing
          ? "Update clinical access permissions and status for this team member."
          : "Create a verified account for dental clinic doctors, clinical staff, or administrators."
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMessage && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Dr. Ayesha Rahman or Nurse Anjali"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address (Login Username) <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            disabled={isEditing}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staff@halodental.in"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none ${
              isEditing
                ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                : "border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            }`}
          />
          {isEditing && (
            <p className="text-[11px] text-slate-400 mt-1">
              Email addresses cannot be modified directly after account creation for security.
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Role & Permissions <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                id: "admin",
                title: "Admin",
                desc: "Full portal & staff access",
                icon: ShieldCheck,
                color: "text-indigo-600",
              },
              {
                id: "doctor",
                title: "Doctor",
                desc: "Clinical schedule & patients",
                icon: Stethoscope,
                color: "text-teal-600",
              },
              {
                id: "staff",
                title: "Staff",
                desc: "Desk & appointments triage",
                icon: Users,
                color: "text-slate-600",
              },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = role === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id as any)}
                  className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-xs"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? "text-teal-600" : option.color}`} />
                  <span className="text-xs font-bold text-slate-900">{option.title}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">{option.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Temporary Password (Create Mode Only) */}
        {!isEditing && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Temporary Setup Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Provide this temporary password securely to the team member. They can sign in immediately at /admin/login.
            </p>
          </div>
        )}

        {/* Account Status Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <div className="text-xs font-semibold text-slate-800">Account Active</div>
            <div className="text-[11px] text-slate-500">
              {isActive ? "User can log in and access the portal." : "Access blocked until re-activated."}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isEditing ? "Updating..." : "Creating Account..."}</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isEditing ? "Save Changes" : "Create Account"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
