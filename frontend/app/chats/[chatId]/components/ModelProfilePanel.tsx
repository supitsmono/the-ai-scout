"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "@/components/ui/StatusBadge";

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
};

type Props = {
  model: ModelData | null;
  onClose: () => void;
};

export default function ModelProfilePanel({ model, onClose }: Props) {
  if (!model) return null;

  // Normalize photos - handle both string arrays and PhotoObj arrays
  const photos: PhotoObj[] =
    model.photos?.map((p: any) =>
      typeof p === "string" ? { url: p, type: "" } : p
    ) ?? [];

  // Use first photo as fallback if no photos array
  const defaultPhoto =
    photos.length > 0
      ? photos[0].url
      : "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";

  const [photoIndex, setPhotoIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const nextPhoto = () =>
    setPhotoIndex((prev) => (prev + 1) % Math.max(photos.length, 1));
  const prevPhoto = () =>
    setPhotoIndex((prev) => (prev - 1 + Math.max(photos.length, 1)) % Math.max(photos.length, 1));

  const displayHeight = model.height || model.height_cm;
  const displayStatus = model.status || "active";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 600 }}
        animate={{ x: 0 }}
        exit={{ x: 600 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed top-0 right-0 h-full w-[600px] bg-[#050505] border-l border-white/10 z-50 overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-[#050505] z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-sm">
          <div>
            <h2 className="text-2xl font-semibold text-white">{model.name}</h2>

            <p className="text-gray-400 text-sm mt-1">
              {model.age && `${model.age} y/o`}
              {displayHeight && ` • ${displayHeight} cm`}
              {model.country && ` • ${model.country}`}
            </p>

            <div className="mt-3">
              <StatusBadge status={displayStatus} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            aria-label="Close profile"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="px-6 py-6 space-y-6">
          {/* PHOTO VIEWER */}
          {photos.length > 0 ? (
            <>
              <div className="relative w-full h-[360px] rounded-2xl overflow-hidden bg-black/50 border border-white/10">
                <img
                  src={photos[photoIndex]?.url || defaultPhoto}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setFullscreenIndex(photoIndex)}
                  alt={`${model.name} - Photo ${photoIndex + 1}`}
                />

                {photos[photoIndex]?.type && (
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    {photos[photoIndex].type}
                  </div>
                )}

                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-full text-lg transition-all hover:scale-110"
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>

                    <button
                      onClick={nextPhoto}
                      className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-full text-lg transition-all hover:scale-110"
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                  </>
                )}

                {photos.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                    {photoIndex + 1} / {photos.length}
                  </div>
                )}
              </div>

              {/* THUMBNAILS */}
              {photos.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {photos.map((p, i) => (
                    <div
                      key={i}
                      className={`relative w-20 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                        i === photoIndex
                          ? "border-purple-500 shadow-lg shadow-purple-500/30"
                          : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                      }`}
                      onClick={() => setPhotoIndex(i)}
                    >
                      <img
                        src={p.url}
                        className="w-full h-full object-cover"
                        alt={`Thumbnail ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="relative w-full h-[360px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No photos available</p>
              </div>
            </div>
          )}

          {/* MEASUREMENTS + MOTIVATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {model.measurements && (
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Measurements
                </h3>
                <div className="space-y-2">
                  {model.measurements.bust && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Bust:</span>
                      <span className="text-white font-medium">
                        {model.measurements.bust} cm
                      </span>
                    </div>
                  )}
                  {model.measurements.waist && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Waist:</span>
                      <span className="text-white font-medium">
                        {model.measurements.waist} cm
                      </span>
                    </div>
                  )}
                  {model.measurements.hips && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Hips:</span>
                      <span className="text-white font-medium">
                        {model.measurements.hips} cm
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {model.motivation && (
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  Motivation
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {model.motivation}
                </p>
              </div>
            )}
          </div>

          {/* ADDITIONAL INFO */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Profile Information
            </h3>
            <div className="space-y-2 text-sm">
              {model.age && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Age:</span>
                  <span className="text-white font-medium">{model.age} years</span>
                </div>
              )}
              {displayHeight && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Height:</span>
                  <span className="text-white font-medium">{displayHeight} cm</span>
                </div>
              )}
              {model.country && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Country:</span>
                  <span className="text-white font-medium">{model.country}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FULLSCREEN MODAL */}
        <AnimatePresence>
          {fullscreenIndex !== null && photos.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
              onClick={() => setFullscreenIndex(null)}
            >
              <button
                onClick={() => setFullscreenIndex(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
                aria-label="Close fullscreen"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <img
                src={photos[fullscreenIndex]?.url}
                className="max-w-full max-h-full object-contain"
                alt={`${model.name} - Fullscreen`}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

