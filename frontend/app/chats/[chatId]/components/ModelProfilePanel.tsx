"use client";

import { useState, useEffect } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  Ruler, 
  Info,
  Sparkles,
  User,
  MapPin,
  Calendar
} from "lucide-react";

type PhotoObj = {
  url: string;
  type?: string;
};

type ModelData = {
  id: number;
  name: string;
  age?: number;
  height_cm?: number;
  height?: number;
  country?: string;
  status?: string;
  photos?: PhotoObj[] | string[];
  measurements?: {
    bust?: number;
    waist?: number;
    hips?: number;
  };
  motivation?: string;
  aiCategory?: string | null;
  aiReasons?: string[] | null;
};

type Props = {
  model: ModelData | null;
  onClose: () => void;
};

export default function ModelProfilePanel({ model, onClose }: Props) {
  if (!model) return null;

  // Normalize photos - limit to reasonable number
  let photos: PhotoObj[] = [];
  if (model.photos && Array.isArray(model.photos) && model.photos.length > 0) {
    photos = model.photos.slice(0, 12).map((p: any) =>
      typeof p === "string" ? { url: p, type: "" } : p
    );
  } else {
    photos = [
      { url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg", type: "Portrait" },
    ];
  }

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const displayHeight = model.height || model.height_cm;
  const displayStatus = model.status || "active";

  // Close lightbox on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedPhotoIndex !== null) {
          setSelectedPhotoIndex(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedPhotoIndex, onClose]);

  const navigatePhoto = (direction: "prev" | "next") => {
    if (selectedPhotoIndex === null) return;
    if (direction === "prev") {
      setSelectedPhotoIndex(selectedPhotoIndex > 0 ? selectedPhotoIndex - 1 : photos.length - 1);
    } else {
      setSelectedPhotoIndex(selectedPhotoIndex < photos.length - 1 ? selectedPhotoIndex + 1 : 0);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] relative">
      {/* HEADER */}
      <div className="flex-none flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0A] sticky top-0 z-20">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={20} className="text-gray-400" />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
              <img 
                src={photos[0]?.url || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"} 
                alt={model.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-white truncate">{model.name}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                {model.age && (
                  <>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {model.age} years
                    </span>
                    <span>•</span>
                  </>
                )}
                {displayHeight && <span>{displayHeight} cm</span>}
                {model.country && (
                  <>
                    {(model.age || displayHeight) && <span>•</span>}
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {model.country}
                    </span>
                  </>
                )}
              </div>
            </div>
            <StatusBadge status={displayStatus} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          
          {/* PHOTO GALLERY - Compact Grid */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={14} />
              Portfolio ({photos.length} photos)
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhotoIndex(i)}
                  className="aspect-[3/4] rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all group relative bg-[#111]"
                >
                  <img 
                    src={photo.url} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                    alt={`${model.name} - ${photo.type || `Photo ${i + 1}`}`}
                  />
                  {photo.type && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[10px] text-white font-medium truncate">{photo.type}</p>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* INFO SECTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Measurements */}
            <div className="bg-[#111] rounded-xl p-5 border border-white/10">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Ruler size={14} />
                Measurements
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {displayHeight && (
                  <div>
                    <div className="text-gray-500 text-xs mb-1.5">Height</div>
                    <div className="text-white font-semibold text-lg">{displayHeight} cm</div>
                  </div>
                )}
                <div>
                  <div className="text-gray-500 text-xs mb-1.5">Bust</div>
                  <div className="text-white font-semibold text-lg">{model.measurements?.bust || "—"} cm</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1.5">Waist</div>
                  <div className="text-white font-semibold text-lg">{model.measurements?.waist || "—"} cm</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1.5">Hips</div>
                  <div className="text-white font-semibold text-lg">{model.measurements?.hips || "—"} cm</div>
                </div>
              </div>
            </div>

            {/* Bio & Motivation */}
            <div className="bg-[#111] rounded-xl p-5 border border-white/10">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info size={14} />
                Bio & Motivation
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {model.motivation || "No motivation provided yet."}
              </p>
            </div>
          </div>

          {/* AI Classification */}
          {model.aiCategory && (
            <div className="bg-[#111] rounded-xl p-5 border border-white/10">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={14} />
                AI Classification
              </h3>
              <div className="mb-4">
                <StatusBadge status={model.aiCategory} />
              </div>
              {model.aiReasons && model.aiReasons.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-3">Analysis Summary:</p>
                  <ul className="space-y-2">
                    {model.aiReasons.map((reason, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start">
                        <span className="mr-2 text-purple-400 mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SIMPLE LIGHTBOX - Only shows when photo is selected */}
      {selectedPhotoIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
            aria-label="Close"
          >
            <X size={24} className="text-white" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); navigatePhoto("prev"); }}
            className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); navigatePhoto("next"); }}
            className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight size={24} className="text-white" />
          </button>

          <div 
            className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[selectedPhotoIndex].url}
              alt={`${model.name} - ${photos[selectedPhotoIndex].type || `Photo ${selectedPhotoIndex + 1}`}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-white">
            {selectedPhotoIndex + 1} / {photos.length}
            {photos[selectedPhotoIndex].type && ` • ${photos[selectedPhotoIndex].type}`}
          </div>
        </div>
      )}
    </div>
  );
}
