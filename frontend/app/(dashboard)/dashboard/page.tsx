"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type DashboardStats = {
  total: number;
  incoming: number;
  shortlisted: number;
  contacted: number;
  scouted: number;
  archived: number;
  topMatches: number;
  newThisWeek: number;
};

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch("/api/dashboard/stats");
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load stats");
      }
    }
    load();
  }, []);

  const metricCards = [
    {
      label: "Total models",
      value: stats?.total ?? 0,
      subtitle: "All models in your agency",
    },
    {
      label: "New this week",
      value: stats?.newThisWeek ?? 0,
      subtitle: "Recent applications",
    },
    {
      label: "Top matches",
      value: stats?.topMatches ?? 0,
      subtitle: "AI-ranked top profiles",
    },
  ];

  const pipelineCards = [
    { label: "Incoming", value: stats?.incoming ?? 0 },
    { label: "Shortlisted", value: stats?.shortlisted ?? 0 },
    { label: "Contacted", value: stats?.contacted ?? 0 },
    { label: "Scouted", value: stats?.scouted ?? 0 },
    { label: "Archived", value: stats?.archived ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/60 rounded-lg px-3 py-2 inline-block">
          {error}
        </p>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricCards.map((m) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value}
            subtitle={m.subtitle}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-3xl border border-neutral-800 bg-neutral-950/60 backdrop-blur-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Pipeline overview</h2>
            <span className="text-[10px] text-neutral-500">Live counts</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {pipelineCards.map((p) => (
              <div
                key={p.label}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/70 px-3 py-2"
              >
                <p className="text-[11px] text-neutral-400">{p.label}</p>
                <p className="text-lg font-semibold mt-1">{p.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/60 backdrop-blur-xl p-4">
          <h2 className="text-sm font-medium mb-3">Recent activity</h2>
          <ul className="space-y-2 text-xs text-neutral-300">
            <li className="flex justify-between">
              <span>New incoming models</span>
              <span className="text-neutral-500">last 24h</span>
            </li>
            <li className="flex justify-between">
              <span>Shortlisted by AI</span>
              <span className="text-neutral-500">live</span>
            </li>
            <li className="flex justify-between">
              <span>Contacted this week</span>
              <span className="text-neutral-500">pipeline</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-950/70 backdrop-blur-xl p-4 flex flex-col justify-between shadow-lg shadow-black/40">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-neutral-400">{label}</span>
        <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          AI insight
        </span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-[11px] text-neutral-500 mt-1">{subtitle}</div>
    </div>
  );
}
