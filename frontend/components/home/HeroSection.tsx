"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "@/components/home/HeroHeader";
import { ChevronRight } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

export default function HeroSection({ setPanel }: { setPanel?: (v: any) => void }) {
    return (
        <div className="relative bg-[#000000] min-h-screen overflow-hidden selection:bg-cyan-500/30">
            {/* Technical Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

            {/* Ambient Cyan Glow (Top Center) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Navbar */}
            <HeroHeader setPanel={setPanel} />

            <main className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32">
                <div className="container mx-auto px-6 lg:px-12 text-center">

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.05] max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
                        Find Perfect Models <br />
                        <span className="text-cyan-400">In Seconds</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        AI automatically sorts thousands of applications for you.
                        Find the best models instantly without hours of scrolling.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 px-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-base shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all"
                        >
                            <Link href="/signup">
                                Start Free
                                <ChevronRight className="ml-1 w-4 h-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-12 px-8 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white transition-all backdrop-blur-md"
                            onClick={() => setPanel?.("how")}
                        >
                            <button className="flex items-center gap-2">
                                <span className="font-semibold text-sm">View Demo</span>
                            </button>
                        </Button>
                    </div>

                    {/* Dashboard Preview Frame */}
                    <div className="mt-20 relative max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-300">
                        {/* Glow behind dashboard */}
                        <div className="absolute -inset-1 bg-cyan-500/20 rounded-4xl blur-2xl opacity-50" />

                        <div className="relative rounded-2xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
                            {/* Window Controls */}
                            <div className="h-10 bg-[#1A1D21] border-b border-white/5 flex items-center px-4 justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-700" />
                                    <div className="w-3 h-3 rounded-full bg-slate-700" />
                                    <div className="w-3 h-3 rounded-full bg-slate-700" />
                                </div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                                    AI Scout Dashboard
                                </div>
                            </div>

                            {/* The Actual Dashboard Component */}
                            <div className="relative aspect-video md:aspect-21/9 overflow-hidden">
                                <div className="absolute inset-0 scale-[0.85] origin-top">
                                    <DashboardPreview />
                                </div>
                                <div className="absolute inset-0 bg-black/60 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Trusted by Agencies */}
                    <div className="mt-24 pt-10 border-t border-white/5">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-8">Trusted by Model Agencies</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Agency Logos (Text for now) */}
                            <span className="text-xl font-bold text-white tracking-widest font-serif">ELITE</span>
                            <span className="text-xl font-bold text-white tracking-tight font-sans">IMG</span>
                            <span className="text-xl font-bold text-white tracking-widest font-serif">FORD</span>
                            <span className="text-xl font-bold text-white tracking-widest font-sans italic">NEXT</span>
                            <span className="text-xl font-bold text-white tracking-tight font-sans">WILHELMINA</span>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
