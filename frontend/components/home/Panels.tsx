
"use client";

import Link from "next/link";
import SlidePanel from "@/components/home/SlidePanel"; // Assuming this exists or I need to find where it is.
// Wait, in previous read of page.tsx, it imported from "@/components/home/SlidePanel".
import { PanelKey, CTA } from "./Shared";
import { ReactNode } from "react";

export default function Panels({
    panel,
    setPanel,
}: {
    panel: PanelKey | null;
    setPanel: (v: PanelKey | null) => void;
}) {
    return (
        <>
            <SlidePanel
                open={panel === "how"}
                onClose={() => setPanel(null)}
                title="How The AI Scout Works"
            >
                <div className="space-y-6">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        The AI Scout turns your Instagram, TikTok and website traffic into clean,
                        ranked model applications — without your team drowning in DMs and screenshots.
                    </p>

                    <div className="space-y-6">
                        <PanelStep
                            number="01"
                            title="One apply link in every bio"
                            text="Drop your unique link in Instagram, TikTok, website and campaigns. Every model lands in the same guided apply flow."
                        />
                        <PanelStep
                            number="02"
                            title="AI automatically categorizes"
                            text="Models upload photos and details. AI analyzes everything and sorts each profile into Perfect Fit, Good Fit, or Low Potential."
                        />
                        <PanelStep
                            number="03"
                            title="Your team reviews & contacts"
                            text="Your team sees one organized dashboard. Save to favorites, reject, or contact models — all from one place."
                        />
                    </div>
                </div>
            </SlidePanel>

            <SlidePanel
                open={panel === "agencies"}
                onClose={() => setPanel(null)}
                title="For Agencies"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Built for agencies that want more great faces in less time — without lowering the bar.
                    </p>

                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex items-start gap-3">
                            <span className="text-purple-400 mt-0.5">✓</span>
                            <span>One intake OS instead of DMs, email, WhatsApp and forms</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-purple-400 mt-0.5">✓</span>
                            <span>AI structures the chaos — your team keeps final say</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-purple-400 mt-0.5">✓</span>
                            <span>Save talent into lists per board or market</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-purple-400 mt-0.5">✓</span>
                            <span>Contact models in one click with full context</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-purple-400 mt-0.5">✓</span>
                            <span>See which channels bring high-quality applicants</span>
                        </li>
                    </ul>
                </div>
            </SlidePanel>

            <SlidePanel
                open={panel === "pricing"}
                onClose={() => setPanel(null)}
                title="Pricing"
            >
                <div className="space-y-6">
                    <div>
                        <div className="mb-4">
                            <div className="text-3xl font-bold text-white mb-1">€449<span className="text-lg text-slate-400">/month</span></div>
                            <div className="text-sm text-purple-400 font-medium">Start with 7-day free trial</div>
                        </div>

                        <p className="text-sm text-slate-400 mb-6">
                            One booked job a month easily covers the cost of The AI Scout.
                        </p>

                        <ul className="space-y-2.5 text-sm text-slate-300">
                            <li className="flex items-start gap-3">
                                <span className="text-purple-400 mt-0.5">✓</span>
                                <span>Unique apply link for all platforms</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-purple-400 mt-0.5">✓</span>
                                <span>Unlimited applications</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-purple-400 mt-0.5">✓</span>
                                <span>AI automatic classification (Perfect Fit, Good Fit, Low Potential)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-purple-400 mt-0.5">✓</span>
                                <span>Lists, notes, tags & team workspace</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-purple-400 mt-0.5">✓</span>
                                <span>Analytics for clicks, applies & tiers</span>
                            </li>
                        </ul>
                    </div>

                    <div className="h-px w-full bg-slate-800" />

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-100 mb-1 text-sm">Early adopter benefit</h4>
                        <p className="text-slate-400 text-xs">
                            The €449 launch rate will increase with new automation features.
                            Agencies joining now keep their pricing locked in.
                        </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <CTA href="/signup">Start 7-day free trial</CTA>
                    </div>
                </div>
            </SlidePanel>
        </>
    );
}

function PanelStep({
    number,
    title,
    text,
}: {
    number: string;
    title: string;
    text: string;
}) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                    {number}
                </span>
                <h4 className="font-semibold text-slate-100">{title}</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed ml-12">{text}</p>
        </div>
    );
}
