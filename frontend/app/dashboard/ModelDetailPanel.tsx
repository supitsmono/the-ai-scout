"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import StatusBadge from "@/components/ui/StatusBadge";
import type { DashboardModel } from "./page";
import { 
  X, 
  Heart, 
  MessageCircle, 
  Ruler, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  User,
  MapPin,
  Calendar,
  Trash2,
  ArrowLeft
} from "lucide-react";

type PhotoObj = {
  url: string;
  type?: string;
};

type Props = {
  model: DashboardModel | null;
  onClose: () => void;
  onContact?: (modelId: number, chatId?: number) => void;
  onFavoriteToggle?: () => void;
  onDelete?: () => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ModelDetailPanel({
  model,
  onClose,
  onContact,
  onFavoriteToggle,
  onDelete,
}: Props) {
  if (!model) return null;

  // Normalize photos and assign types - ensure all photos are shown
  let photos: PhotoObj[] = [];
  if (model.photos && Array.isArray(model.photos) && model.photos.length > 0) {
    photos = model.photos.map((p: any, idx: number) => {
      // Handle string photos
      if (typeof p === "string") {
        const requiredTypes = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
        return { url: p, type: requiredTypes[idx] || (idx === 4 ? "Hobby" : `Photo ${idx + 1}`) };
      }
      // Handle photo objects
      const photoObj = p || {};
      // If no type assigned, assign based on index
      if (!photoObj.type) {
        const requiredTypes = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
        photoObj.type = requiredTypes[idx] || (idx === 4 ? "Hobby" : `Photo ${idx + 1}`);
      }
      // Ensure url exists
      return { url: photoObj.url || "", type: photoObj.type || `Photo ${idx + 1}` };
    }).filter((p: PhotoObj) => p.url); // Filter out any photos without URLs
  }
  
  // If no photos or all were filtered out, use fallback
  if (photos.length === 0) {
    photos = [
      { url: "https://images.pexels.com/photos/1921168/pexels-photo-1921168.jpeg", type: "Full Face" },
      { url: "https://images.pexels.com/photos/1559086/pexels-photo-1559086.jpeg", type: "Full Body" },
      { url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", type: "Side Profile" },
      { url: "https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg", type: "Hips to Head" },
    ];
  }

  // Separate required photos (first 4) and optional photos
  const requiredPhotos = photos.slice(0, 4);
  const hobbyPhoto = photos[4] || null;
  const additionalPhotos = photos.slice(5);
  
  // All photos for lightbox navigation
  const allPhotos = photos;

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isContacting, setIsContacting] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isFavorite, setIsFavorite] = useState(model.status === "favorite");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsFavorite(model.status === "favorite");
  }, [model.status]);

  // Close lightbox on Escape and lock body scroll when lightbox is open
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
    
    // Lock body scroll when lightbox is open
    if (selectedPhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedPhotoIndex, onClose]);

  const handleContactClick = async () => {
    if (!model || isContacting) return;
    setIsContacting(true);
    try {
      const res = await fetch(`${API_BASE}/models/${model.id}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        const chatId = data.chat_id;
        if (onContact && chatId) {
          onContact(model.id, chatId);
        } else {
          onClose();
        }
      }
    } catch (err) {
      console.error("Error contacting model:", err);
      alert("Failed to contact model. Please try again.");
    } finally {
      setIsContacting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!model || isTogglingFavorite) return;
    setIsTogglingFavorite(true);
    try {
      const res = await fetch(`${API_BASE}/models/${model.id}/favorite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
        if (onFavoriteToggle) onFavoriteToggle();
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleDelete = async () => {
    if (!model || isDeleting) return;
    
    const confirmed = window.confirm(
      `⚠️ WARNING: This will permanently delete "${model.name}" from the system.\n\nThis will also delete:\n- All associated chats\n- All messages\n\nThis action cannot be undone. Are you sure?`
    );
    
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/models/${model.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (onDelete) {
          onDelete();
        }
        onClose();
      } else {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete model");
      }
    } catch (err) {
      console.error("Error deleting model:", err);
      alert("Failed to delete model. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    if (selectedPhotoIndex === null) return;
    if (direction === "prev") {
      setSelectedPhotoIndex(selectedPhotoIndex > 0 ? selectedPhotoIndex - 1 : allPhotos.length - 1);
    } else {
      setSelectedPhotoIndex(selectedPhotoIndex < allPhotos.length - 1 ? selectedPhotoIndex + 1 : 0);
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
                src={requiredPhotos[0]?.url || photos[0]?.url || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"} 
                alt={model.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-white truncate">{model.name}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {model.age} years
                </span>
                <span>•</span>
                <span>{model.height} cm</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {model.country}
                </span>
              </div>
            </div>
            <StatusBadge status={model.status} />
          </div>
        </div>
      </div>

      {/* CONTENT - No scroll, compact layout */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-6xl mx-auto p-4 space-y-4 flex flex-col">
          
          {/* REQUIRED PHOTOS - 4 Main Photos */}
          {requiredPhotos.length > 0 && (
            <div className="shrink-0">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={12} />
                Required Photos {requiredPhotos.length < 4 && `(${requiredPhotos.length} of 4)`}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {requiredPhotos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhotoIndex(i)}
                    className="aspect-3/4 rounded-lg overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/60 transition-all group relative bg-[#111]"
                  >
                    <img 
                      src={photo.url} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                      alt={`${model.name} - ${photo.type}`}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <p className="text-xs text-white font-semibold">{photo.type}</p>
                      </div>
                    </div>
                    {/* Label always visible at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                      <p className="text-[10px] text-white font-medium text-center">{photo.type}</p>
                    </div>
                  </button>
                ))}
                {/* Show placeholder slots for missing required photos */}
                {requiredPhotos.length < 4 && Array.from({ length: 4 - requiredPhotos.length }).map((_, i) => (
                  <div
                    key={`placeholder-${i}`}
                    className="aspect-3/4 rounded-lg overflow-hidden border-2 border-dashed border-slate-700/50 bg-slate-900/30 flex items-center justify-center"
                  >
                    <div className="text-center p-4">
                      <p className="text-[10px] text-slate-500 font-medium">Missing Photo</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HOBBY PHOTO - Optional */}
          {hobbyPhoto && (
            <div className="shrink-0 mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Hobby Photo (Optional)
              </h3>
              <div className="max-w-xs">
                <button
                  onClick={() => setSelectedPhotoIndex(4)}
                  className="w-full aspect-3/4 rounded-lg overflow-hidden border-2 border-cyan-500/30 hover:border-cyan-500/60 transition-all group relative bg-[#111]"
                >
                  <img 
                    src={hobbyPhoto.url} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                    alt={`${model.name} - ${hobbyPhoto.type}`}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <p className="text-xs text-white font-semibold">{hobbyPhoto.type}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                    <p className="text-[10px] text-white font-medium text-center">{hobbyPhoto.type}</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ADDITIONAL PHOTOS - If any */}
          {additionalPhotos.length > 0 && (
            <div className="shrink-0">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Additional Photos ({additionalPhotos.length})
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {additionalPhotos.map((photo, i) => (
                  <button
                    key={i + 5}
                    onClick={() => setSelectedPhotoIndex(i + 5)}
                    className="aspect-3/4 rounded-md overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all group relative bg-[#111]"
                  >
                    <img 
                      src={photo.url} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                      alt={`${model.name} - ${photo.type || `Photo ${i + 6}`}`}
                    />
                    {photo.type && (
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-1.5">
                          <p className="text-[9px] text-white font-medium truncate">{photo.type}</p>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INFO SECTIONS - Compact */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {/* Measurements */}
            <div className="bg-[#111] rounded-lg p-3 border border-white/10">
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Ruler size={12} />
                Measurements
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-gray-500 text-[10px] mb-0.5">Bust</div>
                  <div className="text-white font-semibold text-sm">{model.measurements?.bust || "—"} cm</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] mb-0.5">Waist</div>
                  <div className="text-white font-semibold text-sm">{model.measurements?.waist || "—"} cm</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] mb-0.5">Hips</div>
                  <div className="text-white font-semibold text-sm">{model.measurements?.hips || "—"} cm</div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] mb-0.5">Shoe</div>
                  <div className="text-white font-semibold text-sm">39 EU</div>
                </div>
              </div>
            </div>

            {/* Bio & Motivation */}
            <div className="bg-[#111] rounded-lg p-3 border border-white/10">
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info size={12} />
                Bio & Motivation
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed line-clamp-4">
                {model.motivation || "No motivation provided yet."}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex-none p-4 border-t border-white/10 bg-[#0A0A0A] flex gap-3">
        <button
          onClick={handleToggleFavorite}
          disabled={isTogglingFavorite}
          className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 shrink-0 ${
            isFavorite
              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
          }`}
        >
          <Heart size={16} className={isFavorite ? "fill-yellow-400" : ""} />
          {isFavorite ? "Favorited" : "Favorite"}
        </button>

        {model.status !== "contacted" ? (
          <button
            onClick={handleContactClick}
            disabled={isContacting}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isContacting ? (
              <span className="animate-pulse">Contacting...</span>
            ) : (
              <>
                <MessageCircle size={16} />
                Contact Model
              </>
            )}
          </button>
        ) : (
          <button disabled className="flex-1 bg-white/5 text-gray-500 rounded-lg font-semibold text-sm border border-white/10 cursor-not-allowed">
            Already Contacted
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 shrink-0 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <span className="animate-pulse">Deleting...</span>
          ) : (
            <>
              <Trash2 size={16} />
              Reject
            </>
          )}
        </button>
      </div>

      {/* FULLSCREEN LIGHTBOX - Rendered via Portal to ensure it's above everything */}
      {selectedPhotoIndex !== null && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black flex items-center justify-center"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 999999,
            width: '100vw',
            height: '100vh'
          }}
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {/* Top Bar with Back to Profile and Close */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-linear-to-b from-black/90 to-transparent">
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
              aria-label="Back to Profile"
            >
              <ArrowLeft size={20} className="text-white" />
              <span className="text-white text-sm font-medium">Back to Profile</span>
            </button>
            
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
              aria-label="Close"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); navigatePhoto("prev"); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10 backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft size={32} className="text-white" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); navigatePhoto("next"); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10 backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight size={32} className="text-white" />
          </button>

          {/* Main Image - Full viewport with safe padding */}
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ padding: '80px 100px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={allPhotos[selectedPhotoIndex].url}
              alt={`${model.name} - ${allPhotos[selectedPhotoIndex].type || `Photo ${selectedPhotoIndex + 1}`}`}
              className="max-w-full max-h-full object-contain"
              style={{ maxWidth: 'calc(100vw - 200px)', maxHeight: 'calc(100vh - 160px)' }}
            />
          </div>

          {/* Bottom Info Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center p-4 bg-linear-to-t from-black/90 to-transparent">
            <div className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg text-sm text-white">
              <span className="font-medium">{selectedPhotoIndex + 1} / {allPhotos.length}</span>
              {allPhotos[selectedPhotoIndex].type && (
                <span className="ml-3 text-gray-300">• {allPhotos[selectedPhotoIndex].type}</span>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
