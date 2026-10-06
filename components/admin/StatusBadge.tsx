export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const normalized = status.toLowerCase() as AppointmentStatus;

  const config: Record<
    AppointmentStatus,
    { label: string; bg: string; text: string; dot: string }
  > = {
    pending: {
      label: "Pending",
      bg: "bg-amber-50 border-amber-200/80",
      text: "text-amber-800",
      dot: "bg-amber-500",
    },
    confirmed: {
      label: "Confirmed",
      bg: "bg-emerald-50 border-emerald-200/80",
      text: "text-emerald-800",
      dot: "bg-emerald-500",
    },
    in_progress: {
      label: "In Progress",
      bg: "bg-blue-50 border-blue-200/80",
      text: "text-blue-800",
      dot: "bg-blue-500",
    },
    completed: {
      label: "Completed",
      bg: "bg-teal-50 border-teal-200/80",
      text: "text-teal-800",
      dot: "bg-teal-500",
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-rose-50 border-rose-200/80",
      text: "text-rose-800",
      dot: "bg-rose-500",
    },
    no_show: {
      label: "No Show",
      bg: "bg-slate-100 border-slate-200",
      text: "text-slate-700",
      dot: "bg-slate-400",
    },
  };

  const current = config[normalized] || {
    label: status,
    bg: "bg-slate-50 border-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-400",
  };

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5 gap-1.5"
      : "text-xs font-medium px-2.5 py-1 gap-2";

  return (
    <span
      className={`inline-flex items-center rounded-full border ${current.bg} ${current.text} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
}
