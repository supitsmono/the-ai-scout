"use client";

import { motion } from "framer-motion";

export default function SlidePanel({ open, onClose, title, children }) {
  return (
    <>
      {/* BACKDROP */}
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* PANEL */}
      <motion.div
        className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-slate-950 border-l border-slate-800 z-[100] shadow-[0_0_40px_rgba(0,0,0,0.4)]"
        initial={{ x: "100%" }}
        animate={{ x: open ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm"
          >
            Close
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto text-sm text-slate-300">
          {children}
        </div>
      </motion.div>
    </>
  );
}
