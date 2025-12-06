"use client";

import { motion } from "framer-motion";

type GroupKey = "strongFit" | "watchlist" | "lowFit" | "rejected";

export default function ModelCard({
  model,
  group,
  availableMoves,
  onMove,
  onFavorite,
  onReject,
  onContact,
  onSelect, // ← NIEUW
}: {
  model: any;
  group: GroupKey;
  availableMoves: { key: GroupKey; label: string }[];
  onMove: (id: string, g: GroupKey) => void;
  onFavorite: (id: string) => void;
  onReject: (id: string) => void;
  onContact: (model: any) => void;
  onSelect: (model: any) => void; // ← NIEUW
}) {
  return (
    <div
      onClick={() => onSelect(model)}
      className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-3 cursor-pointer hover:bg-slate-900/70 transition"
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[13px] font-semibold">{model.name}</p>
          <p className="text-[11px] text-slate-500">
            {model.age} · {model.city}, {model.country}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 text-[10px] border border-sky-500/40">
            AI {model.score}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(model.id);
            }}
            className={`text-xs ${
              model.favorite ? "text-yellow-300" : "text-slate-500"
            }`}
          >
            {model.favorite ? "★" : "☆"}
          </button>
        </div>
      </div>

      {/* ACTIONS */}
      <div
        className="flex items-center justify-between gap-2 text-[11px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onContact(model)}
            className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-200 border border-sky-500/40"
          >
            📩 Contact
          </button>

          <button
            onClick={() => onReject(model.id)}
            className="px-2 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/40"
          >
            ✖ Reject
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {availableMoves.map((g) => (
            <button
              key={g.key}
              onClick={() => onMove(model.id, g.key)}
              className="px-2 py-0.5 text-[10px] rounded-full bg-slate-900 border border-slate-700 text-slate-300"
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
