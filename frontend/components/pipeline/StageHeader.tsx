"use client";

import type { Stage } from "./types";

const LABELS: Record<Stage, string> = {
  incoming: "Incoming",
  shortlisted: "Shortlisted",
  contacted: "Contacted",
  scouted: "Scouted",
  archived: "Archived",
};

export default function StageHeader({
  stage,
  count,
}: {
  stage: Stage;
  count: number;
}) {
  return (
    <div className="space-y-1">
      <h1 className="text-lg font-semibold tracking-tight">
        {LABELS[stage]}{" "}
        <span className="text-xs text-neutral-500 ml-1">({count})</span>
      </h1>
      <p className="text-[11px] text-neutral-500">
        AI-sorted models in the <span className="font-medium">{LABELS[stage]}</span>{" "}
        stage.
      </p>
    </div>
  );
}
