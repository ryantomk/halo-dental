"use client";

import { useState, useMemo } from "react";
import StaffModal, { type StaffData } from "./StaffModal";
import ConfirmDialog from "./ConfirmDialog";
import { toggleStaffStatusAction } from "@/app/actions/admin";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  Stethoscope,
  Clock,
  CheckCircle2,
  XCircle,
  Edit2,
  Power,
  AlertCircle,
  Key,
} from "lucide-react";

interface StaffClientProps {
  initialStaff: StaffData[];
  currentUserId: string;
}

export default function StaffClient({ initialStaff, currentUserId }: StaffClientProps) {
  const [staffList, setStaffList] = useState<StaffData[]>(initialStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffData | null>(null);

  const [confirmStaff, setConfirmStaff] = useState<StaffData | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const filteredStaff = useMemo(() => {
    return staffList.filter((member) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = member.full_name.toLowerCase().includes(q);
        const matchesEmail = member.email.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail) return false;
      }

      if (roleFilter !== "all" && member.role !== roleFilter) {
        return false;
      }

      if (statusFilter !== "all") {
        if (statusFilter === "active" && !member.is_active) return false;
        if (statusFilter === "inactive" && member.is_active) return false;
      }

      return true;
    });
  }, [staffList, searchQuery, roleFilter, statusFilter]);

  async function handleToggleStatus() {
    if (!confirmStaff) return;
    const targetId = confirmStaff.id!;
    const newStatus = !confirmStaff.is_active;

    setTogglingId(targetId);
    setFeedback(null);

    try {
      const res = await toggleStaffStatusAction(targetId, newStatus);
      if (!res.success) {
        setFeedback({ type: "error", message: res.error || "Failed to update staff status." });
      } else {
        setStaffList((prev) =>
          prev.map((s) => (s.id === targetId ? { ...s, is_active: newStatus } : s))
        );
        setFeedback({
          type: "success",
          message: `✓ ${confirmStaff.full_name} has been ${newStatus ? "activated" : "deactivated"} successfully.`,
        });
        setIsConfirmOpen(false);
        setConfirmStaff(null);
      }
    } catch {
      setFeedback({ type: "error", message: "Network error updating staff status." });
    } finally {
      setTogglingId(null);
    }
  }

  function getRoleBadge(role: string) {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Administrator
          </span>
        );
      case "doctor":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            Doctor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            Staff
          </span>
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Staff Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage authenticated clinic team accounts, roles, and administrative privileges
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingStaff(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="doctor">Doctors</option>
            <option value="staff">Clinical Staff</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Team Member</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Created Date</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Last Sign-in</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">No staff members found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Try adjusting your search query or role filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => {
                  const isSelf = member.id === currentUserId;
                  const initials = member.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Name & Email */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                            {initials || "ST"}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-2">
                              <span>{member.full_name}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 rounded-md">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">{getRoleBadge(member.role)}</td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {member.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 hidden md:table-cell text-slate-600">
                        {member.created_at
                          ? new Date(member.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Last Sign-in */}
                      <td className="py-4 px-4 hidden lg:table-cell text-slate-500 text-[11px]">
                        {member.last_sign_in_at ? (
                          <span className="flex items-center gap-1.5 text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(member.last_sign_in_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Never signed in</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStaff(member);
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50 text-xs font-semibold transition-colors"
                            title="Edit details & role"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmStaff(member);
                                setIsConfirmOpen(true);
                              }}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                member.is_active
                                  ? "text-rose-600 hover:bg-rose-50"
                                  : "text-emerald-700 hover:bg-emerald-50"
                              }`}
                              title={member.is_active ? "Deactivate account" : "Activate account"}
                            >
                              <Power className="w-3.5 h-3.5" />
                              <span>{member.is_active ? "Deactivate" : "Activate"}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Add/Edit Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStaff(null);
        }}
        staff={editingStaff}
        onSuccess={() => window.location.reload()}
      />

      {/* Confirmation Dialog for Sensitive Activate/Deactivate */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setConfirmStaff(null);
        }}
        onConfirm={handleToggleStatus}
        title={confirmStaff?.is_active ? "Deactivate Staff Account" : "Activate Staff Account"}
        message={
          confirmStaff?.is_active ? (
            <>
              Are you sure you want to deactivate{" "}
              <strong className="text-slate-900">{confirmStaff?.full_name}</strong>?
              They will immediately lose access to the Halo Dental admin dashboard.
            </>
          ) : (
            <>
              Re-activate <strong className="text-slate-900">{confirmStaff?.full_name}</strong>?
              They will regain access to their assigned clinical tools.
            </>
          )
        }
        confirmText={confirmStaff?.is_active ? "Deactivate Account" : "Activate Account"}
        variant={confirmStaff?.is_active ? "danger" : "primary"}
        isLoading={togglingId === confirmStaff?.id}
      />
    </div>
  );
}
