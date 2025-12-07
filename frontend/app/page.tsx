"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SlidePanel from "@/components/home/SlidePanel";

type PanelKey = "how" | "agencies" | "pricing";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
};

export default function HomePage() {
  const [panel, setPanel] = useState<PanelKey | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = panel ? "hidden" : "auto";
  }, [panel]);

  // Close panel on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panel) {
        setPanel(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [panel]);

  return (
    <main className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden">
      {/* Ambient background gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.15),transparent_50%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.10),transparent_50%)]" />
      
      <Panels panel={panel} setPanel={setPanel} />
      
      <div className="mx-auto max-w-7xl w-full px-5 sm:px-8 md:px-12 py-8 md:py-16 flex flex-col gap-20 md:gap-28">
        <Navbar setPanel={setPanel} />
        <Hero setPanel={setPanel} />
        <ValueProposition />
        <HowItWorks setPanel={setPanel} />
        <AIClassificationShowcase />
        <DashboardPreview />
        <PricingSection setPanel={setPanel} />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}

/* ---------------- SLIDE PANELS ---------------- */

function Panels({
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

/* ---------------- NAVBAR ---------------- */

function Navbar({ setPanel }: { setPanel: (v: PanelKey | null) => void }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <motion.div
          className="bg-purple-600/20 border border-purple-500/30 rounded-xl h-9 w-9 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <span className="text-xs font-bold text-purple-300">AI</span>
        </motion.div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight">The AI Scout</p>
          <p className="text-[10px] text-slate-400">Intake OS for agencies</p>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-xs text-slate-300">
        <NavButton onClick={() => setPanel("how")}>How it works</NavButton>
        <NavButton onClick={() => setPanel("agencies")}>For agencies</NavButton>
        <NavButton onClick={() => setPanel("pricing")}>Pricing</NavButton>
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hidden md:inline text-xs text-slate-300 hover:text-white transition-colors"
        >
          Log in
        </Link>
        <CTA href="/signup">Start free trial</CTA>
      </div>
    </motion.header>
  );
}

function NavButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
    </button>
  );
}

/* ---------------- HERO ---------------- */

function Hero({ setPanel }: { setPanel: (v: PanelKey | null) => void }) {
  return (
    <section className="grid gap-16 md:grid-cols-2 md:items-center mt-8 md:mt-12">
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col gap-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Badge text="AI-powered model scouting for agencies" />
        </motion.div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl leading-[1.1] font-bold">
          Stop drowning in{" "}
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            messy applications
          </span>
          . Start scouting with AI.
        </h1>

        <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
          One apply link. AI automatically sorts every model into Perfect Fit, Good Fit, or Low Potential.
          Your team reviews organized candidates, not chaos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <CTA href="/signup" large>
              Start 7-day free trial
            </CTA>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <SecondaryCTAButton onClick={() => setPanel("how")}>
              See how it works
            </SecondaryCTAButton>
          </motion.div>
        </div>

        <p className="text-xs text-slate-500">
          No credit card required · Cancel anytime · €449/month after trial
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative"
      >
        <motion.div
          className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <HeroDashboardPreview />
        </motion.div>
      </motion.div>
    </section>
  );
}

function HeroDashboardPreview() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="flex justify-between items-center mb-4 text-xs text-slate-400">
        <span>Dashboard · Live</span>
        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
          Active
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <MiniStat label="New" value="42" />
        <MiniStat label="Perfect Fit" value="18" />
        <MiniStat label="Avg. time" value="2m" />
      </div>

      <div className="flex flex-col gap-2.5">
        <FaceRow name="Sophia" tier="Perfect Fit" city="Amsterdam" />
        <FaceRow name="Emma" tier="Good Fit" city="Berlin" />
        <FaceRow name="Luca" tier="Low Potential" city="Paris" />
      </div>
    </motion.div>
  );
}

/* ---------------- VALUE PROPOSITION ---------------- */

function ValueProposition() {
  const benefits = [
    {
      icon: "🚫",
      title: "Stop drowning in DMs",
      desc: "No more scattered applications across Instagram, email, and WhatsApp.",
    },
    {
      icon: "🤖",
      title: "AI automatically sorts",
      desc: "Every application is analyzed and categorized instantly. Focus on decisions, not filtering.",
    },
    {
      icon: "📊",
      title: "One organized dashboard",
      desc: "Your entire team sees the same clear view. No confusion, no missed opportunities.",
    },
    {
      icon: "⏱️",
      title: "Save 10+ hours per week",
      desc: "Spend time on real decisions instead of managing chaos. One booked job covers the cost.",
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
          What your agency gets
        </h2>
        <p className="text-slate-400 text-lg">
          Everything you need to scout models efficiently, without the chaos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {benefits.map((benefit, idx) => (
          <motion.div
            key={benefit.title}
            {...fadeUp}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 hover:border-purple-500/30 transition-colors group"
          >
            <div className="text-3xl mb-3">{benefit.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
              {benefit.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ---------------- HOW IT WORKS ---------------- */

function HowItWorks({ setPanel }: { setPanel: (v: PanelKey | null) => void }) {
  const steps = [
    {
      number: "01",
      title: "Add your apply link",
      desc: "Drop your unique link in Instagram, TikTok, website, and campaigns. Every model lands in the same branded flow.",
    },
    {
      number: "02",
      title: "AI automatically categorizes",
      desc: "Models upload photos and details. AI analyzes everything and sorts each profile into Perfect Fit, Good Fit, or Low Potential.",
    },
    {
      number: "03",
      title: "Your team reviews & contacts",
      desc: "Save to favorites, reject, or contact models — all from one clear dashboard. No more switching between apps.",
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
          <h2 className="text-3xl sm:text-4xl font-bold">
            From link click to clear decisions
          </h2>
        </div>
        <SecondaryCTAButton small onClick={() => setPanel("how")}>
          Detailed view
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
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 h-full hover:border-purple-500/30 transition-colors">
              <div className="text-xs font-bold text-purple-400 bg-purple-500/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-slate-800" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ---------------- AI CLASSIFICATION SHOWCASE ---------------- */

function AIClassificationShowcase() {
  const categories = [
    {
      name: "Perfect Fit",
      color: "blue",
      desc: "Strong fit. Review these first.",
      icon: "⭐",
    },
    {
      name: "Good Fit",
      color: "green",
      desc: "Potential. Keep on your radar.",
      icon: "✓",
    },
    {
      name: "Low Potential",
      color: "orange",
      desc: "Visible, but lower priority.",
      icon: "○",
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
            className={`bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 hover:border-${cat.color}-500/30 transition-colors`}
          >
            <div className="text-3xl mb-3">{cat.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{cat.name}</h3>
            <p className="text-slate-400 text-sm">{cat.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ---------------- DASHBOARD PREVIEW ---------------- */

function DashboardPreview() {
  return (
    <motion.section
      {...fadeUp}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          See your organized intake dashboard
        </h2>
        <p className="text-slate-400 text-lg">
          One place for all your model applications. Clean, organized, and ready for your team.
        </p>
      </div>

      <motion.div
        className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex justify-between items-center mb-6 text-sm text-slate-400">
          <span>Dashboard Preview</span>
          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 text-xs">
            Live Demo
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-white">142</p>
          </div>
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
            <p className="text-xs text-blue-400 mb-1">Perfect Fit</p>
            <p className="text-2xl font-bold text-blue-300">38</p>
          </div>
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
            <p className="text-xs text-green-400 mb-1">Good Fit</p>
            <p className="text-2xl font-bold text-green-300">64</p>
          </div>
          <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
            <p className="text-xs text-orange-400 mb-1">Low Potential</p>
            <p className="text-2xl font-bold text-orange-300">40</p>
          </div>
        </div>

        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-700/50" />
                <div>
                  <p className="text-sm font-medium text-white">Model Name</p>
                  <p className="text-xs text-slate-400">Amsterdam · 21 y/o</p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Perfect Fit
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

/* ---------------- PRICING ---------------- */

function PricingSection({ setPanel }: { setPanel: (v: PanelKey | null) => void }) {
  return (
    <motion.section
      {...fadeUp}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
        <p className="text-slate-400 text-lg">
          One plan. Everything included. No surprises.
        </p>
      </div>

      <motion.div
        className="max-w-2xl mx-auto bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-8 md:p-12 shadow-2xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-white mb-2">
            €449<span className="text-2xl text-slate-400">/month</span>
          </div>
          <div className="text-lg text-purple-400 font-medium mb-4">
            Start with 7-day free trial
          </div>
          <p className="text-slate-400 text-sm">
            No credit card required · Cancel anytime
          </p>
        </div>

        <ul className="space-y-3 mb-8">
          {[
            "Unlimited applications",
            "AI automatic classification",
            "Team workspace",
            "Analytics dashboard",
            "Priority support",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-slate-300">
              <span className="text-purple-400">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <CTA href="/signup" large>
              Start 7-day free trial
            </CTA>
          </motion.div>
          <SecondaryCTAButton onClick={() => setPanel("pricing")}>
            View details
          </SecondaryCTAButton>
        </div>
      </motion.div>
    </motion.section>
  );
}

/* ---------------- FINAL CTA ---------------- */

function FinalCTA() {
  return (
    <motion.section
      {...fadeUp}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 border border-purple-500/30 rounded-3xl p-12 text-center relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to streamline your scouting?
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            Start your 7-day free trial. No credit card required. See how AI can transform your intake process.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CTA href="/signup" large>
              Start free trial
            </CTA>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <motion.footer
      {...fadeUp}
      transition={{ duration: 0.6 }}
      className="mt-16 py-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span>© {new Date().getFullYear()} The AI Scout.</span>
        <span className="hidden sm:inline-block h-3 w-[1px] bg-slate-700" />
        <span>AI-powered scouting OS for modeling agencies.</span>
      </div>

      <div className="flex gap-6 flex-wrap">
        <Link href="/privacy" className="hover:text-slate-300 transition-colors">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-slate-300 transition-colors">
          Terms
        </Link>
        <Link href="/contact" className="hover:text-slate-300 transition-colors">
          Contact
        </Link>
      </div>
    </motion.footer>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Badge({ text }: { text: string }) {
  return (
    <span className="text-xs px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 w-fit font-medium">
      {text}
    </span>
  );
}

function CTA({
  href,
  children,
  large,
}: {
  href: string;
  children: ReactNode;
  large?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full bg-white text-slate-900 font-semibold ${
        large ? "px-8 py-4 text-base" : "px-6 py-2.5 text-sm"
      } hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl inline-block text-center`}
    >
      {children}
    </Link>
  );
}

function SecondaryCTAButton({
  onClick,
  children,
  small,
}: {
  onClick: () => void;
  children: ReactNode;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border border-slate-700 bg-slate-900/50 text-slate-100 ${
        small ? "px-4 py-1.5 text-xs" : "px-6 py-2.5 text-sm"
      } hover:bg-slate-800 hover:border-slate-600 transition-colors font-medium`}
    >
      {children}
    </button>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
      <p className="text-[10px] text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function FaceRow({
  name,
  tier,
  city,
}: {
  name: string;
  tier: string;
  city: string;
}) {
  const tierColors: Record<string, string> = {
    "Perfect Fit": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "Good Fit": "bg-green-500/20 text-green-300 border-green-500/30",
    "Low Potential": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  };

  return (
    <div className="flex justify-between items-center bg-slate-800/30 border border-slate-700/30 px-4 py-3 rounded-lg">
      <div>
        <p className="text-xs font-medium text-white">{name}</p>
        <p className="text-[10px] text-slate-400">{city}</p>
      </div>
      <span
        className={`text-[10px] px-2.5 py-1 rounded-full border ${tierColors[tier] || "bg-slate-700/50 text-slate-300"}`}
      >
        {tier}
      </span>
    </div>
  );
}
