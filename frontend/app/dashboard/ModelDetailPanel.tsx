"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function ModelDetailPanel({
  model,
  onClose,
}: {
  model: any;
  onClose: () => void;
}) {
  if (!model) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-slate-950 border-l border-slate-800 z-50 flex flex-col"
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold">{model.name}</h2>
            <p className="text-[11px] text-slate-500">
              {model.age} · {model.city}, {model.country}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-[20px]"
          >
            ✖
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          {/* Photos */}
          <section>
            <h3 className="text-[12px] text-slate-400 mb-2">Photos</h3>
            <div className="grid grid-cols-2 gap-3">
              {(model.photos ?? []).map((url: string, i: number) => (
                <div
                  key={i}
                  className="relative h-32 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden"
                >
                  <Image src={url} alt="" fill className="object-cover" />
                </div>
              ))}

              {(!model.photos || model.photos.length === 0) && (
                <p className="text-[11px] text-slate-600 col-span-2">
                  No photos available.
                </p>
              )}
            </div>
          </section>

          {/* AI Score */}
          <section>
            <h3 className="text-[13px] font-semibold">AI Score</h3>
            <div className="mt-2 p-3 border border-slate-800 rounded-lg bg-slate-900">
              <p className="text-[28px] font-bold text-sky-300">{model.score}</p>
              <p className="text-[11px] text-slate-400">Analyzed for agency fit.</p>
            </div>
          </section>

          {/* Motivation */}
          {model.motivation && (
            <section>
              <h3 className="text-[13px] font-semibold">Motivation</h3>
              <p className="text-[12px] text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap">
                {model.motivation}
              </p>
            </section>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
