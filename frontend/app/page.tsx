"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SlidePanel from "@/components/home/SlidePanel";

type PanelKey = "how" | "agencies" | "pricing";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [panel, setPanel] = useState<PanelKey | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = panel ? "hidden" : "auto";
  }, [panel]);

  return (
    <main className="relative min-h-screen w-full bg-[#050816] text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(60,190,255,0.12),transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.10),transparent_55%)]" />
      <Panels panel={panel} setPanel={setPanel} />
      <div className="mx-auto max-w-6xl min-h-screen w-full px-5 sm:px-8 md:px-10 py-8 md:py-12 flex flex-col gap-14">
        <Navbar setPanel={setPanel} />
        <Hero setPanel={setPanel} />
        <WhyAgencies />
        <HowItWorks setPanel={setPanel} />
        <Tiers />
        <Analytics />
        <Benefits />
        <Guarantee />
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
      {/* HOW PANEL */}
      <SlidePanel
        open={panel === "how"}
        onClose={() => setPanel(null)}
        title="How The AI Scout Works"
      >
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          The AI Scout turns your Instagram, TikTok and website traffic into clean,
          ranked model applications — without your team drowning in DMs and screenshots.
        </p>

        <div className="space-y-5 text-sm">
          <PanelStep
            number="01"
            title="One apply link in every bio"
            text="Drop your unique link in Instagram, TikTok, website and campaigns. Every model lands in the same guided apply flow."
          />

          <PanelStep
            number="02"
            title="AI intake & instant potential scoring"
            text="Models upload photos and details. AI analyses everything and sorts each profile into Spotlight, Watchlist or Low Fit."
          />

          <PanelStep
            number="03"
            title="A calm, shared decision workspace"
            text="Your team sees one queue, one view, one truth. Save faces to lists, add notes and contact models from one place."
          />
        </div>
      </SlidePanel>

      {/* AGENCIES PANEL */}
      <SlidePanel
        open={panel === "agencies"}
        onClose={() => setPanel(null)}
        title="For Agencies"
      >
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          Built for agencies that want more great faces in less time — without lowering the bar.
        </p>

        <ul className="space-y-3 text-sm text-slate-300">
          <li>• One intake OS instead of DMs, email, WhatsApp and forms.</li>
          <li>• AI structures the chaos — your team keeps final say.</li>
          <li>• Save talent into lists per board or market.</li>
          <li>• Contact models in one click with full context.</li>
          <li>• See which channels bring high-quality applicants.</li>
        </ul>
      </SlidePanel>

      {/* PRICING PANEL */}
      <SlidePanel
        open={panel === "pricing"}
        onClose={() => setPanel(null)}
        title="Pricing"
      >
        <p className="text-sm text-slate-300 mb-4">
          One simple plan. No add-ons. Cancel anytime.
        </p>

        <div className="space-y-6 text-sm">
          <div>
            <h4 className="font-semibold text-slate-100 mb-1 text-base">
              Agency plan · €449 / month
            </h4>
            <p className="text-slate-400 text-[13px] mb-3">
              One booked job a month easily covers the cost of The AI Scout.
            </p>

            <ul className="space-y-1.5 text-slate-300">
              <li>• Unique apply link for all platforms</li>
              <li>• Unlimited applications</li>
              <li>• AI scoring (Spotlight / Watchlist / Low Fit)</li>
              <li>• Lists, notes, tags & team workspace</li>
              <li>• Analytics for clicks, applies & tiers</li>
            </ul>
          </div>

          <div className="h-px w-full bg-slate-800" />

          <div>
            <h4 className="font-semibold text-slate-100 mb-1 text-sm">
              Early adopters benefit
            </h4>
            <p className="text-slate-400 text-[13px]">
              The €449 launch rate will increase with new automation features.
              Agencies joining now keep their pricing locked in.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          <CTA href="/signup">Start free · lock in €449</CTA>
          <SecondaryCTALink href="/demo">Book a 15-min demo</SecondaryCTALink>
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
      <h4 className="font-semibold text-slate-100 mb-0.5">
        {number} · {title}
      </h4>
      <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

/* ---------------- NAVBAR ---------------- */

function Navbar({ setPanel }: { setPanel: (v: PanelKey | null) => void }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <motion.div
          className="bg-slate-900/70 border border-slate-800 rounded-xl h-8 w-8 flex items-center justify-center shadow-[0_0_22px_rgba(56,189,248,0.25)]"
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs font-semibold">AI</span>
        </motion.div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">The AI Scout</p>
          <p className="text-[11px] text-slate-400">Intake OS for agencies</p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300">
        <NavButton onClick={() => setPanel("how")}>How it works</NavButton>
        <NavButton onClick={() => setPanel("agencies")}>For agencies</NavButton>
        <NavButton onClick={() => setPanel("pricing")}>Pricing</NavButton>
        <Link href="#analytics" className="hover:text-white transition-colors">
          Analytics
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <Link href="/login" className="hidden md:inline text-xs text-slate-300 hover:text-white">
          Log in
        </Link>
        <CTA href="/signup">Start free</CTA>
      </div>
    </header>
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
    <button onClick={onClick} className="hover:text-white transition-colors">
      {children}
    </button>
  );
}

/* ---------------- HERO ---------------- */

function Hero({ setPanel }: { setPanel: (v: PanelKey | null) => void }) {
  return (
    <section className="grid gap-12 md:grid-cols-2 md:items-center mt-4">
      <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="flex flex-col gap-6">
        <Badge text="One link in your bio. A full intake OS behind it." />

        <h1 className="text-4xl sm:text-5xl leading-tight font-semibold">
          Stop drowning in{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
            messy model applications
          </span>
          . Start scouting with clarity.
        </h1>

        <p className="text-slate-300 text-[15px] leading-relaxed max-w-md">
          Agencies add one apply link to Instagram, TikTok and their website.
          Models apply once. AI scores potential. Your team sees a single ranked queue.
          <span className="block mt-2 text-slate-400">
            One booked job a month easily covers the cost of The AI Scout.
          </span>
        </p>

        <div className="flex gap-3 flex-wrap items-center">
          <CTA href="/signup">Start free · €449/mo after</CTA>
          <SecondaryCTAButton onClick={() => setPanel("how")}>
            See how it works
          </SecondaryCTAButton>
        </div>

        <p className="text-[11px] text-slate-500">
          No setup fee · Cancel anytime · Built for agencies with 1–10 bookers
        </p>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6 }}
        className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-[0_18px_42px_rgba(0,0,0,0.8)] relative"
      >
        <motion.div
          className="pointer-events-none absolute -top-10 right-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <HeroDashboardPreview />
      </motion.div>
    </section>
  );
}

function HeroDashboardPreview() {
  return (
    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 5, repeat: Infinity }}>
      <div className="flex justify-between text-[11px] mb-3 text-slate-400">
        <span>Today · Intake queue</span>
        <span className="bg-slate-900 border border-slate-700 rounded-full px-2 py-1">Live</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <MiniStat label="New" value="38" />
        <MiniStat label="Spotlight" value="12" />
        <MiniStat label="Avg. review" value="3m" />
      </div>

      <div className="flex flex-col gap-2.5">
        <FaceRow name="Amira" tier="Spotlight" city="Berlin" status="Shortlisted" />
        <FaceRow name="Noa" tier="Watchlist" city="Amsterdam" status="Reviewing" />
        <FaceRow name="Luca" tier="Low Fit" city="Paris" status="New" />
        <FaceRow name="Elena" tier="Spotlight" city="Milan" status="Shortlisted" />
      </div>
    </motion.div>
  );
}

/* ---------------- WHY AGENCIES ---------------- */

function WhyAgencies() {
  return (
    <motion.section {...fadeUp} transition={{ duration: 0.4 }} className="space-y-4 mt-4">
      <h2 className="text-xl sm:text-2xl font-semibold">
        Built for modern model agencies who want more signal, less noise.
      </h2>

      <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
        Your intake is currently spread across DMs, WhatsApp, email and forms.
        With The AI Scout, every model lands in one place with the same clean
        structure. Your team spends time on real decisions — not on filtering chaos.
      </p>
    </motion.section>
  );
}

/* ---------------- HOW IT WORKS SECTION ---------------- */

function HowItWorks({ setPanel }: { setPanel: (v: PanelKey | null) => void }) {
  return (
    <motion.section {...fadeUp} transition={{ duration: 0.4 }} className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="uppercase tracking-[0.18em] text-[11px] text-slate-400">
            How it works
          </p>
          <h2 className="text-xl font-semibold">From link click to clear decisions</h2>
        </div>
        <SecondaryCTAButton small onClick={() => setPanel("how")}>
          Detailed view
        </SecondaryCTAButton>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Step
          step="01"
          title="Drop your link everywhere"
          desc="Instagram bio, TikTok, site, casting calls — every click lands in the same branded apply flow."
        />
        <Step
          step="02"
          title="AI scores potential"
          desc="Models upload info + photos. AI sorts profiles into Spotlight, Watchlist or Low Fit."
        />
        <Step
          step="03"
          title="Your team decides"
          desc="Save to lists, reject, or contact — all from one clear dashboard."
        />
      </div>
    </motion.section>
  );
}

/* ---------------- TIERS ---------------- */

function Tiers() {
  return (
    <motion.section {...fadeUp} transition={{ duration: 0.4 }} className="mt-12">
      <h2 className="text-xl font-semibold mb-3">AI potential tiers that respect your eye</h2>

      <p className="text-slate-300 text-sm max-w-xl mb-6">
        The tiers don’t replace your taste — they simply highlight where to look first.
        Bookers get structure instead of a chaos feed.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Spotlight" desc="Strong fit. Review these first." />
        <Card title="Watchlist" desc="Potential. Keep on your radar." />
        <Card title="Low Fit" desc="Visible, but lower priority." />
      </div>
    </motion.section>
  );
}

/* ---------------- ANALYTICS ---------------- */

function Analytics() {
  return (
    <motion.section id="analytics" {...fadeUp} transition={{ duration: 0.4 }} className="mt-12">
      <p className="uppercase tracking-[0.18em] text-[11px] text-slate-400">Analytics</p>

      <h2 className="text-xl font-semibold mb-3">
        See exactly what your apply link delivers
      </h2>

      <p className="text-slate-300 text-sm max-w-xl mb-6">
        You see who clicks, who completes the apply flow and how many land in each tier.
        Perfect for optimising campaigns, castings and budget.
      </p>

      <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <MiniStat label="Clicks this week" value="1,240" />
          <MiniStat label="Completed applies" value="312" />
        </div>

        <div className="text-[11px] space-y-1.5">
          <AnalyticsRow label="Spotlight" value="27%" />
          <AnalyticsRow label="Watchlist" value="41%" />
          <AnalyticsRow label="Low Fit" value="32%" />
        </div>
      </div>
    </motion.section>
  );
}

function AnalyticsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-100">{value}</span>
    </div>
  );
}

/* ---------------- BENEFITS ---------------- */

function Benefits() {
  return (
    <motion.section {...fadeUp} transition={{ duration: 0.4 }} className="mt-12">
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="One intake, not ten" desc="DMs, email and forms flow into one queue." />
        <Card title="Consistent review" desc="Every model has the same clean structure." />
        <Card title="Clear next steps" desc="Shortlists and notes stay attached to the profile." />
      </div>
    </motion.section>
  );
}

/* ---------------- GUARANTEE ---------------- */

function Guarantee() {
  return (
    <motion.section {...fadeUp} transition={{ duration: 0.4 }} className="mt-12">
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 px-6 py-5 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-emerald-300 font-medium">
            If The AI Scout doesn’t save your team hours in the first month, it’s not worth keeping.
          </p>
          <p className="text-[12px] text-emerald-100/80 mt-1 max-w-xl">
            Start with a free trial. Cancel anytime. No contracts, no setup fee — just a cleaner intake from day one.
          </p>
        </div>
        <CTA href="/signup">Start free today</CTA>
      </div>
    </motion.section>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <footer className="mt-16 py-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-2">
        <span>© {new Date().getFullYear()} The AI Scout.</span>
        <span className="hidden h-3 w-[1px] bg-slate-700 sm:inline-block" />
        <span>AI-powered scouting OS for modelling agencies.</span>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
        <Link href="/terms" className="hover:text-slate-300">Terms</Link>
        <Link href="/contact" className="hover:text-slate-300">Contact</Link>
      </div>
    </footer>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Badge({ text }: { text: string }) {
  return (
    <span className="text-[11px] px-3 py-1 rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 w-fit">
      {text}
    </span>
  );
}

function CTA({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full bg-white text-slate-900 text-xs font-semibold px-5 py-2 hover:bg-slate-100 transition-colors shadow-sm"
    >
      {children}
    </Link>
  );
}

function SecondaryCTALink({
  href,
  children,
  small,
}: {
  href: string;
  children: ReactNode;
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border border-slate-700 bg-slate-900 text-slate-100 ${
        small ? "px-3 py-1.5 text-[11px]" : "px-5 py-2 text-xs"
      } hover:bg-slate-800 transition-colors`}
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
      className={`rounded-full border border-slate-700 bg-slate-900 text-slate-100 ${
        small ? "px-3 py-1.5 text-[11px]" : "px-5 py-2 text-xs"
      } hover:bg-slate-800 transition-colors`}
    >
      {children}
    </button>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-lg">
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-50">{value}</p>
    </div>
  );
}

function FaceRow({
  name,
  tier,
  city,
  status,
}: {
  name: string;
  tier: string;
  city: string;
  status: string;
}) {
  return (
    <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 px-3 py-2 rounded-lg">
      <div>
        <p className="text-[11px] font-medium text-slate-50">{name}</p>
        <p className="text-[10px] text-slate-400">
          {tier} · {city}
        </p>
      </div>
      <span className="text-[10px] px-2 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-200">
        {status}
      </span>
    </div>
  );
}

function Step({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
      <p className="text-[11px] text-slate-500 mb-1">{step}</p>
      <h3 className="text-sm font-semibold text-slate-50 mb-1">{title}</h3>
      <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
    </div>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 bg-slate-900/45 rounded-2xl border border-slate-800">
      <h3 className="text-sm font-semibold text-slate-50 mb-1">{title}</h3>
      <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
    </div>
  );
}
