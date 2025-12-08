
"use client";

import { motion } from "framer-motion";
import { PanelKey, fadeUp, CTA, SecondaryCTAButton } from "./Shared";

export default function PricingSection({ setPanel }: { setPanel: (v: PanelKey | null) => void }) {
    return (
        <motion.section
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
                <p className="text-slate-400 text-lg">
                    One plan. Everything included. No surprises.
                </p>
            </div>

            <motion.div
                className="max-w-2xl mx-auto bg-[#0A0A0A] border-2 border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {/* Subtle highlight */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="text-center mb-8 relative z-10">
                    <div className="text-5xl font-bold text-white mb-2">
                        €449<span className="text-2xl text-slate-500">/month</span>
                    </div>
                    <div className="text-sm uppercase tracking-wider text-purple-400 font-bold mb-4">
                        7-Day Free Trial Included
                    </div>
                    <p className="text-slate-500 text-sm">
                        No credit card required · Cancel anytime
                    </p>
                </div>

                <ul className="space-y-3 mb-8 relative z-10">
                    {[
                        "Unlimited applications",
                        "AI automatic classification",
                        "Team workspace",
                        "Analytics dashboard",
                        "Priority support",
                    ].map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-slate-300 transform transition-transform duration-300 hover:translate-x-1">
                            <span className="text-purple-400">✓</span>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <CTA href="/signup" large>
                            Start 7-day free trial
                        </CTA>
                    </motion.div>
                    <SecondaryCTAButton onClick={() => setPanel("pricing")}>
                        View details
                    </SecondaryCTAButton>
                </div>
            </motion.div>
        </motion.section>
    );
}
