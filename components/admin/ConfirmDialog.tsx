"use client";

import { useState, type ReactNode } from "react";
import Modal from "@/components/ui/Modal";
import { AlertTriangle, Loader2 } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = isLoading || internalLoading;

  async function handleConfirm() {
    try {
      setInternalLoading(true);
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  }

  const confirmBtnStyles = {
    danger: "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white focus:ring-rose-500",
    warning: "bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white focus:ring-amber-500",
    primary: "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white focus:ring-teal-500",
  }[variant];

  return (
    <Modal isOpen={isOpen} onClose={() => (!loading ? onClose() : undefined)} title={title} maxWidth="md">
      <div className="space-y-5">
        <div className="flex items-start gap-3.5">
          {variant === "danger" && (
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          {variant === "warning" && (
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 text-sm text-slate-600 pt-0.5 leading-relaxed">
            {typeof message === "string" ? <p>{message}</p> : message}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl shadow-xs transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-60 ${confirmBtnStyles}`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
