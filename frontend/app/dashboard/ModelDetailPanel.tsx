"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StatusBadge from "@/components/ui/StatusBadge";

type PhotoObj = {
  url: string;
  type?: string;
};

export default function ModelDetailPanel({ model, onClose }) {
  if (!model) return null;

  const photos: PhotoObj[] =
    model.photos?.map((p: any) =>
      typeof p === "string" ? { url: p, type: "" } : p
    ) ?? [];

  const [photoIndex, setPhotoIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const nextPhoto = () => setPhotoIndex((prev) => (prev + 1) % photos.length);
  const prevPhoto = () => setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <>
      <motion.div
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed top-0 right-0 h-full w-[600px] bg-[#050505] border-l border-white/10 z-40 overflow-y-auto"
      >
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

          <button onClick={onClose} className="text-gray-400 hover:text-white text-sm">
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
              <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                {photos[photoIndex].type}
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
            <div className="flex gap-3">
              {photos.map((p, i) => (
                <div
                  key={i}
                  className={`relative w-20 h-24 rounded-lg overflow-hidden cursor-pointer border ${
                    i === photoIndex ? "border-purple-500" : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setPhotoIndex(i)}
                >
                  <img src={p.url} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* MEASUREMENTS + MOTIVATION */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Measurements</h3>
              <p className="text-gray-300 text-sm">Bust: {model.measurements?.bust} cm</p>
              <p className="text-gray-300 text-sm">Waist: {model.measurements?.waist} cm</p>
              <p className="text-gray-300 text-sm">Hips: {model.measurements?.hips} cm</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Motivation</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{model.motivation}</p>
            </div>
          </div>

          {/* CONTACT BUTTON */}
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold text-base">
            🟣 Contact Model
          </button>
        </div>
      </motion.div>
    </>
  );
}
