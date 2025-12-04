"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { ModelApplicant, Stage } from "./types";
import ModelGrid from "./ModelGrid";
import DetailPanel from "./DetailPanel";
import ToggleView from "./ToggleView";
import StageHeader from "./StageHeader";

const IMAGE_BASE = "http://127.0.0.1:5000/uploads/model_photos";

type ViewMode = "grid" | "list";

export default function PipelineEngine({ stage }: { stage: Stage }) {
  const [models, setModels] = useState<ModelApplicant[]>([]);
  const [selected, setSelected] = useState<ModelApplicant | null>(null);
  const [view, setView] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/models?stage=\${stage}`);
      setModels(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load models");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [stage]);

  async function moveToStage(modelId: number, newStage: Stage) {
    try {
      await apiFetch(`/api/models/\${modelId}/stage`, {
        method: "PATCH",
        body: JSON.stringify({ stage: newStage }),
      });
      setModels((prev) => prev.filter((m) => m.id !== modelId));
      if (selected?.id === modelId) setSelected(null);
    } catch (err: any) {
      alert(err.message || "Failed to update stage");
    }
  }

  return (
    <div className="relative flex gap-4 h-[calc(100vh-6rem)]">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <StageHeader stage={stage} count={models.length} />
          <ToggleView value={view} onChange={setView} />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/60 rounded-lg px-3 py-2 inline-block mb-3">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-xs text-neutral-500 animate-pulse">
            Loading models...
          </div>
        ) : (
          <ModelGrid
            mode={view}
            models={models}
            onSelect={setSelected}
            imageBase={IMAGE_BASE}
          />
        )}
      </div>

      <DetailPanel
        model={selected}
        onClose={() => setSelected(null)}
        onMoveStage={moveToStage}
      />
    </div>
  );
}
