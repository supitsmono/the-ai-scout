
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
                    className="absolute inset-0 bg-purple-500/5"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.05) 0%, rgba(59,130,246,0.05) 50%, rgba(168,85,247,0.05) 100%)' }}
                />
                <div className="relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                        Ready to speed up your applications?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                        Start your free trial. No credit card required. 
                        See how AI helps you find the best models in a fraction of the time.
                    </p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <CTA href="/signup" large>
                            Start Free
                        </CTA>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
