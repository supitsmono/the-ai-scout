"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import { BackToTop } from "@/components/ui/BackToTop";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

// Modal Content Placeholders (Agency Style)
const ModalAgencies = () => (
  <div className="p-8 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
    <h2 className="text-3xl font-bold mb-4">For Top Agencies</h2>
    <p className="text-lg text-slate-400 mb-8">
      Manage your entire roster with AI-powered tagging, automated casting sheets, and direct booking integrations.
    </p>
    <div className="grid grid-cols-2 gap-4 text-left">
      <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
        <h3 className="font-bold mb-2 text-white">Automated Discovery</h3>
        <p className="text-sm text-slate-400">Never miss a new face. Our AI scans thousands of submissions daily.</p>
      </div>
      <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
        <h3 className="font-bold mb-2 text-white">Smart Casting</h3>
        <p className="text-sm text-slate-400">Create client packages in seconds with perfect-match filtering.</p>
      </div>
    </div>
  </div>
);

const ModalFeatures = () => (
  <div className="p-8 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
    <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {["Vision AI", "Auto-Tagging", "Casting CRM", "Public Profiles", "Scouting Forms", "Analytics"].map((f) => (
        <div key={f} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="font-medium text-slate-200">{f}</span>
        </div>
      ))}
    </div>
    <p className="mt-8 text-slate-400">Everything you need to run a modern modeling agency.</p>
  </div>
);

const ModalPricing = () => (
  <div className="p-8 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
    <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
    <p className="text-slate-400 mb-8">Start free, scale as you grow.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left">
        <h3 className="text-xl font-bold text-white">Starter</h3>
        <div className="text-2xl font-bold text-white mt-2">$0</div>
        <p className="text-sm text-slate-400 mt-2">Perfect for boutique agencies.</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          <li>• 500 Applicants / mo</li>
          <li>• Basic Visual Search</li>
          <li>• 1 User Seat</li>
        </ul>
      </div>
      <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-cyan-500 text-black text-xs font-bold px-2 py-1">POPULAR</div>
        <h3 className="text-xl font-bold text-white">Pro</h3>
        <div className="text-2xl font-bold text-white mt-2">$299</div>
        <p className="text-sm text-slate-400 mt-2">For high-growth scouting.</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          <li>• Unlimited Applicants</li>
          <li>• Advanced AI Filters</li>
          <li>• 5 User Seats</li>
        </ul>
      </div>
    </div>
  </div>
);

const ModalDevelopers = () => (
  <div className="p-8 text-center max-w-3xl mx-auto animate-in zoom-in-95 duration-300">
    <h2 className="text-3xl font-bold mb-4">Developer API</h2>
    <div className="text-left bg-[#111] p-6 rounded-xl border border-white/10 font-mono text-sm text-slate-300 overflow-x-auto">
      <p className="text-slate-500 mb-2">// fetch top candidates</p>
      <p><span className="text-purple-400">const</span> response <span className="text-purple-400">=</span> <span className="text-blue-400">await</span> scout.candidates.<span className="text-yellow-400">list</span>({`{`}</p>
      <p className="pl-4">minHeight: <span className="text-green-400">175</span>,</p>
      <p className="pl-4">features: [<span className="text-green-400">"blue_eyes"</span>, <span className="text-green-400">"freckles"</span>]</p>
      <p>{`}`});</p>
    </div>
    <p className="mt-6 text-slate-400">
      Build custom intake flows or integrate our scoring engine into your existing dashboard.
    </p>
  </div>
);

export default function Home() {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-cyan-500/30 text-slate-200">
      {/* Nav & Hero */}
      <HeroSection setPanel={setActivePanel} />

      {/* Main Features Grid (LiveKit Style) */}
      <Features />

      {/* Social Proof */}
      <div id="works">
        <Testimonials />
      </div>

      {/* Support / FAQ */}
      <div id="pricing">
        <FAQ />
      </div>

      {/* Back To Top Utility */}
      <BackToTop />

      {/* Content Modals */}
      <Dialog open={!!activePanel} onOpenChange={() => setActivePanel(null)}>
        <DialogContent className="max-w-4xl bg-[#0A0A0A] border-white/10 text-slate-200 p-0 overflow-hidden shadow-2xl">
          <div className="relative max-h-[85vh] overflow-y-auto">
            {activePanel === "agencies" && <ModalAgencies />}
            {activePanel === "features" && <ModalFeatures />}
            {activePanel === "pricing" && <ModalPricing />}
            {activePanel === "developers" && <ModalDevelopers />}
            {activePanel === "how" && <ModalFeatures />} {/* Fallback or map 'how' to features */}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
