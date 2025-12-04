"use client";

import type { ModelApplicant } from "./types";

export default function ModelRow({ model }: { model: ModelApplicant }) {
  const badgeColor =
    model.ai_category === "high"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
      : model.ai_category === "medium"
      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
      : model.ai_category === "low"
      ? "bg-red-500/10 text-red-300 border-red-500/40"
      : "bg-neutral-800/60 text-neutral-300 border-neutral-700";

  return (
    <>
      <div className="flex flex-col">
        <span className="text-xs font-medium">{model.name}</span>
        <span className="text-[10px] text-neutral-500">{model.email}</span>
      </div>
      <div className="text-xs text-neutral-300">
        {model.city || <span className="text-neutral-600">Unknown</span>}
      </div>
      <div className="text-xs">
        {model.ai_score != null ? model.ai_score : <span className="text-neutral-600">N/A</span>}
      </div>
      <div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${badgeColor}`}
        >
          {model.ai_category || "unranked"}
        </span>
      </div>
    </>
  );
}
