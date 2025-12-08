
"use client";

import { motion } from "framer-motion";
import ApplyForm from "@/components/apply/ApplyForm";
import Footer from "@/components/home/Footer"; // Reusing footer for consistency

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

/* ---------------- MAIN PAGE ---------------- */

export default function ApplyPage({ params }: { params: { slug: string } }) {
  // In a real app we might fetch agency details based on slug
  const agencyName = params.slug === "demo" ? "Demo Agency" : params.slug;

  return (
    <main className="relative min-h-screen w-full bg-[#050816] text-white overflow-x-hidden flex flex-col justify-center">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 
        bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.14),transparent_55%)]" />

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-col gap-6 sm:gap-8">

        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center justify-center text-center space-y-2"
        >
          <Header slug={agencyName} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
        >
          <ApplyForm slug={agencyName} />
        </motion.div>

        <div className="mt-4 pt-4 border-t border-slate-800/50">
          <FooterNote />
        </div>
      </div>
    </main>
  );
}

/* ---------------- HEADER ---------------- */

function Header({ slug }: { slug: string }) {
  return (
    <header className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <motion.div
          className="h-8 w-8 flex items-center justify-center rounded-lg 
          bg-slate-900 border border-slate-800 
          shadow-[0_0_22px_rgba(56,189,248,0.35)]"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] font-semibold tracking-tight">AI</span>
        </motion.div>

        <div className="leading-tight text-left">
          <p className="text-sm font-semibold tracking-tight">The AI Scout</p>
          <p className="text-[10px] text-slate-400">
            Apply to: <span className="text-white font-medium">{slug}</span>
          </p>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold max-w-xl">
        Start your modeling career
      </h1>

      <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed hidden sm:block">
        Complete your profile below. The AI will analyze your application and match you with the agency's needs.
      </p>
    </header>
  );
}

function FooterNote() {
  return (
    <div className="text-center">
      <p className="text-[10px] text-slate-500 leading-relaxed max-w-lg mx-auto">
        The AI Scout does not sign or represent models. Powering intake for {new Date().getFullYear()}.
      </p>
    </div>
  );
}
