
"use client";

import { motion } from "framer-motion";
import { PanelKey, fadeUp, SecondaryCTAButton } from "./Shared";

export default function HowItWorks({ setPanel }: { setPanel: (v: PanelKey | null) => void }) {
    const steps = [
        {
            number: "01",
            title: "Share your application link",
            desc: "Place your unique link on Instagram, TikTok, your website, or in campaigns. All models come into the same organized system.",
        },
        {
            number: "02",
            title: "AI sorts automatically",
            desc: "Models upload photos and details. AI analyzes everything and sorts each application into: Perfect Fit, Good Fit, or Low Potential.",
        },
        {
            number: "03",
            title: "You choose and contact",
            desc: "Review, save favorites, or chat directly with models. Everything on one clear dashboard. No more switching between apps.",
        },
    ];

    return (
        <motion.section
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2">
                        How it works
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">
                        From application to decision
                    </h2>
                </div>
                <SecondaryCTAButton small onClick={() => setPanel("how")}>
                    View details
                </SecondaryCTAButton>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {steps.map((step, idx) => (
                    <motion.div
                        key={step.number}
                        {...fadeUp}
                        transition={{ duration: 0.5, delay: idx * 0.15 }}
                        className="relative"
                    >
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 h-full hover:border-white/10 transition-colors">
                            <div className="text-xs font-bold text-white bg-white/10 w-10 h-10 rounded-full flex items-center justify-center mb-4 border border-white/5">
                                {step.number}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-white/10" />
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
