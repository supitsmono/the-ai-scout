
"use client";

import { motion } from "framer-motion";
import { fadeUp } from "./Shared";
import { Star, CheckCircle2, Circle } from "lucide-react";

export default function AIClassificationShowcase() {
    const categories = [
        {
            name: "Perfect Fit",
            color: "blue",
            desc: "Strong fit. Review these first.",
            icon: <Star className="w-6 h-6 text-blue-400 fill-blue-400/20" />,
            borderColor: "hover:border-blue-500/30",
        },
        {
            name: "Good Fit",
            color: "green",
            desc: "Potential. Keep on your radar.",
            icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
            borderColor: "hover:border-emerald-500/30",
        },
        {
            name: "Low Potential",
            color: "orange",
            desc: "Visible, but lower priority.",
            icon: <Circle className="w-6 h-6 text-orange-400" />,
            borderColor: "hover:border-orange-500/30",
        },
    ];

    return (
        <motion.section
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    AI automatically sorts every application
                </h2>
                <p className="text-slate-400 text-lg">
                    The AI analyzes photos, measurements, age, and more. Your team sees organized categories, not chaos.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={cat.name}
                        {...fadeUp}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className={`bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 transition-colors ${cat.borderColor}`}
                    >
                        <div className="mb-3 p-2 bg-white/5 rounded-lg w-fit border border-white/5">
                            {cat.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{cat.name}</h3>
                        <p className="text-slate-400 text-sm">{cat.desc}</p>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
