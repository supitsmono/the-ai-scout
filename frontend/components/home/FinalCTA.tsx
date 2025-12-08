
"use client";

import { motion } from "framer-motion";
import { fadeUp, CTA } from "./Shared";

export default function FinalCTA() {
    return (
        <motion.section
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="relative"
        >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden group hover:border-white/20 transition-colors">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                        Ready to streamline your scouting?
                    </h2>
                    <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                        Start your 7-day free trial. No credit card required. See how AI can transform your intake process.
                    </p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <CTA href="/signup" large>
                            Start free trial
                        </CTA>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
