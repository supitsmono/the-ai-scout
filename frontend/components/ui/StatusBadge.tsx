"use client";

export default function StatusBadge({ status }) {
  const map = {
    perfectFit: {
      label: "Perfect Fit",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    goodFit: {
      label: "Good Fit",
      className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    lowPotential: {
      label: "Low Potential",
      className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    },
    favorite: {
      label: "Favorite",
      className: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    contacted: {
      label: "Contacted",
      className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    active: {
      label: "Active",
      className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    }
  };

  const style = map[status] || map["goodFit"];

  return (
    <span
      className={`
        px-2.5 py-0.5 text-[11px] font-medium rounded-md
        border
        ${style.className}
      `}
    >
      {style.label}
    </span>
  );
}
