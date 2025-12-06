"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------
   TYPES
------------------------------------ */

type GroupKey = "strongFit" | "watchlist" | "lowFit" | "rejected";
type ViewTab = "pipeline" | "favorites" | "rejected";

type Model = {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  score: number; // 0–100
  group: GroupKey;
  favorite: boolean;
  createdAt: string;
  photos?: string[];
  motivation?: string;
};

/* ------------------------------------
   INITIAL MOCK DATA
------------------------------------ */

const initialModels: Model[] = [
  {
    id: "1",
    name: "Amira Novak",
    age: 21,
    city: "Amsterdam",
    country: "NL",
    score: 92,
    group: "strongFit",
    favorite: true,
    createdAt: new Date().toISOString(),
    motivation: "Motivated, experienced in e-commerce and editorial.",
  },
  {
    id: "2",
    name: "Luca Moretti",
    age: 23,
    city: "Milan",
    country: "IT",
    score: 78,
    group: "watchlist",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Sara Jensen",
    age: 20,
    city: "Copenhagen",
    country: "DK",
    score: 56,
    group: "lowFit",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Noah Schmidt",
    age: 24,
    city: "Berlin",
    country: "DE",
    score: 88,
    group: "strongFit",
    favorite: false,
    createdAt: new Date().toISOString(),
  },
];

/* ------------------------------------
   GROUP META (LABELS & COLORS)
------------------------------------ */

const groupMeta: Record<
  GroupKey,
  { label: string; description: string; accent: string }
> = {
  strongFit: {
    label: "Strong Fit",
    description: "Review these first.",
    accent: "border-emerald-400/60 bg-emerald-500/5",
  },
  watchlist: {
    label: "Watchlist",
    description: "Potential. Keep on your radar.",
    accent: "border-sky-400/60 bg-sky-500/5",
  },
  lowFit: {
    label: "Low Fit",
    description: "Visible, but lower priority.",
    accent: "border-slate-500/60 bg-slate-500/5",
  },
  rejected: {
    label: "Rejected",
    description: "Auto-cleared after 10 days.",
    accent: "border-red-400/60 bg-red-500/5",
  },
};

/* ------------------------------------
   MAIN DASHBOARD PAGE
------------------------------------ */

export default function DashboardPage() {
  const [models, setModels] = useState<Model[]>(initialModels);
  const [activeTab, setActiveTab] = useState<ViewTab>("pipeline");
  const [contactModel, setContactModel] = useState<Model | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const pipelineGroups = useMemo(
    () => ({
      strongFit: models.filter((m) => m.group === "strongFit"),
      watchlist: models.filter((m) => m.group === "watchlist"),
      lowFit: models.filter((m) => m.group === "lowFit"),
    }),
    [models]
  );

  const favoriteModels = useMemo(
    () => models.filter((m) => m.favorite && m.group !== "rejected"),
    [models]
  );

  const rejectedModels = useMemo(
    () => models.filter((m) => m.group === "rejected"),
    [models]
  );

  function updateModel(id: string, data: Partial<Model>) {
    setModels((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
  }

  function moveToGroup(id: string, group: GroupKey) {
    updateModel(id, { group });
  }

  function toggleFavorite(id: string) {
    setModels((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, favorite: !m.favorite } : m
      )
    );
  }

  function rejectModel(id: string) {
    updateModel(id, { group: "rejected", favorite: false });
  }

  return (
    <main className="min-h-screen w-full bg-[#050816] text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 md:px-10 py-8 flex flex-col gap-6">
        <TopBar />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "pipeline" && (
          <PipelineView
            groups={pipelineGroups}
            onMove={moveToGroup}
            onFavorite={toggleFavorite}
            onReject={rejectModel}
            onContact={setContactModel}
            onSelect={setSelectedModel}
          />
        )}

        {activeTab === "favorites" && (
          <ListView
            title="Favorites"
            subtitle="Models you’ve starred across all categories."
            models={favoriteModels}
            onMove={moveToGroup}
            onFavorite={toggleFavorite}
            onReject={rejectModel}
            onContact={setContactModel}
            onSelect={setSelectedModel}
          />
        )}

        {activeTab === "rejected" && (
          <ListView
            title="Rejected"
            subtitle="These profiles will be auto-cleared after 10 days."
            models={rejectedModels}
            onMove={moveToGroup}
            onFavorite={toggleFavorite}
            onReject={rejectModel}
            onContact={setContactModel}
            onSelect={setSelectedModel}
            variant="rejected"
          />
        )}
      </div>

      {/* DETAIL PANEL RECHTS */}
      <ModelDetailPanel
        model={selectedModel}
        onClose={() => setSelectedModel(null)}
      />

      {/* CONTACT MODAL */}
      <ContactModal
        model={contactModel}
        onClose={() => setContactModel(null)}
      />
    </main>
  );
}

/* ------------------------------------
   TOP BAR
------------------------------------ */

function TopBar() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-sky-400">
          Intake Dashboard
        </p>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          AI-scored model pipeline
        </h1>
        <p className="text-[12px] text-slate-400 max-w-md">
          Strong Fit, Watchlist, Low Fit, Favorites and Rejected — all in one clean view.
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>AI scoring live</span>
      </div>
    </div>
  );
}

/* ------------------------------------
   TABS
------------------------------------ */

function Tabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: ViewTab;
  setActiveTab: (t: ViewTab) => void;
}) {
  const tabs: { key: ViewTab; label: string }[] = [
    { key: "pipeline", label: "Pipeline" },
    { key: "favorites", label: "Favorites" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="inline-flex items-center rounded-full bg-slate-900/80 border border-slate-800 p-1 text-[11px]">
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-3.5 py-1.5 rounded-full transition ${
              active ? "text-slate-950" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {active && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-sky-400"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------
   PIPELINE VIEW
------------------------------------ */

function PipelineView({
  groups,
  onMove,
  onFavorite,
  onReject,
  onContact,
  onSelect,
}: {
  groups: {
    strongFit: Model[];
    watchlist: Model[];
    lowFit: Model[];
  };
  onMove: (id: string, group: GroupKey) => void;
  onFavorite: (id: string) => void;
  onReject: (id: string) => void;
  onContact: (model: Model) => void;
  onSelect: (model: Model) => void;
}) {
  return (
    <div className="grid gap-4 lg:gap-5 lg:grid-cols-3">
      <Column
        group="strongFit"
        models={groups.strongFit}
        onMove={onMove}
        onFavorite={onFavorite}
        onReject={onReject}
        onContact={onContact}
        onSelect={onSelect}
      />
      <Column
        group="watchlist"
        models={groups.watchlist}
        onMove={onMove}
        onFavorite={onFavorite}
        onReject={onReject}
        onContact={onContact}
        onSelect={onSelect}
      />
      <Column
        group="lowFit"
        models={groups.lowFit}
        onMove={onMove}
        onFavorite={onFavorite}
        onReject={onReject}
        onContact={onContact}
        onSelect={onSelect}
      />
    </div>
  );
}

/* ------------------------------------
   SINGLE COLUMN
------------------------------------ */

function Column({
  group,
  models,
  onMove,
  onFavorite,
  onReject,
  onContact,
  onSelect,
}: {
  group: GroupKey;
  models: Model[];
  onMove: (id: string, group: GroupKey) => void;
  onFavorite: (id: string) => void;
  onReject: (id: string) => void;
  onContact: (model: Model) => void;
  onSelect: (model: Model) => void;
}) {
  const meta = groupMeta[group];

  const availableMoves: { key: GroupKey; label: string }[] = [
    { key: "strongFit" as GroupKey, label: "Strong Fit" },
    { key: "watchlist" as GroupKey, label: "Watchlist" },
    { key: "lowFit" as GroupKey, label: "Low Fit" },
    { key: "rejected" as GroupKey, label: "Rejected" },
  ].filter((g) => g.key !== group);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col max-h-[70vh]">
      <div className="flex items-center justify-between px-3.5 pt-3.5 pb-2">
        <div className="space-y-0.5">
          <p className="text-[12px] font-semibold text-slate-100">
            {meta.label}
          </p>
          <p className="text-[11px] text-slate-500">{meta.description}</p>
        </div>

        <span
          className={`
            inline-flex items-center justify-center rounded-full 
            border text-[10px] px-2 py-0.5 ${meta.accent}
          `}
        >
          {models.length} in lane
        </span>
      </div>

      <div className="mt-1 px-2 pb-2 overflow-y-auto space-y-2">
        <AnimatePresence initial={false}>
          {models.map((model) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              <ModelCard
                model={model}
                group={group}
                availableMoves={availableMoves}
                onMove={onMove}
                onFavorite={onFavorite}
                onReject={onReject}
                onContact={onContact}
                onSelect={onSelect}
              />
            </motion.div>
          ))}

          {models.length === 0 && (
            <p className="text-[11px] text-slate-500 text-center py-6">
              No models in this lane yet.
            </p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------
   LIST VIEW (FAVORITES / REJECTED)
------------------------------------ */

function ListView({
  title,
  subtitle,
  models,
  onMove,
  onFavorite,
  onReject,
  onContact,
  onSelect,
  variant,
}: {
  title: string;
  subtitle: string;
  models: Model[];
  onMove: (id: string, group: GroupKey) => void;
  onFavorite: (id: string) => void;
  onReject: (id: string) => void;
  onContact: (model: Model) => void;
  onSelect: (model: Model) => void;
  variant?: "rejected";
}) {
  const availableMovesBase: { key: GroupKey; label: string }[] = [
    { key: "strongFit" as GroupKey, label: "Strong Fit" },
    { key: "watchlist" as GroupKey, label: "Watchlist" },
    { key: "lowFit" as GroupKey, label: "Low Fit" },
  ];

  const availableMovesRejected: { key: GroupKey; label: string }[] = [
    ...availableMovesBase,
    { key: "rejected" as GroupKey, label: "Rejected" },
  ];

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-sm sm:text-[15px] font-semibold text-slate-100">
          {title}
        </h2>
        <p className="text-[12px] text-slate-400">{subtitle}</p>
      </div>

      <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false}>
          {models.map((model) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              <ModelCard
                model={model}
                group={variant === "rejected" ? "rejected" : model.group}
                availableMoves={
                  variant === "rejected"
                    ? availableMovesRejected
                    : availableMovesBase
                }
                onMove={onMove}
                onFavorite={onFavorite}
                onReject={onReject}
                onContact={onContact}
                onSelect={onSelect}
              />
            </motion.div>
          ))}

          {models.length === 0 && (
            <p className="text-[11px] text-slate-500 py-6">
              No models in this view yet.
            </p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------
   MODEL CARD
------------------------------------ */

function ModelCard({
  model,
  group,
  availableMoves,
  onMove,
  onFavorite,
  onReject,
  onContact,
  onSelect,
}: {
  model: Model;
  group: GroupKey;
  availableMoves: { key: GroupKey; label: string }[];
  onMove: (id: string, group: GroupKey) => void;
  onFavorite: (id: string) => void;
  onReject: (id: string) => void;
  onContact: (model: Model) => void;
  onSelect: (model: Model) => void;
}) {
  return (
    <div
      onClick={() => onSelect(model)}
      className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-3 cursor-pointer hover:bg-slate-900/70 transition"
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-[13px] font-semibold text-slate-100 truncate">
            {model.name}
          </p>
          <p className="text-[11px] text-slate-500">
            {model.age} · {model.city}, {model.country}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ScoreBadge score={model.score} />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(model.id);
            }}
            className={`text-xs transition ${
              model.favorite
                ? "text-yellow-300"
                : "text-slate-500 hover:text-slate-200"
            }`}
          >
            {model.favorite ? "★" : "☆"}
          </button>
        </div>
      </div>

      {/* ACTIONS */}
      <div
        className="flex items-center justify-between gap-2 text-[11px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onContact(model)}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 
              bg-sky-500/10 text-sky-200 border border-sky-500/40 
              hover:bg-sky-500/20 transition"
          >
            📩
            <span>Contact</span>
          </button>

          <button
            type="button"
            onClick={() => onReject(model.id)}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 
              bg-red-500/5 text-red-300 border border-red-500/40 
              hover:bg-red-500/15 transition"
          >
            ✖
            <span>Reject</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            Move to
          </span>

          <div className="inline-flex items-center gap-1">
            {availableMoves.map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => onMove(model.id, g.key)}
                className="text-[10px] rounded-full px-2 py-0.5 
                  bg-slate-900 border border-slate-700/80 
                  text-slate-300 hover:bg-slate-800 transition"
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------
   SCORE BADGE
------------------------------------ */

function ScoreBadge({ score }: { score: number }) {
  let color =
    "bg-emerald-500/15 text-emerald-300 border-emerald-500/50"; // 80+

  if (score < 50) {
    color = "bg-slate-500/15 text-slate-200 border-slate-500/50";
  } else if (score < 75) {
    color = "bg-sky-500/15 text-sky-200 border-sky-500/50";
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full 
        px-2 py-0.5 text-[10px] border ${color}
      `}
    >
      AI {score}
    </span>
  );
}

/* ------------------------------------
   CONTACT MODAL
------------------------------------ */

function ContactModal({
  model,
  onClose,
}: {
  model: Model | null;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");

  if (!model) return null;

  const defaultTemplate =
    `Hi ${model.name.split(" ")[0]},\n\n` +
    `We’ve reviewed your application and would love to talk about potential opportunities.\n\n` +
    `Best,\n` +
    `Your agency`;

  const effectiveMessage = message || defaultTemplate;

  return (
    <AnimatePresence>
      <motion.div
        key="contact-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          key="contact-modal"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <p className="text-[13px] font-semibold text-slate-100">
                Contact {model.name}
              </p>
              <p className="text-[11px] text-slate-500">
                {model.city}, {model.country} · AI score {model.score}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[13px] text-slate-500 hover:text-slate-200"
            >
              ✖
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] text-slate-400">
              Edit the message before sending. In the future, agencies can set
              their own templates here and get AI-generated suggestions.
            </p>

            <textarea
              rows={6}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/70 
                text-[12px] text-slate-100 px-3 py-2 outline-none 
                focus:border-sky-500 focus:ring-1 focus:ring-sky-500/60 resize-none"
              value={effectiveMessage}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex items-center justify-between text-[11px] mt-1">
              <button
                type="button"
                className="text-sky-300 hover:text-sky-200"
              >
                ✨ Generate with AI (coming soon)
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1 rounded-full bg-white text-slate-900 
                  px-3 py-1.5 text-[11px] font-semibold shadow-md 
                  hover:bg-slate-100 active:scale-[0.98] transition"
              >
                Mark as contacted
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------
   MODEL DETAIL PANEL (RIGHT SIDE)
------------------------------------ */

function ModelDetailPanel({
  model,
  onClose,
}: {
  model: Model | null;
  onClose: () => void;
}) {
  if (!model) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="detail-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-40"
        onClick={onClose}
      />

      <motion.div
        key="detail-panel"
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="fixed top-0 right-0 w-full sm:w-[420px] h-full 
          bg-slate-950 border-l border-slate-800 z-50 flex flex-col"
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-100">
              {model.name}
            </h2>
            <p className="text-[11px] text-slate-500">
              {model.age} · {model.city}, {model.country}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[18px] text-slate-400 hover:text-white"
          >
            ✖
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* AI SCORE BLOCK */}
          <section>
            <h3 className="text-[13px] font-semibold text-slate-200">
              AI score
            </h3>
            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <p className="text-[28px] font-semibold text-sky-300">
                {model.score}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                AI-estimated fit based on your agency parameters and intake data.
              </p>
            </div>
          </section>

          {/* MOTIVATION */}
          {model.motivation && (
            <section className="space-y-2">
              <h3 className="text-[13px] font-semibold text-slate-200">
                Motivation
              </h3>
              <p className="text-[12px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                {model.motivation}
              </p>
            </section>
          )}

          {/* PLACEHOLDER FOR PHOTOS / METRICS (LATER BACKEND) */}
          <section className="space-y-2">
            <h3 className="text-[13px] font-semibold text-slate-200">
              Profile
            </h3>
            <p className="text-[11px] text-slate-500">
              When your apply form is connected, this panel will show photos,
              measurements and more detailed AI insights.
            </p>
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
