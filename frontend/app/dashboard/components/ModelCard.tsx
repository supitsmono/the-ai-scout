"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Square, Sparkles } from "lucide-react";
import type { DashboardModel } from "../page";

interface ModelCardProps {
  model: DashboardModel;
  index: number;
  isSelected: boolean;
  isActive: boolean;
  selectionMode: boolean;
  selectedTab: string;
  onSelect: () => void;
  onClick: () => void;
}

const ModelCard = memo(function ModelCard({
  model,
  index,
  isSelected,
  isActive,
  selectionMode,
  selectedTab,
  onSelect,
  onClick,
}: ModelCardProps) {
  // Find "Full Face" or "Headshot Full Face" photo for profile, otherwise use first photo
  const findProfilePhoto = () => {
    if (!model.photos || model.photos.length === 0) {
      return "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";
    }

    // Look for Full Face photo first
    const fullFacePhoto = model.photos.find((p: any) => {
      const photo = typeof p === 'string' ? { url: p } : p;
      const type = photo.type?.toLowerCase() || '';
      return type.includes('full face') || type.includes('headshot') || type === 'full face';
    });

    if (fullFacePhoto) {
      return typeof fullFacePhoto === 'string' ? fullFacePhoto : fullFacePhoto.url;
    }

    // Fallback to first photo
    const firstPhoto = model.photos[0];
    return typeof firstPhoto === 'string' ? firstPhoto : (firstPhoto?.url || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg");
  };

  const photoUrl = findProfilePhoto();

  // Only show colors in specific tabs, not in "All"
  const showColors = selectedTab !== "all";

  // Clean color scheme without purple or glow effects
  const getCardStyles = () => {
    if (selectionMode && isSelected) {
      return {
        bg: "bg-slate-800/80",
        border: "border-slate-600",
        shadow: "",
        scale: "",
      };
    }
    if (isActive) {
      return {
        bg: "bg-slate-800/40",
        border: "border-slate-700",
        shadow: "",
        scale: "",
      };
    }
    return {
      bg: "bg-transparent",
      border: "border-slate-800/60",
      shadow: "",
      scale: "",
    };
  };

  const cardStyles = getCardStyles();

  // Ring colors based on category - Subtle borders now
  const getRingColor = () => {
    if (!showColors) return "border-slate-800";
    if (model.aiCategory === "perfectFit") return "border-emerald-500/40";
    if (model.aiCategory === "goodFit") return "border-blue-500/40"; // Blue instant of Cyan
    return "border-slate-800";
  };

  return (
    <motion.div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (selectionMode) {
          onSelect();
        } else {
          onClick();
        }
      }}
      className={`group relative flex items-start gap-3 p-3.5 rounded-lg cursor-pointer transition-colors duration-200 border ${cardStyles.bg} ${cardStyles.border} hover:bg-slate-900/40 hover:border-slate-700`}
    >
      {/* Selection Overlay/Checkbox */}
      {selectionMode && (
        <div
          className="absolute top-3 right-3 z-10"
        >
          {isSelected ? (
            <CheckSquare size={16} className="text-blue-400" />
          ) : (
            <Square size={16} className="text-slate-600 group-hover:text-slate-500 transition-colors" />
          )}
        </div>
      )}

      {/* Photo */}
      <div
        className={`relative w-12 h-12 shrink-0 rounded-lg p-[1px] border ${getRingColor()} transition-colors`}
      >
        <div className="w-full h-full rounded-[7px] overflow-hidden bg-slate-800 relative">
          <img
            src={photoUrl}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            alt={model.name}
            loading="lazy"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex justify-between items-start gap-2">
          <h3
            className={`text-sm font-medium truncate transition-colors ${isActive ? "text-white" : "text-slate-300 group-hover:text-white"
              }`}
          >
            {model.name}
          </h3>

          {/* TOP badge - Subtle */}
          {showColors && model.aiCategory === 'perfectFit' && !selectionMode && (
            <div
              className="flex items-center gap-0.5 text-[9px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20"
            >
              TOP
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-slate-500 group-hover:text-slate-400 transition-colors">
          <span>{model.age}y</span>
          <span className="w-0.5 h-0.5 bg-slate-700 rounded-full" />
          <span>{model.height}cm</span>
          <span className="w-0.5 h-0.5 bg-slate-700 rounded-full" />
          <span className="truncate">
            {model.country}
          </span>
        </div>

        {/* Quick Stat Tag */}
        <motion.div
          whileHover={{ x: 2 }}
          className="mt-2.5 flex"
        >
          <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-1 rounded-md border border-white/10 group-hover:border-white/20 group-hover:text-slate-300 group-hover:bg-white/10 transition-all truncate max-w-[140px]">
            {model.motivation ? "Applied: " + model.motivation.substring(0, 18) + "..." : "New Applicant"}
          </span>
        </motion.div>
      </div>

    </motion.div>
  );
});

export default ModelCard;

