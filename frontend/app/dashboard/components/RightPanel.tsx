"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "../context/WorkspaceContext";

export default function RightPanel() {
  const { showRightPanel, setShowRightPanel } = useWorkspace();

  return (
    <AnimatePresence>
      {showRightPanel && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-96 border-l border-white/10 bg-[#0A0A0A] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Profile</h2>
              <button
                onClick={() => setShowRightPanel(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Profile content will go here */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

