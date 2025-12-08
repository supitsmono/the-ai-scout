"use client";

import type { ModelApplicant } from "./types";
import ModelRow from "./ModelRow";

type Props = {
  models: ModelApplicant[];
  mode: "grid" | "list";
  onSelect: (m: ModelApplicant) => void;
  imageBase: string;
};

export default function ModelGrid({
  models,
  mode,
  onSelect,
  imageBase,
}: Props) {
  if (models.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-3xl">
        No models in this stage yet.
      </div>
    );
  }

  if (mode === "list") {
    return (
      <div className="flex-1 rounded-3xl border border-neutral-800 bg-neutral-950/60 backdrop-blur-xl overflow-hidden">
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr] text-[10px] uppercase tracking-wide text-neutral-500 border-b border-neutral-800 px-4 py-2">
          <span>Name</span>
          <span>City</span>
          <span>AI score</span>
          <span>Category</span>
        </div>
        <div className="divide-y divide-neutral-900 text-xs">
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelect(m)}
              className="w-full text-left hover:bg-neutral-900/80 px-4 py-3 flex items-center gap-3 transition"
            >
              <ModelRow model={m} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto">
      {models.map((m) => {
        const mainPhoto =
          m.photo_1 || m.photo_2 || m.photo_3 || m.photo_4 || null;
        const url = mainPhoto ? `${imageBase}/${mainPhoto}` : null;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m)}
            className="group rounded-3xl border border-neutral-800 bg-neutral-950/70 backdrop-blur-xl overflow-hidden text-left hover:border-indigo-500/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 transition-transform duration-200"
          >
            <div className="relative aspect-3/4 overflow-hidden">
              {url ? (
                <img
                  src={url}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-500 bg-neutral-900">
                  No photo
                </div>
              )}
              {m.ai_category && (
                <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-white border border-white/10">
                  {m.ai_category.toUpperCase()}
                </span>
              )}
              {m.ai_score != null && (
                <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-indigo-600/80">
                  {m.ai_score}
                </span>
              )}
            </div>
            <div className="p-3 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium truncate">{m.name}</p>
                {m.city && (
                  <p className="text-[10px] text-neutral-500 truncate">
                    {m.city}
                  </p>
                )}
              </div>
              <p className="text-[10px] text-neutral-500">
                {m.height_cm ? `${m.height_cm} cm` : "Height N/A"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
