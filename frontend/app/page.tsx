"use client";

import { useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/home/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DemoVideo from "@/components/home/DemoVideo";

// Modal Content Placeholders (Agency Style)
const ModalAgencies = () => (
  <div className="p-8 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
    <h2 className="text-3xl font-bold mb-4 text-white">For Model Agencies</h2>
    <p className="text-lg text-slate-300 mb-8">
      Manage all your applications with AI. Automatically sort thousands of submissions and find perfect models in seconds.
    </p>
    <div className="grid grid-cols-2 gap-4 text-left">
      <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
        <h3 className="font-bold mb-2 text-white">Automatic Sorting</h3>
        <p className="text-sm text-slate-400">AI analyzes every application and sorts models into: Perfect Fit, Good Fit, or Low Potential.</p>
      </div>
      <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
        <h3 className="font-bold mb-2 text-white">Quick Contact</h3>
        <p className="text-sm text-slate-400">Chat directly with models from your dashboard. Everything in one place.</p>
      </div>
      <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
        <h3 className="font-bold mb-2 text-white">Never Miss Opportunities</h3>
        <p className="text-sm text-slate-400">Thousands of applications? No problem. AI helps you find the best models.</p>
      </div>
      <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
        <h3 className="font-bold mb-2 text-white">Clear Overview</h3>
        <p className="text-sm text-slate-400">View all models, photos, and information on one clear dashboard.</p>
      </div>
    </div>
  </div>
);

const ModalFeatures = () => (
  <div className="p-8 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
    <h2 className="text-3xl font-bold mb-4 text-white">What You Get</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {["AI Sorting", "Fast Search", "Direct Chat", "Favorites", "Clear Dashboard", "Analytics"].map((f) => (
        <div key={f} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="font-medium text-slate-200">{f}</span>
        </div>
      ))}
    </div>
    <p className="mt-8 text-slate-300">Everything you need to run your model agency efficiently.</p>
  </div>
);

const ModalPricing = () => (
  <div className="p-8 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
    <h2 className="text-3xl font-bold mb-4 text-white">Simple Pricing</h2>
    <p className="text-lg text-slate-300 mb-8">
      Start your 7-day free trial. No credit card required.
    </p>
    
    {/* Pricing Card */}
    <div className="mb-6">
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-left relative">
        <div className="absolute top-0 right-0 bg-cyan-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">POPULAR</div>
        <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
        <div className="text-3xl font-bold text-white mb-2">$449<span className="text-lg text-slate-400">/month</span></div>
        <p className="text-sm text-slate-300 mb-4">Everything you need to scale your agency.</p>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span>
            <span>Unlimited applications</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span>
            <span>Advanced AI filters</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span>
            <span>Priority support</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span>
            <span>5 team members</span>
          </li>
        </ul>
      </div>
    </div>
    
    {/* Value Proposition - Compact */}
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left">
      <h3 className="font-bold mb-2 text-white">Why $449 is worth it</h3>
      <p className="text-sm text-slate-400 mb-3">
        One successful booking pays for months. Save 20+ hours per week, never miss perfect models, and scale without hiring.
      </p>
      <p className="text-sm text-slate-300">
        <span className="font-semibold text-white">Most agencies see 3-5x ROI</span> within the first month.
      </p>
    </div>
  </div>
);

const ModalDemo = () => {
  return (
    <div className="w-full h-full max-w-6xl mx-auto animate-in zoom-in-95 duration-300 flex flex-col">
      {/* Header - Compact */}
      <div className="flex-shrink-0 bg-[#0A0A0A] border-b border-white/10 p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5 sm:mb-1">See The AI Scout in Action</h2>
        <p className="text-[10px] sm:text-xs text-slate-400">
          Discover how our AI-powered dashboard helps agencies find perfect models in seconds
        </p>
      </div>

      {/* Animated Demo Video - Takes remaining space */}
      <div className="flex-1 min-h-0 p-2 sm:p-3 md:p-4">
        <DemoVideo />
      </div>

      {/* Features Highlight - Compact footer */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-white/5 border border-white/5 rounded-lg">
            <h3 className="font-semibold text-white mb-0.5 text-[10px] sm:text-xs">AI Pipeline</h3>
            <p className="text-[9px] sm:text-[10px] text-slate-400 leading-tight">
              Automatic sorting
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-white/5 border border-white/5 rounded-lg">
            <h3 className="font-semibold text-white mb-0.5 text-[10px] sm:text-xs">Smart Filtering</h3>
            <p className="text-[9px] sm:text-[10px] text-slate-400 leading-tight">
              Filter by criteria
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-white/5 border border-white/5 rounded-lg">
            <h3 className="font-semibold text-white mb-0.5 text-[10px] sm:text-xs">Direct Contact</h3>
            <p className="text-[9px] sm:text-[10px] text-slate-400 leading-tight">
              Chat with models
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


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

      {/* Footer */}
      <div className="container mx-auto px-6">
        <Footer />
      </div>

      {/* Back To Top Utility */}
      <BackToTop />

      {/* Content Modals */}
      <Dialog open={!!activePanel} onOpenChange={() => setActivePanel(null)}>
        <DialogContent className={`max-w-[95vw] w-full bg-[#0A0A0A] border-white/10 text-slate-200 p-0 overflow-hidden shadow-2xl m-2 sm:m-4 md:m-8 rounded-lg sm:rounded-xl ${
          activePanel === "how" 
            ? "h-[90vh] sm:h-[95vh] max-h-[90vh] sm:max-h-[95vh]" 
            : "max-h-[90vh] sm:max-h-[95vh]"
        }`}>
          <div className={`relative w-full h-full ${
            activePanel === "how" 
              ? "overflow-hidden" 
              : "overflow-y-auto max-h-[calc(90vh-1rem)] sm:max-h-[calc(95vh-2rem)]"
          }`}>
            {activePanel === "agencies" && <ModalAgencies />}
            {activePanel === "features" && <ModalFeatures />}
            {activePanel === "pricing" && <ModalPricing />}
            {activePanel === "how" && <ModalDemo />}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
