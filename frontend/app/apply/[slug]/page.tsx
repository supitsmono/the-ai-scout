"use client";

import { useState, useRef, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import PhoneInput from "@/components/ui/PhoneInput";

/* ---------------- ANIMATION CONFIG ---------------- */

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

/* ---------------- CONSTANTS ---------------- */

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 70 }, (_, i) => new Date().getFullYear() - 10 - i);
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

/* ---------------- MAIN PAGE ---------------- */

export default function ApplyPage({ params }: { params: { slug: string } }) {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (formRef.current) {
      const invalid = formRef.current.querySelector(":invalid") as HTMLElement | null;

      if (invalid) {
        invalid.scrollIntoView({ behavior: "smooth", block: "center" });
        invalid.classList.add("ring-1", "ring-red-500");

        setTimeout(() => {
          invalid.classList.remove("ring-1", "ring-red-500");
        }, 2000);

        return;
      }
    }

    setSubmitted(true);
  }

  return (
    <main className="relative min-h-screen w-full bg-[#050816] text-white overflow-x-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.14),transparent_55%)]" />

      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8 md:px-10 py-12 flex flex-col gap-12">
        
        {/* HEADER (motion allowed) */}
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Header slug={params.slug} />
        </motion.div>

        {/* FORM WRAPPER (no conditional mount!!) */}
        <div style={{ display: submitted ? "none" : "block" }}>
          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <ApplyForm onSubmit={handleSubmit} forwardedRef={formRef} />
          </motion.div>
        </div>

        {/* THANK YOU PAGE (also no mount/unmount) */}
        <div style={{ display: submitted ? "block" : "none" }}>
          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <ThankYou />
          </motion.div>
        </div>

        <FooterNote />
      </div>
    </main>
  );
}

/* ---------------- HEADER ---------------- */

function Header({ slug }: { slug: string }) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <motion.div
          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-[0_0_22px_rgba(56,189,248,0.35)]"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs font-semibold tracking-tight">AI</span>
        </motion.div>

        <div className="leading-tight">
          <p className="text-[15px] font-semibold tracking-tight">The AI Scout</p>
          <p className="text-[11px] text-slate-400">
            Official apply page for: <span className="text-slate-200">{slug}</span>
          </p>
        </div>
      </div>

      <p className="text-[13px] sm:text-[14px] text-slate-300 max-w-md leading-relaxed">
        Apply once. The agency receives your details and photos in a clean,
        AI-structured profile and reviews everything manually on their side.
      </p>
    </header>
  );
}

/* ---------------- FORM ---------------- */

function ApplyForm({
  onSubmit,
  forwardedRef,
}: {
  onSubmit: (e: FormEvent) => void;
  forwardedRef: React.RefObject<HTMLFormElement>;
}) {
  return (
    <form ref={forwardedRef} onSubmit={onSubmit} className="space-y-12">
      {/* PERSONAL INFO */}
      <SectionBlock
        title="Personal information"
        subtitle="Use real details so the agency can contact you if there is a match."
      >
        <div className="grid sm:grid-cols-2 gap-4">

          <Field label="First name" required>
            <input required name="firstName" className="input" placeholder="Amira" />
          </Field>

          <Field label="Last name" required>
            <input required name="lastName" className="input" placeholder="Novak" />
          </Field>

          <Field label="Phone number" required>
            <PhoneInput />
          </Field>

          <Field label="Email address" required>
            <input required type="email" name="email" className="input" placeholder="you@example.com" />
          </Field>

          <Field label="Country" required>
            <input required name="country" className="input" placeholder="Netherlands" />
          </Field>

          <Field label="City" required>
            <input required name="city" className="input" placeholder="Amsterdam" />
          </Field>

          <Field label="Height (cm)" required>
            <input required name="height" className="input" placeholder="178" inputMode="numeric" pattern="[0-9]*" />
          </Field>

          <Field label="Date of birth" required>
            <DobSelect />
          </Field>

        </div>
      </SectionBlock>

      {/* MOTIVATION */}
      <SectionBlock
        title="Motivation"
        subtitle="Optional but helpful. Share anything you'd like the agency to know about you or your goals."
      >
        <Field label="Your message">
          <textarea name="motivation" rows={3} className="input resize-none" placeholder="Tell the agency something about yourself." />
        </Field>
      </SectionBlock>

      {/* PHOTOS */}
      <SectionBlock
        title="Required photos"
        subtitle="Upload clear, recent photos. Natural light and simple outfits work best."
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <PhotoUpload title="Close-up" description="Your face clearly visible, neutral expression." name="photoCloseUp" />
          <PhotoUpload title="Side-profile" description="Left or right profile, hair pulled back if possible." name="photoSideProfile" />
          <PhotoUpload title="Full body" description="Standing, full height visible, simple clothing." name="photoFullBody" />
          <PhotoUpload title="Full body side-profile" description="Full body from the side, natural posture." name="photoFullBodySide" />
        </div>
      </SectionBlock>

      {/* SUBMIT BUTTON */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-6 py-2.5 text-sm font-semibold shadow-md hover:bg-slate-100 active:scale-[0.99] transition"
        >
          Submit application
        </button>

        <p className="text-[11px] text-slate-500 max-w-md">
          Your application goes straight into the agency’s intake dashboard powered by The AI Scout.
        </p>
      </div>
    </form>
  );
}

/* ---------------- DOB SELECT ---------------- */

function DobSelect() {
  return (
    <div className="grid grid-cols-3 gap-2 text-[11px]">
      <select name="dobDay" required className="input bg-slate-950/80 text-[11px]" defaultValue="">
        <option value="" disabled>Day</option>
        {DAYS.map((d) => <option key={d}>{d}</option>)}
      </select>

      <select name="dobMonth" required className="input bg-slate-950/80 text-[11px]" defaultValue="">
        <option value="" disabled>Month</option>
        {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
      </select>

      <select name="dobYear" required className="input bg-slate-950/80 text-[11px]" defaultValue="">
        <option value="" disabled>Year</option>
        {YEARS.map((y) => <option key={y}>{y}</option>)}
      </select>
    </div>
  );
}

/* ---------------- THANK YOU ---------------- */

function ThankYou() {
  return (
    <section className="space-y-5 max-w-md">
      <h2 className="text-xl sm:text-2xl font-semibold">Application received 🎉</h2>

      <p className="text-[13px] sm:text-[14px] text-slate-300 leading-relaxed">
        Your profile is now in the agency’s intake queue. The AI Scout has structured your details and photos so the team can review you more easily and fairly.
      </p>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-[12px] text-slate-300 space-y-2">
        <p className="font-medium text-slate-100">What happens next?</p>
        <ul className="space-y-1">
          <li>• The agency sees your structured profile in their dashboard.</li>
          <li>• AI helps them sort and prioritise — bookers decide manually.</li>
          <li>• If there’s a potential fit, they will contact you directly.</li>
        </ul>
      </div>

      <p className="text-[11px] text-slate-500">
        Keep an eye on your email and social media for possible follow-up.
      </p>
    </section>
  );
}

/* ---------------- FOOTER NOTE ---------------- */

function FooterNote() {
  return (
    <p className="text-[11px] text-slate-500 leading-relaxed max-w-lg">
      The AI Scout does not sign or represent models. It powers intake and review for agencies only.
    </p>
  );
}

/* ---------------- UTILITY COMPONENTS ---------------- */

function SectionBlock({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="space-y-4 border-b border-slate-800 pb-8">
      <SectionTitle title={title} subtitle={subtitle} />
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm sm:text-[15px] font-semibold text-slate-100">{title}</h3>
      <p className="text-[12px] text-slate-400 leading-relaxed">{subtitle}</p>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-200">
      <span className="text-[11px] sm:text-xs">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      {children}
    </label>
  );
}

function PhotoUpload({ title, description, name }: { title: string; description: string; name: string }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-100">{title}</p>
          <p className="text-[11px] text-slate-400">{description}</p>
        </div>

        <div className="h-7 w-7 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-[11px]">
          📷
        </div>
      </div>

      <input
        type="file"
        name={name}
        required
        accept="image/*"
        className="mt-2 block w-full text-[11px] text-slate-300 
          file:mr-3 file:rounded-md file:border-0 
          file:bg-slate-800 file:px-3 file:py-1.5 
          file:text-[11px] file:font-medium 
          file:text-slate-100 hover:file:bg-slate-700"
      />
    </motion.div>
  );
}
