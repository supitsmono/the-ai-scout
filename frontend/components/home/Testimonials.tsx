"use client";

import React from "react";
import { Star } from "lucide-react";

const testimonials = [
    {
        quote: "We processed 5,000 applications in 3 hours. The AI sorting is incredibly accurate.",
        author: "Sarah Jenkins",
        role: "Head of Scouting, Elite Models",
        stars: 5,
    },
    {
        quote: "Finally, a system that actually understands what we're looking for. This changes everything.",
        author: "Marcus Chen",
        role: "Director, IMG Men",
        stars: 5,
    },
    {
        quote: "We save hours every week. Everything is organized in one clear place.",
        author: "Elena Rodriguez",
        role: "Senior Booker, Wilhelmina",
        stars: 5,
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Trusted by Model Agencies</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors relative group">
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.stars)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-cyan-500 fill-cyan-500/20" />
                                ))}
                            </div>
                            <p className="text-slate-300 text-lg leading-relaxed mb-6">"{t.quote}"</p>
                            <div>
                                <div className="text-white font-medium">{t.author}</div>
                                <div className="text-sm text-slate-500">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
