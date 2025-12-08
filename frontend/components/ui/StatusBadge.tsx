"use client";

export default function StatusBadge({ status }) {
  const map = {
    perfectFit: {
      label: "Perfect Fit",
      color: "bg-emerald-500 text-white",
    },
    goodFit: {
      label: "Good Fit",
      color: "bg-cyan-500 text-white",
    },
    lowPotential: {
      label: "Low Potential",
      color: "bg-slate-500 text-white",
    },
    favorite: {
      label: "Favorite",
      color: "bg-cyan-500 text-white",
    },
    rejected: {
      label: "Rejected",
      color: "bg-slate-600 text-white",
    },
    contacted: {
      label: "Contacted",
      color: "bg-emerald-400 text-white",
    },
  };

  const style = map[status] || map["goodFit"];

  return (
    <span
      className={`
        px-3 py-1 text-xs font-bold rounded-full
        border border-white/10 shadow-md
        ${style.color}
      `}
    >
      {style.label}
    </span>
  );
}
