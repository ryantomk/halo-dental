"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { adminLogin } from "@/app/actions/admin";
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-teal-950 flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verifying credentials...</span>
        </>
      ) : (
        <span>Sign In to Dashboard</span>
      )}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(adminLogin, null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
      {/* Back to website */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Halo Dental Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-950 mx-auto mb-4 font-serif font-bold text-2xl">
            H
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Halo Dental Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized administrative & clinical staff access only
          </p>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>{state.error}</div>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                placeholder="staff@halodental.in"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>End-to-end encrypted session & role-based audit trail</span>
          </div>
        </div>
      </div>
    </div>
  );
}
