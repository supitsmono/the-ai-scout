"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatusBadge from "@/components/ui/StatusBadge";
import type { DashboardModel } from "./page";

type PhotoObj = {
  url: string;
  type?: string;
};

type Props = {
  model: DashboardModel | null;
  onClose: () => void;
  onContact?: (modelId: number, chatId?: number) => void;
  onFavoriteToggle?: () => void;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ModelDetailPanel({
  model,
  onClose,
  onContact,
  onFavoriteToggle,
}: Props) {
  if (!model) return null;

  const photos: PhotoObj[] =
    model.photos?.map((p: any) =>
      typeof p === "string" ? { url: p, type: "" } : p
    ) ?? [];

  const [photoIndex, setPhotoIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [isContacting, setIsContacting] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [showFavoriteSuccess, setShowFavoriteSuccess] = useState(false);
  const [wasFavorite, setWasFavorite] = useState(model.status === "favorite");

  // Update wasFavorite when model changes
  useEffect(() => {
    setWasFavorite(model.status === "favorite");
  }, [model.status]);

  const nextPhoto = () =>
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  const prevPhoto = () =>
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);

  const handleContactClick = async () => {
    if (!model || isContacting) return;
    setIsContacting(true);

    try {
      const res = await fetch(
        `${API_BASE}/models/${model.id}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Something went wrong contacting this model.";
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorMessage;
        } catch {
          // If error is not JSON, use the text or default message
          if (res.status === 404) {
            errorMessage = "Model not found in database. Please refresh the page.";
          } else if (res.status === 400) {
            errorMessage = errorText || "This model has already been contacted.";
          }
        }
        
        console.error("Contact error:", res.status, errorText);
        alert(errorMessage);
        return;
      }

      const data = await res.json();
      
      // Handle both response formats:
      // 1. { model: ..., chat_id: number } from models.py
      // 2. { message, model_id, chat_id, status } from status.py
      const chatId = data.chat_id as number | undefined;

      if (onContact) {
        onContact(model.id, chatId);
        // Don't close - let the parent handle navigation to chat
        return;
      }
      
      // Fallback: close the panel if no onContact handler
      onClose();
    } catch (err) {
      console.error("Network error:", err);
      const errorMessage = err instanceof Error 
        ? `Network error: ${err.message}. Make sure the backend is running on ${API_BASE}`
        : "Network error while contacting this model. Please check if the backend is running.";
      alert(errorMessage);
    } finally {
      setIsContacting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!model || isTogglingFavorite) return;
    setIsTogglingFavorite(true);
    setWasFavorite(model.status === "favorite");

    try {
      const res = await fetch(`${API_BASE}/models/${model.id}/favorite`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to toggle favorite");
      }

      const data = await res.json();
      
      // Show success animation
      setShowFavoriteSuccess(true);
      setTimeout(() => setShowFavoriteSuccess(false), 2000);
      
      // Update local state and notify parent
      if (onFavoriteToggle) {
        // Small delay to show animation before updating
        setTimeout(() => {
          onFavoriteToggle();
        }, 300);
      } else {
        // Fallback: reload page
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("Failed to update favorite status.");
    } finally {
      setTimeout(() => {
        setIsTogglingFavorite(false);
      }, 300);
    }
  };

  const isFavorite = model.status === "favorite";

  return (
    <>
      <div className="w-full bg-[#050505] rounded-2xl border border-white/10 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-semibold text-white">{model.name}</h2>

            <p className="text-gray-400 text-sm">
              {model.age} y/o • {model.height} cm • {model.country}
            </p>

            <div className="mt-2">
              <StatusBadge status={model.status} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm"
          >
            Close ✕
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="px-6 py-6 space-y-6">
          {/* PHOTO VIEWER */}
          <div className="relative w-full h-[360px] rounded-xl overflow-hidden bg-black">
            <img
              src={photos[photoIndex].url}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setFullscreenIndex(photoIndex)}
            />

            {photos[photoIndex].type && (
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                {photos[photoIndex].type}
              </div>
            )}
            
            {photos.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                {photoIndex + 1} / {photos.length}
              </div>
            )}

            <button
              onClick={prevPhoto}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-full text-lg"
            >
              ‹
            </button>

            <button
              onClick={nextPhoto}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-full text-lg"
            >
              ›
            </button>
          </div>

          {/* THUMBNAILS */}
          {photos.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {photos.map((p, i) => (
                <div
                  key={i}
                  className={`relative w-20 h-24 rounded-lg overflow-hidden cursor-pointer border shrink-0 ${
                    i === photoIndex
                      ? "border-purple-500 shadow-lg shadow-purple-500/30"
                      : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                  }`}
                  onClick={() => setPhotoIndex(i)}
                >
                  <img src={p.url} className="w-full h-full object-cover" />
                  {p.type && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 text-center truncate">
                      {p.type}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* AI CLASSIFICATION */}
          {model.aiCategory && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span>🤖</span> AI Classification
              </h3>
              <div className="mb-3">
                <StatusBadge status={model.aiCategory} />
              </div>
              {model.aiReasons && model.aiReasons.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Why this classification:</p>
                  <ul className="space-y-1">
                    {model.aiReasons.map((reason: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* MEASUREMENTS + MOTIVATION */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">
                Measurements
              </h3>
              <p className="text-gray-300 text-sm">
                Bust: {model.measurements?.bust} cm
              </p>
              <p className="text-gray-300 text-sm">
                Waist: {model.measurements?.waist} cm
              </p>
              <p className="text-gray-300 text-sm">
                Hips: {model.measurements?.hips} cm
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-2">
                Motivation
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {model.motivation}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 relative">
            {/* FAVORITE BUTTON */}
            <motion.button
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
              className={`flex-1 py-4 rounded-xl font-semibold text-base relative overflow-hidden ${
                isFavorite || showFavoriteSuccess
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-white/10 hover:bg-white/20 text-gray-300"
              } disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300`}
              whileTap={{ scale: 0.98 }}
              animate={
                showFavoriteSuccess
                  ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0px rgba(124, 58, 237, 0)",
                        "0 0 20px rgba(124, 58, 237, 0.6)",
                        "0 0 0px rgba(124, 58, 237, 0)",
                      ],
                    }
                  : {}
              }
              transition={{
                scale: { duration: 0.3 },
                boxShadow: { duration: 0.5 },
              }}
            >
              {/* Success overlay */}
              {showFavoriteSuccess && (
                <motion.div
                  className="absolute inset-0 bg-purple-600 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      />
                    </motion.svg>
                    <motion.span
                      className="text-white font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {wasFavorite ? "Removed" : "Added to Favorites!"}
                    </motion.span>
                  </motion.div>
                </motion.div>
              )}

              {/* Button content */}
              <motion.div
                className="flex items-center justify-center gap-2"
                animate={
                  showFavoriteSuccess
                    ? { opacity: 0 }
                    : isTogglingFavorite
                    ? { opacity: 0.7 }
                    : { opacity: 1 }
                }
                transition={{ duration: 0.2 }}
              >
                {isTogglingFavorite ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span>Updating...</span>
                  </>
                ) : isFavorite ? (
                  <>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      ⭐
                    </motion.span>
                    <span>Favorited</span>
                  </>
                ) : (
                  <>
                    <span>☆</span>
                    <span>Add to Favorites</span>
                  </>
                )}
              </motion.div>
            </motion.button>

            {/* CONTACT BUTTON */}
            {model.status !== "contacted" && (
              <button
                onClick={handleContactClick}
                disabled={isContacting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-base"
              >
                {isContacting ? "Contacting..." : "🟣 Contact"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
