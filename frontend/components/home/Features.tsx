"use client";

import React from "react";
import {
    Zap,
    ShieldCheck,
    BarChart3,
    Globe2,
    Users,
    Workflow
} from "lucide-react";

const features = [
    {
        title: "Real-time Filtering",
        description: "Filter 10k+ applicants in milliseconds using metadata and AI tags.",
        icon: <Zap className="w-6 h-6 text-amber-400" />,
        colSpan: "lg:col-span-2",
        bg: "bg-gradient-to-br from-amber-500/10 to-transparent",
        border: "border-amber-500/20"
    },
    {
        title: "Global CDN",
        description: "Profiles served from edge locations worldwide for instant loading.",
        icon: <Globe2 className="w-6 h-6 text-blue-400" />,
        colSpan: "lg:col-span-1",
        bg: "bg-gradient-to-br from-blue-500/10 to-transparent",
        border: "border-blue-500/20"
    },
    {
        title: "Team Workflows",
        description: "Collaborate on shortlists with role-based access control.",
        icon: <Users className="w-6 h-6 text-purple-400" />,
        colSpan: "lg:col-span-1",
        bg: "bg-gradient-to-br from-purple-500/10 to-transparent",
        border: "border-purple-500/20"
    },
    {
        title: "Analytics Engine",
        description: "Track scout performance, application rates, and conversion metrics.",
        icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
        colSpan: "lg:col-span-2",
        bg: "bg-gradient-to-br from-emerald-500/10 to-transparent",
        border: "border-emerald-500/20"
    },
];

export default function Features() {
    return (
        <section id="features" className="py-32 bg-[#050505] relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="max-w-3xl mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
                        Built for <span className="text-slate-500">Scale</span>
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Traditional agency software wasn't built for the AI era.
                        We re-architected the scouting stack to handle high-velocity recruiting.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Large Feature Block 1 */}
                    <div className="lg:col-span-2 rounded-3xl bg-[#0A0A0A] border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-colors">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
                            <Workflow size={120} className="text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-400">
                                <Workflow />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Automated Pipelines</h3>
                            <p className="text-slate-400 max-w-sm">
                                Define custom stages for your recruitment funnel.
                                Let AI automatically move candidates based on match scores.
                            </p>
                        </div>
                    </div>

                    {/* Tall Feature Block */}
                    <div className="row-span-2 rounded-3xl bg-[#0A0A0A] border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-colors flex flex-col justify-end">
                        <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-purple-500/20 to-transparent" />
                        <div className="relative z-10 bg-[#111] rounded-xl border border-white/5 p-4 mb-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                            {/* Mock Code / Config */}
                            <div className="flex gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-3/4 bg-slate-800 rounded" />
                                <div className="h-2 w-1/2 bg-slate-800 rounded" />
                                <div className="h-2 w-full bg-slate-800 rounded" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white mb-2">API First</h3>
                            <p className="text-sm text-slate-400">
                                Connect your existing forms and databases directly via our REST API.
                            </p>
                        </div>
                    </div>

                    {/* Small Blocks */}
                    {features.map((f, i) => (
                        <div key={i} className={`rounded-3xl bg-[#0A0A0A] border border-white/5 p-6 hover:border-white/10 transition-colors ${f.colSpan || ''}`}>
                            <div className="flex items-start gap-4">
                                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${f.bg} ${f.border} border`}>
                                    {f.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">{f.title}</h3>
                                    <p className="text-sm text-slate-400">{f.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
