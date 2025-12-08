
"use client";

import { motion } from "framer-motion";
import { fadeUp } from "./Shared";
import { ShieldAlert, Bot, LayoutDashboard, Clock, Zap, Target } from "lucide-react";

export default function ValueProposition() {
    return (
        <motion.section
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="space-y-12"
        >
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
                    Built for <span className="text-slate-400">High-Volume</span> Scouting
                </h2>
                <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                    Stop manually filtering thousands of DMs. Our AI infrastructure handles the intake so you can focus on signing talent.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)] text-left">
                {/* Card 1: Large Span */}
                <div className="md:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-purple-500/20 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-white/10 transition-colors">
                            <Bot className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Intake</h3>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                            Every application is analyzed instantly. The AI sorts models by potential, flags red flags, and organizes everything before you even log in.
                        </p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors relative overflow-hidden group">
                    <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-white/10 transition-colors">
                        <ShieldAlert className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Stop Drowning in DMs</h3>
                    <p className="text-slate-400">
                        Centralize applications from Instagram, Email, and TikTok into one clean dashboard.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors relative overflow-hidden group">
                    <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-white/10 transition-colors">
                        <LayoutDashboard className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Unified Pipeline</h3>
                    <p className="text-slate-400">
                        Your entire team sees the same clear view. No version control issues, no lost files.
                    </p>
                </div>

                {/* Card 4: Large Span */}
                <div className="md:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 group-hover:bg-blue-500/20 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-white/10 transition-colors">
                            <Clock className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Save 15+ Hours Per Week</h3>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                            Eliminate the "admin work" of scouting. Focus purely on decision making and signing the next big talent.
                        </p>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
