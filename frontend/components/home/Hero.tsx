
"use client";

import { motion } from "framer-motion";
import { PanelKey, fadeUp, Badge, CTA, SecondaryCTAButton } from "./Shared";
import HeroDashboard from "./HeroDashboard";

export default function Hero({ setPanel }: { setPanel: (v: PanelKey | null) => void }) {
    return (
        <section className="grid gap-16 md:grid-cols-2 md:items-center mt-8 md:mt-12">
            <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col gap-6"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge text="AI-powered model scouting for agencies" />
                </motion.div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl leading-[1.1] font-bold tracking-tight text-white">
                    Stop drowning in{" "}
                    <span className="text-slate-400">
                        messy applications
                    </span>
                    . Start scouting with AI.
                </h1>

                <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                    One apply link. AI automatically sorts every model into Perfect Fit, Good Fit, or Low Potential.
                    Your team reviews organized candidates, not chaos.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <CTA href="/signup" large>
                            Start 7-day free trial
                        </CTA>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <SecondaryCTAButton onClick={() => setPanel("how")}>
                            See how it works
                        </SecondaryCTAButton>
                    </motion.div>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                    No credit card required · Cancel anytime · €449/month after trial
                </p>
            </motion.div>

            <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
            >
                <motion.div
                    className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {/* Clean background - No blurs */}
                    <HeroDashboard />
                </motion.div>
            </motion.div>
        </section>
    );
}
