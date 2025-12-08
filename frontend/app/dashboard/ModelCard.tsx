"use client";

import React from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { Sparkles } from "lucide-react";

const countryFlags: Record<string, string> = {
  Netherlands: "🇳🇱",
  China: "🇨🇳",
  Italy: "🇮🇹",
  France: "🇫🇷",
  Spain: "🇪🇸",
  Germany: "🇩🇪",
  USA: "🇺🇸",
};

export default function ModelCard({ model, onClick }: { model: any, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#0F1320]/60 border border-slate-800/50 rounded-2xl overflow-hidden cursor-pointer 
                 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-purple-500/30 backdrop-blur-sm"
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <img
          src={model.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={model.name}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1320] via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors duration-300" />

        {/* NEW PREMIUM BADGE */}
        <div className="absolute top-3 right-3 flex gap-2">
          {model.aiCategory === "Top Choice" && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles size={10} className="fill-white" />
              Top Pick
            </div>
          )}
        </div>

        <div className="absolute top-3 left-3">
          <StatusBadge status={model.status} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex justify-between items-end mb-1">
          <div className="text-white font-bold text-xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
            {model.name}
          </div>
          <div className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-200">
            {countryFlags[model.country] || "🌍"}
          </div>
        </div>

        <div className="text-slate-400 text-xs font-medium flex items-center gap-3 border-t border-slate-700/50 pt-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-slate-500"></span>{model.age} y/o</span>
          <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-slate-500"></span>{model.height} cm</span>
          {model.measurements?.bust && <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-slate-500"></span>{model.measurements.bust}-{model.measurements.waist}-{model.measurements.hips}</span>}
        </div>
      </div>
    </div>
  );
}
