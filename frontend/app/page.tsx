"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ===============================
   CONSTANTS
================================ */

const LIVE_EVENTS = [
  "New model applied via campaign link.",
  "AI pre-ranked 9 profiles for Atelier Nova.",
  "3 models moved from Shortlisted → Contacted.",
  "High-potential profile flagged from TikTok.",
  "2 new scouts invited to the workspace.",
];

const PIPELINE_COLUMNS = ["Incoming", "Shortlisted", "Contacted", "Scouted", "Archived"];

/* ===============================
   ROOT
================================ */

export default function LandingPage() {
  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setEventIndex((prev) => (prev + 1) % LIVE_EVENTS.length),
      3600
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <BackgroundScene />
      <SiteHeader />
      <main className="flex-1">
        <HeroSection currentEvent={LIVE_EVENTS[eventIndex]} />
        <TrustStrip />
        <HowItWorks />
        <PipelineSection />
        <PersonasSection />
        <BottomCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ===============================
   BACKGROUND / GLOBAL CHROME
   (Ramp-style: zacht, subtiel)
================================ */

function BackgroundScene() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.65]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Soft top halo */}
      <motion.div
        style={{ y, opacity }}
        className="absolute -top-48 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.26),transparent_65%)] blur-3xl"
      />
      {/* Soft bottom halo */}
      <motion.div
        style={{ y }}
        className="absolute bottom-[-220px] left-1/2 h-[28rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.18),transparent_65%)] blur-3xl opacity-80"
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.85),_rgba(0,0,0,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent,_rgba(0,0,0,0.9))]" />
    </div>
  );
}

/* ===============================
   HEADER
================================ */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-900/70 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 3, 0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 28, ease: "easeInOut" }}
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-emerald-400 text-[11px] font-semibold shadow-[0_0_30px_rgba(79,70,229,0.6)]"
          >
            AI
          </motion.div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">The AI Scout</span>
            <span className="text-[11px] text-neutral-400">
              Operating system for scouting teams
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-7 text-[11px] text-neutral-400 md:flex">
          <a href="#how-it-works" className="hover:text-white transition">
            How it works
          </a>
          <a href="#pipeline" className="hover:text-white transition">
            Pipeline
          </a>
          <a href="#personas" className="hover:text-white transition">
            For whom
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full border border-neutral-700 px-3.5 py-1.5 text-[11px] text-neutral-300 hover:border-neutral-400 hover:text-white transition"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-medium text-black shadow-[0_0_24px_rgba(255,255,255,0.35)] transition hover:bg-neutral-200"
          >
            Enter dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ===============================
   HERO (Ramp-style: veel lucht)
================================ */

function HeroSection({ currentEvent }: { currentEvent: string }) {
  return (
    <section className="border-b border-neutral-900/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-14 lg:flex-row lg:items-center lg:gap-20 lg:pt-18">
        {/* Left: calm messaging */}
        <div className="flex flex-1 flex-col gap-7">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/70 px-3 py-1 text-[11px] text-neutral-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Centralize inbound. Calm down your scouting process.</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="text-[2.1rem] font-semibold tracking-tight sm:text-[2.6rem] lg:text-[3rem] lg:leading-[1.1]"
          >
            A calm{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
              operating system
            </span>{" "}
            for agencies that actually scout.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="max-w-xl text-[13px] leading-relaxed text-neutral-300"
          >
            The AI Scout is where every application lands, every model has a profile and your
            team sees the same pipeline. No more screenshots, scattered DMs or guessing who
            should be contacted next.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-2 text-[12px] font-medium text-black shadow-[0_0_26px_rgba(255,255,255,0.35)] transition hover:bg-neutral-200"
            >
              Open agency dashboard
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-neutral-700 px-3.5 py-2 text-[12px] text-neutral-200 transition hover:border-neutral-400 hover:text-white"
            >
              See how it works
            </a>
          </motion.div>

          <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-neutral-400">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>No code. Drop-in link for your next campaign.</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Built around real scouting workflows, not generic CRM logic.</span>
            </span>
          </div>
        </div>

        {/* Right: simple product visual, subtle motion */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, type: "spring", stiffness: 90 }}
          className="relative flex flex-1 items-center justify-end"
        >
          <motion.div
            whileHover={{ y: -6, rotateX: 2.5, rotateY: -2.5 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="relative w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950/85 p-4 shadow-[0_32px_120px_rgba(0,0,0,0.95)] backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Agency pipeline overview</span>
              <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-300">
                Nova Models · Workspace
              </span>
            </div>

            {/* Columns preview – calm, simplified */}
            <div className="grid grid-cols-3 gap-3 text-[11px]">
              <MiniColumn title="Incoming" count="127" badge="New talent" />
              <MiniColumn title="Shortlisted" count="32" badge="For review" />
              <MiniColumn title="Scouted" count="18" badge="High intent" />
            </div>

            <div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-950/90 p-3">
              <div className="mb-2 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Today&apos;s focus (suggested)</span>
                <span className="text-[10px] text-neutral-500">AI ranking in development</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <FocusRow name="Amira · Berlin" stage="Shortlisted" note="New images added" />
                <FocusRow name="Luca · Milan" stage="Contacted" note="Awaiting reply" />
                <FocusRow name="Noah · Amsterdam" stage="Scouted" note="Ready for option" />
              </div>
            </div>

            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
              className="mt-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 px-3 py-2 text-[11px] text-neutral-300"
            >
              <span className="mr-1 text-neutral-400">Live event:</span>
              {currentEvent}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function MiniColumn({
  title,
  count,
  badge,
}: {
  title: string;
  count: string;
  badge: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 px-3 py-2.5">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] text-neutral-200">{title}</span>
        <span className="text-[10px] text-neutral-500">{badge}</span>
      </div>
      <p className="text-xl font-semibold text-neutral-50">{count}</p>
    </div>
  );
}

function FocusRow({
  name,
  stage,
  note,
}: {
  name: string;
  stage: string;
  note: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/85 px-2.5 py-1.5">
      <div className="flex flex-col">
        <span className="text-[11px] text-neutral-100">{name}</span>
        <span className="text-[10px] text-neutral-500">
          {stage} · {note}
        </span>
      </div>
      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
        Priority
      </span>
    </div>
  );
}

/* ===============================
   TRUST STRIP (simpler)
================================ */

function TrustStrip() {
  return (
    <section className="border-b border-neutral-900/80 bg-black/75">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-[11px] text-neutral-400 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Calm infrastructure for agencies, scouting teams & talent managers.</span>
        </div>
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="rounded-full border border-neutral-800 bg-neutral-950/80 px-3 py-1">
            Replace spreadsheets & DMs
          </span>
          <span className="rounded-full border border-neutral-800 bg-neutral-950/80 px-3 py-1">
            All inbound in one place
          </span>
          <span className="rounded-full border border-neutral-800 bg-neutral-950/80 px-3 py-1">
            AI scoring ready by design
          </span>
        </div>
      </div>
    </section>
  );
}

/* ===============================
   HOW IT WORKS (korte, heldere flow)
================================ */

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-b border-neutral-900/80 bg-gradient-to-b from-black/85 via-neutral-950/85 to-black/90"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 lg:py-18">
        <div className="mb-9 max-w-2xl space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">
            One link in your bio. A structured scouting pipeline out.
          </h2>
          <p className="text-[13px] leading-relaxed text-neutral-300">
            The AI Scout doesn&apos;t try to replace your taste. It gives you the structure to
            run campaigns, keep track of who&apos;s in front of you and get ready for AI
            ranking without changing how you scout.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr,1fr] lg:items-start">
          <ol className="space-y-6 text-sm text-neutral-200">
            <Step
              step="01"
              title="Generate your unique apply link"
              body="Each agency gets a dedicated intake URL. Share it on your site, in IG bios or with scouts. Every application routes into the same place."
            />
            <Step
              step="02"
              title="Models apply with photos and essentials"
              body="Applicants send portfolio shots, socials and measurements in a mobile-first form. No more chasing missing details in the DMs."
            />
            <Step
              step="03"
              title="Move models together, prepare for AI scoring"
              body="Your team works one shared pipeline. When AI ranking goes live, it runs on the stages and data you already use."
            />
          </ol>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, type: "spring", stiffness: 90 }}
            className="relative rounded-3xl border border-neutral-800 bg-neutral-950/85 p-4 text-[12px] text-neutral-300 shadow-[0_26px_90px_rgba(0,0,0,0.9)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-neutral-200">AI scoring (in development)</span>
              <span className="rounded-full bg-amber-500/12 px-2 py-0.5 text-[10px] text-amber-300">
                Early access
              </span>
            </div>
            <p className="mb-3 text-[12px] text-neutral-400">
              The AI Scout will soon analyze each profile for fit, visual quality and booking
              potential — directly on top of your existing pipeline.
            </p>
            <ul className="mb-4 space-y-1.5">
              <li>• AI score from 0–100 per model</li>
              <li>• Tags like “high potential”, “interesting”, “low fit”</li>
              <li>• Suggestions for who to speak to next</li>
            </ul>
            <div className="rounded-2xl border border-dashed border-neutral-800 px-3 py-3 text-[11px] text-neutral-400">
              <p className="mb-1 text-neutral-200">You&apos;re early.</p>
              <p>
                Early agencies help shape the scoring and get the most leverage when it goes
                live. The pipeline you set up now is the foundation for your AI advantage.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Step({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-neutral-100">
        {step}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-neutral-50">{title}</p>
        <p className="text-[12px] text-neutral-400">{body}</p>
      </div>
    </li>
  );
}

/* ===============================
   PIPELINE SECTION
================================ */

function PipelineSection() {
  return (
    <section id="pipeline" className="border-b border-neutral-900/80 bg-black/80 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">
              A pipeline that feels like scouting, not software.
            </h2>
            <p className="max-w-xl text-[12px] text-neutral-400">
              Incoming, Shortlisted, Contacted, Scouted, Archived — the stages you already
              use are now visible in one, calm interface your whole team can read at a glance.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-neutral-700 px-4 py-1.5 text-[11px] text-neutral-200 transition hover:border-neutral-400 hover:text-white"
          >
            Jump into live dashboard
          </Link>
        </div>

        <div className="mt-1 overflow-x-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
            className="min-w-[680px] rounded-3xl border border-neutral-800 bg-neutral-950/90 p-4"
          >
            <div className="mb-3 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Pipeline preview</span>
              <span className="text-neutral-500">
                Simulated view · Your real dashboard uses live data
              </span>
            </div>
            <div className="flex gap-3 text-[11px]">
              {PIPELINE_COLUMNS.map((name, index) => (
                <PipelineColumn key={name} name={name} accent={index === 1} />
              ))}
            </div>
          </motion.div>
        </div>

        <p className="text-[11px] text-neutral-500">
          In your real dashboard, columns sync live with your apply link and every card opens
          a full model profile with photos, socials and internal notes.
        </p>
      </div>
    </section>
  );
}

function PipelineColumn({ name, accent }: { name: string; accent?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 150, damping: 18 }}
      className={`flex min-w-[140px] flex-1 flex-col gap-2 rounded-2xl border bg-neutral-900/85 p-3 ${
        accent ? "border-indigo-500/60 shadow-[0_0_24px_rgba(79,70,229,0.4)]" : "border-neutral-800"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] text-neutral-200">{name}</span>
        <span className="text-[10px] text-neutral-500">3 models</span>
      </div>
      <ColumnCard name="Amira · Berlin" score="94" />
      <ColumnCard name="Luca · Milan" score="89" />
      <ColumnCard name="Noah · Amsterdam" score="86" />
    </motion.div>
  );
}

function ColumnCard({ name, score }: { name: string; score: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/82 px-2.5 py-1.5">
      <p className="text-[11px] text-neutral-100">{name}</p>
      <p className="flex items-center justify-between text-[10px] text-neutral-500">
        <span>AI score</span>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
          {score}
        </span>
      </p>
    </div>
  );
}

/* ===============================
   PERSONAS (simpel, rustig)
================================ */

function PersonasSection() {
  return (
    <section
      id="personas"
      className="border-b border-neutral-900/80 bg-gradient-to-b from-black/82 via-neutral-950/82 to-black/90 py-14"
    >
      <div className="mx-auto max-w-6xl px-4 space-y-7">
        <div className="max-w-xl space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Built for the three people who actually move the industry.
          </h2>
          <p className="text-[12px] text-neutral-400">
            The AI Scout is calibrated to how real agencies operate — from directors, to head
            scouts, to the newest person in the group chat.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <PersonaCard
            title="Agency director"
            subtitle="Wants clarity & focus."
            bullets={[
              "See the entire pipeline in one calm view.",
              "Know which models are moving, which are stuck.",
              "Get reporting without digging through chats.",
            ]}
          />
          <PersonaCard
            title="Head scout"
            subtitle="Wants speed & signal."
            bullets={[
              "Never lose a strong profile in the noise.",
              "Track who was contacted, when and why.",
              "Route applications to the right person instantly.",
            ]}
          />
          <PersonaCard
            title="Junior scout"
            subtitle="Wants a clear next step."
            bullets={[
              "Always know who to contact next.",
              "See context before reaching out.",
              "Learn the agency’s standards from the pipeline itself.",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function PersonaCard({
  title,
  subtitle,
  bullets,
}: {
  title: string;
  subtitle: string;
  bullets: string[];
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 150, damping: 16 }}
      className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/84 p-4 text-[12px] shadow-[0_26px_80px_rgba(0,0,0,0.9)]"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500/26 via-emerald-500/18 to-sky-500/18 blur-2xl opacity-80" />
      <div className="relative space-y-2">
        <p className="text-xs font-semibold text-neutral-100">{title}</p>
        <p className="text-[11px] text-neutral-400">{subtitle}</p>
        <ul className="space-y-1.5 text-[11px] text-neutral-300">
          {bullets.map((b) => (
            <li key={b}>• {b}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ===============================
   CTA & FOOTER
================================ */

function BottomCTA() {
  return (
    <section className="border-b border-neutral-900/80 bg-gradient-to-r from-indigo-600/18 via-violet-600/12 to-emerald-500/14">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-11 text-center lg:flex-row lg:text-left">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Ready to see your talent universe in one calm dashboard?
          </h2>
          <p className="max-w-xl text-[12px] text-neutral-100">
            Log in, generate your apply link and send your next campaigns into The AI Scout
            instead of someone&apos;s inbox. One link in — a structured pipeline out.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/login"
            className="rounded-full bg-white px-4 py-2 text-[12px] font-medium text-black transition hover:bg-neutral-200"
          >
            Log in to dashboard
          </Link>
          <a
            href="#how-it-works"
            className="rounded-full border border-neutral-800 px-3 py-1.5 text-[11px] text-neutral-200 transition hover:border-neutral-500 hover:text-white"
          >
            Walk through the flow
          </a>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-neutral-900/80 bg-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-[11px] text-neutral-500 sm:flex-row">
        <span>© {new Date().getFullYear()} The AI Scout. All rights reserved.</span>
        <span className="text-neutral-600">Built for agencies that actually move fast.</span>
      </div>
    </footer>
  );
}
