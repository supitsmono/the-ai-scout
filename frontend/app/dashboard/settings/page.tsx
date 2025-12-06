"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [agencyName, setAgencyName] = useState("Your Agency");
  const [emailTemplate, setEmailTemplate] = useState(
    "Hi {firstName},\n\nThank you for applying. We'd love to talk more.\n\nBest,\nYour agency"
  );
  const [autoCleanupDays, setAutoCleanupDays] = useState(10);

  return (
    <div className="w-full py-10 px-4 sm:px-8 md:px-12 max-w-3xl mx-auto space-y-12">
      {/* HEADER */}
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-sky-400 mb-1">
          Settings
        </p>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Agency Control Center
        </h1>
        <p className="text-[12px] text-slate-400 mt-1">
          Manage intake rules, templates, branding and automation.
        </p>
      </header>

      {/* AGENCY INFO */}
      <Section title="Agency details" subtitle="Brand your dashboard & apply pages.">
        <div className="space-y-3">
          <label className="text-[11px] text-slate-300">
            Agency name
            <input
              className="input mt-1 text-[13px]"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
            />
          </label>

          <label className="text-[11px] text-slate-300">
            Logo upload (optional)
            <input type="file" accept="image/*" className="input mt-1 text-[12px]" />
          </label>
        </div>
      </Section>

      {/* REQUIREMENTS */}
      <Section
        title="Application requirements"
        subtitle="Set what models must submit before applying."
      >
        <div className="space-y-4 text-[12px]">
          <Toggle label="Require all 4 photos" defaultChecked={true} />
          <Toggle label="Require phone number" defaultChecked={true} />
          <Toggle label="Require email" defaultChecked={true} />
          <Toggle label="Require motivation message" />
          <Toggle label="Require exact height (cm)" defaultChecked={true} />
        </div>
      </Section>

      {/* EMAIL TEMPLATE */}
      <Section
        title="AI contact template"
        subtitle="Default DM/email message when contacting models."
      >
        <textarea
          rows={6}
          className="w-full rounded-xl bg-slate-950 border border-slate-800 
            text-[12px] text-slate-100 p-3 outline-none
            focus:ring-1 focus:ring-sky-500"
          value={emailTemplate}
          onChange={(e) => setEmailTemplate(e.target.value)}
        />

        <p className="text-[10px] text-slate-500 mt-1">
          Variables supported: <span className="text-slate-300">{`{firstName}, {age}, {city}`}</span>
        </p>
      </Section>

      {/* AUTOMATION */}
      <Section
        title="Automation"
        subtitle="The AI Scout can keep your pipeline clean automatically."
      >
        <label className="text-[11px] text-slate-300">
          Days before rejected models auto-delete
          <input
            type="number"
            min={1}
            max={30}
            className="input mt-1 text-[13px] w-24"
            value={autoCleanupDays}
            onChange={(e) => setAutoCleanupDays(Number(e.target.value))}
          />
        </label>
      </Section>

      {/* SAVE BUTTON */}
      <div className="pt-4">
        <SaveButton />
      </div>
    </div>
  );
}

/* -----------------------
   SAVE BUTTON
------------------------ */

function SaveButton() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <motion.button
      onClick={handleSave}
      whileTap={{ scale: 0.97 }}
      className="px-6 py-2.5 bg-white text-slate-900 rounded-full font-semibold text-sm
        shadow-md hover:bg-slate-100 transition"
    >
      {saved ? "Saved ✓" : "Save changes"}
    </motion.button>
  );
}

/* -----------------------
   TOGGLE SWITCH
------------------------ */

function Toggle({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(defaultChecked);

  return (
    <label className="flex items-center justify-between">
      <span className="text-slate-300">{label}</span>

      <button
        type="button"
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full relative transition ${
          on ? "bg-sky-500" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transform transition ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}

/* -----------------------
   SECTION WRAPPER
------------------------ */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 border-b border-slate-800 pb-8">
      <div>
        <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
        <p className="text-[11px] text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
