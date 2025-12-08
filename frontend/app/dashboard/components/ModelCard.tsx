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
        bg: "bg-slate-800/60",
        border: "border-slate-500/80",
        shadow: "shadow-md",
        scale: "scale-[1.01]",
      };
    }
    if (isActive) {
      return {
        bg: "bg-slate-800/50",
        border: "border-slate-600/70",
        shadow: "shadow-md",
        scale: "scale-[1.01]",
      };
    }
    return {
      bg: "bg-slate-900/50",
      border: "border-slate-700/40",
      shadow: "shadow-sm",
      scale: "scale-100",
    };
  };

  const cardStyles = getCardStyles();
  
  // Ring colors based on category
  const getRingColor = () => {
    if (!showColors) return "border-slate-700/30";
    if (model.aiCategory === "perfectFit") return "border-emerald-500/60";
    if (model.aiCategory === "goodFit") return "border-cyan-500/60";
    return "border-slate-600/50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (selectionMode) {
          onSelect();
        } else {
          onClick();
        }
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`group relative flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-300 border ${cardStyles.bg} ${cardStyles.border} ${cardStyles.shadow} ${cardStyles.scale} hover:border-opacity-80`}
    >
      {/* Selection Overlay/Checkbox */}
      {selectionMode && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 z-10"
        >
          {isSelected ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <CheckSquare size={18} className="text-cyan-400" />
            </motion.div>
          ) : (
            <Square size={18} className="text-slate-600 group-hover:text-slate-500 transition-colors" />
          )}
        </motion.div>
      )}

      {/* Photo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`relative w-16 h-16 shrink-0 rounded-xl p-[2px] border-2 ${getRingColor()} transition-all duration-300`}
      >
        <div className="w-full h-full rounded-lg overflow-hidden bg-slate-800 relative group-hover:brightness-110 transition-all duration-300">
          <img
            src={photoUrl}
            className="w-full h-full object-cover"
            alt={model.name}
            loading="lazy"
          />
        </div>
      </motion.div>

      {/* Info */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex justify-between items-start gap-2">
          <motion.h3
            whileHover={{ x: 2 }}
            className={`text-sm font-bold truncate transition-colors ${
              isActive ? "text-white" : "text-slate-300 group-hover:text-white"
            }`}
          >
            {model.name}
          </motion.h3>
          
          {/* TOP badge */}
          {showColors && model.aiCategory === 'perfectFit' && !selectionMode && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/50"
            >
              <Sparkles size={9} />
              TOP
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1.5 text-[11px] font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
          <span className="font-semibold">{model.age}y</span>
          <span className="w-1 h-1 bg-slate-500 rounded-full" />
          <span>{model.height}cm</span>
          <span className="w-1 h-1 bg-slate-500 rounded-full" />
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

