"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface PhotoLightboxProps {
    images: { url: string; type?: string }[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function PhotoLightbox({ images, initialIndex, isOpen, onClose }: PhotoLightboxProps) {
    const [index, setIndex] = useState(initialIndex);
    const [scale, setScale] = useState(1);
    const constraintsRef = useRef(null);

    // Sync index if initialIndex changes when opening
    useEffect(() => {
        if (isOpen) {
            setIndex(initialIndex);
            setScale(1);
        }
    }, [isOpen, initialIndex]);

    const next = (e?: any) => {
        e?.stopPropagation();
        if (index < images.length - 1) {
            setIndex(index + 1);
            setScale(1);
        } else {
            setIndex(0); // Optional: Loop
            setScale(1);
        }
    };

    const prev = (e?: any) => {
        e?.stopPropagation();
        if (index > 0) {
            setIndex(index - 1);
            setScale(1);
        } else {
            setIndex(images.length - 1);
            setScale(1);
        }
    };

    const handleZoomIn = (e: any) => {
        e.stopPropagation();
        setScale((s) => Math.min(s + 0.5, 4));
    };

    const handleZoomOut = (e: any) => {
        e.stopPropagation();
        setScale((s) => Math.max(s - 0.5, 1));
    };

    // Keyboard support
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, index]); // Dep on index for next/prev closure context if needed, mostly fine

    return (
        <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
            onClick={onClose}
        >
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10 pointer-events-auto">
                    {index + 1} / {images.length}
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                    <button onClick={handleZoomOut} className="p-3 bg-white/5 hover:bg-white/20 text-white rounded-full border border-white/10 transition-colors backdrop-blur-md">
                        <ZoomOut size={20} />
                    </button>
                    <button onClick={handleZoomIn} className="p-3 bg-white/5 hover:bg-white/20 text-white rounded-full border border-white/10 transition-colors backdrop-blur-md">
                        <ZoomIn size={20} />
                    </button>
                    <div className="w-px h-8 bg-white/10 mx-2" />
                    <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-md">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Main Image Stage */}
            <div
                className="w-full h-full flex items-center justify-center p-4 relative"
                ref={constraintsRef}
            >
                {/* Navigation Arrows */}
                <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-40 pointer-events-auto">
                    <ChevronLeft size={48} />
                </button>
                <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-40 pointer-events-auto">
                    <ChevronRight size={48} />
                </button>

                {/* Draggable/Zoomable Image */}
                <motion.div
                    className="relative flex items-center justify-center"
                    drag={scale > 1} // Only drag when zoomed
                    dragElastic={0.2}
                    dragMomentum={false} // Precise control without sliding away
                    onClick={(e) => e.stopPropagation()}
                    animate={{ scale: scale }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ cursor: scale > 1 ? "grab" : "default" }}
                    whileTap={{ cursor: scale > 1 ? "grabbing" : "default" }}
                >
                    <motion.img
                        key={images[index].url}
                        src={images[index].url}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-[95vw] max-h-[95vh] object-contain rounded-sm shadow-2xl user-select-none"
                        draggable={false}
                    />
                </motion.div>

                {/* Caption / Type */}
                {images[index].type && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 pointer-events-none"
                    >
                        <span className="text-white font-medium">{images[index].type}</span>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
