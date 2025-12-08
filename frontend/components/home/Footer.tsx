
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "./Shared";

export default function Footer() {
    return (
        <motion.footer
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="mt-16 py-8 border-t border-white/10 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
            <div className="flex items-center gap-3 flex-wrap">
                <span>© {new Date().getFullYear()} The AI Scout.</span>
                <span className="hidden sm:inline-block h-3 w-px bg-slate-700" />
                <span>AI-powered scouting OS for modeling agencies.</span>
            </div>

            <div className="flex gap-6 flex-wrap">
                <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                    Privacy
                </Link>
                <Link href="/terms" className="hover:text-slate-300 transition-colors">
                    Terms
                </Link>
                <Link href="/contact" className="hover:text-slate-300 transition-colors">
                    Contact
                </Link>
            </div>
        </motion.footer>
    );
}
