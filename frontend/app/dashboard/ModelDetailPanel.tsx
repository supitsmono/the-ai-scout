"use client";

import { useState } from "react";
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
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ModelDetailPanel({
  model,
  onClose,
  onContact,
}: Props) {
  if (!model) return null;

  const photos: PhotoObj[] =
    model.photos?.map((p: any) =>
      typeof p === "string" ? { url: p, type: "" } : p
    ) ?? [];

  const [photoIndex, setPhotoIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [isContacting, setIsContacting] = useState(false);

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
      }
      
      // Close the panel after successful contact
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
                    i === photoIndex
                      ? "border-purple-500"
                      : "border-white/10 opacity-70 hover:opacity-100"
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

          {/* CONTACT BUTTON */}
          <button
            onClick={handleContactClick}
            disabled={isContacting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-base"
          >
            {isContacting ? "Contacting..." : "🟣 Contact Model"}
          </button>
        </div>
      </motion.div>
    </>
  );
}
