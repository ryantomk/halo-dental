"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Stethoscope,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  UserCog,
  LogOut,
  X,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { adminLogout } from "@/app/actions/admin";
import type { StaffUser } from "@/lib/admin/auth";

interface AdminSidebarProps {
  staffUser: StaffUser;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: LucideIcon;
    exact?: boolean;
    adminOnly?: boolean;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "DASHBOARD",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    title: "APPOINTMENTS",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { label: "Calendar", href: "/admin/calendar", icon: CalendarIcon },
      { label: "Availability", href: "/admin/availability", icon: Clock },
    ],
  },
  {
    title: "PATIENTS",
    items: [
      { label: "Patients", href: "/admin/patients", icon: Users },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Services", href: "/admin/services", icon: Stethoscope },
      { label: "Blog", href: "/admin/blog", icon: BookOpen },
      { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    ],
  },
  {
    title: "TEAM & SETTINGS",
    items: [
      { label: "Staff", href: "/admin/staff", icon: UserCog, adminOnly: true },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar({ staffUser, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-900/50 font-serif font-bold text-lg group-hover:scale-105 transition-transform">
            H
          </div>
          <div>
            <div className="font-semibold text-white tracking-tight leading-tight group-hover:text-teal-300 transition-colors">
              Halo Dental
            </div>
            <div className="text-[10px] text-teal-400 font-medium uppercase tracking-wider">
              Clinic CMS & Staff
            </div>
          </div>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items
                .filter((item) => !item.adminOnly || staffUser.role === "admin")
                .map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? "bg-teal-600 text-white shadow-sm shadow-teal-950 font-semibold ring-1 ring-teal-400/30"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Staff Profile & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50 border border-slate-800 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-teal-300 border border-slate-600 shrink-0">
            {staffUser.full_name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {staffUser.full_name}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-teal-500/20 text-teal-300 uppercase tracking-wide">
                <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                {staffUser.role}
              </span>
            </div>
          </div>
        </div>

        <form action={adminLogout}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 z-30 shadow-xl border-r border-slate-800">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer with Animated Backdrop */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
