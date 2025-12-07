"use client";

export default function StatusBadge({ status }) {
  const map = {
    perfectFit: {
      label: "Perfect Fit",
      color: "bg-blue-600 text-white",
    },
    goodFit: {
      label: "Good Fit",
      color: "bg-green-500 text-white",
    },
    lowPotential: {
      label: "Low Potential",
      color: "bg-orange-500 text-white",
    },
    favorite: {
      label: "Favorite",
      color: "bg-purple-600 text-white",
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-600 text-white",
    },
    contacted: {
      label: "Contacted",
      color: "bg-yellow-500 text-black",
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
