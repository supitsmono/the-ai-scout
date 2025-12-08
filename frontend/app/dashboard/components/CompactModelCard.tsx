"use client";

import React from "react";
import StatusBadge from "@/components/ui/StatusBadge";


export default function CompactModelCard({ model, onClick }: { model: any; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="relative bg-[#111] rounded-xl overflow-hidden cursor-pointer 
                 hover:scale-[1.02] transition-all duration-200 hover:shadow-lg hover:shadow-purple-900/20 border border-white/10"
    >
      {/* IMAGE */}
      <div className="relative w-full h-48">
        <img
          src={model.photos?.[0]?.url}
          className="w-full h-full object-cover"
          alt={model.name}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

        {/* BADGE */}
        <div className="absolute top-2 left-2">
          <StatusBadge status={model.status || model.aiCategory} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <div className="text-white font-semibold text-sm mb-1 truncate">
          {model.name}
        </div>

        <div className="text-gray-400 text-xs flex items-center gap-1.5">
          <span>{model.age} y/o</span>
          <span>•</span>
          <span>{model.height} cm</span>
          <span>•</span>
          <span>{model.country}</span>
        </div>
      </div>
    </div>
  );
}

