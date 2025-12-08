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
        title: "Fast Search",
        description: "Search through thousands of applications in seconds. Filter by country, age, height, and more.",
        icon: <Zap className="w-6 h-6 text-amber-400" />,
        colSpan: "lg:col-span-2",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20"
    },
    {
        title: "Access Anywhere",
        description: "Works on your computer, tablet, and phone. Access your applications anytime, anywhere.",
        icon: <Globe2 className="w-6 h-6 text-blue-400" />,
        colSpan: "lg:col-span-1",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        title: "Team Collaboration",
        description: "Share favorites with your team. Everyone sees the same overview.",
        icon: <Users className="w-6 h-6 text-purple-400" />,
        colSpan: "lg:col-span-1",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        title: "Insights & Analytics",
        description: "See how many applications you receive, which countries apply most, and track your workflow.",
        icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
        colSpan: "lg:col-span-2",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
];

export default function Features() {
    return (
        <section id="features" className="py-32 bg-[#050505] relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="max-w-3xl mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
                        Built for <span className="text-slate-500">Model Agencies</span>
                    </h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Simple, fast, and clear. Whether you get 10 or 10,000 applications, 
                        AI helps you find the best models without the hassle.
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
                            <h3 className="text-2xl font-bold text-white mb-3">Automatic Sorting</h3>
                            <p className="text-slate-300 max-w-sm">
                                AI automatically sorts every application into: Perfect Fit, Good Fit, or Low Potential. 
                                You just need to choose.
                            </p>
                        </div>
                    </div>

                    {/* Tall Feature Block */}
                    <div className="row-span-2 rounded-3xl bg-[#0A0A0A] border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-colors flex flex-col justify-end">
                        <div className="absolute inset-0 opacity-20 bg-purple-500/20" style={{ background: 'linear-gradient(to top, rgba(168,85,247,0.2) 0%, transparent 100%)' }} />
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
                            <h3 className="text-xl font-bold text-white mb-2">Simple Dashboard</h3>
                            <p className="text-sm text-slate-300">
                                Everything in one place. View applications, chat with models, and manage favorites 
                                without switching between apps.
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
