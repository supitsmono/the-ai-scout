"use client";

import React from "react";
import StatusBadge from "@/components/ui/StatusBadge";

const countryFlags = {
  Netherlands: "🇳🇱",
  China: "🇨🇳",
  Italy: "🇮🇹",
  France: "🇫🇷",
  Spain: "🇪🇸",
  Germany: "🇩🇪",
  USA: "🇺🇸",
};

export default function ModelCard({ model, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative bg-[#111] rounded-2xl overflow-hidden cursor-pointer 
                 hover:scale-[1.03] transition-all duration-200 hover:shadow-xl hover:shadow-purple-900/20"
    >
      {/* IMAGE */}
      <div className="relative w-full h-72">
        <img
          src={model.photos?.[0]?.url}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* NEW PREMIUM BADGE */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={model.status} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <div className="text-white font-bold text-xl mb-1">
          {model.name}
        </div>

        <div className="text-gray-400 text-sm flex items-center gap-2">
          <span>{model.age} y/o</span>
          <span>• {model.height} cm</span>
          <span>• {countryFlags[model.country] || "🌍"}</span>
        </div>
      </div>
    </div>
  );
}
