"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import CompactModelCard from "./CompactModelCard";
import type { DashboardModel } from "../page";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface PipelineStage {
  key: string;
  label: string;
  description: string;
  color: string;
}

export default function PipelineBoard() {
  const { setSelectedModel } = useWorkspace();
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [modelsByStage, setModelsByStage] = useState<Record<string, DashboardModel[]>>({});
  const [loading, setLoading] = useState(true);
  const [draggedModel, setDraggedModel] = useState<{ model: DashboardModel; stage: string } | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load stages
  useEffect(() => {
    const loadStages = async () => {
      try {
        const res = await fetch(`${API_BASE}/pipeline/stages`);
        if (res.ok) {
          const data = await res.json();
          setStages(data);
        }
      } catch (err) {
        console.error("Error loading stages:", err);
      }
    };
    loadStages();
  }, []);

  // Load models for each stage
  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      try {
        const allModels: Record<string, DashboardModel[]> = {};
        
        // Load models for each stage
        for (const stage of stages) {
          try {
            const res = await fetch(`${API_BASE}/pipeline/${stage.key}`);
            if (res.ok) {
              const backendModels = await res.json();
              allModels[stage.key] = backendModels.map((m: any) => ({
                id: m.id,
                name: m.name,
                age: m.age || 0,
                height: m.height_cm || m.height || 0,
                country: m.country || "Unknown",
                photos: [
                  {
                    url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
                    type: "Full Face",
                  },
                ],
                measurements: { bust: 82, waist: 60, hips: 90 },
                motivation: "Passionate about modeling and ready to work.",
                status: (m.status || m.ai_category || "active") as any,
                aiCategory: m.ai_category || null,
                aiReasons: m.ai_reasons || null,
              }));
            } else {
              allModels[stage.key] = [];
            }
          } catch (err) {
            console.error(`Error loading models for stage ${stage.key}:`, err);
            allModels[stage.key] = [];
          }
        }
        
        setModelsByStage(allModels);
      } catch (err) {
        console.error("Error loading models:", err);
      } finally {
        setLoading(false);
      }
    };

    if (stages.length > 0) {
      loadModels();
    }
  }, [stages, refreshKey]);

  // Handle drag start
  const handleDragStart = (model: DashboardModel, stage: string) => {
    setDraggedModel({ model, stage });
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    if (draggedModel && draggedModel.stage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  // Handle drop
  const handleDrop = async (targetStage: string) => {
    setDragOverStage(null);
    if (!draggedModel || draggedModel.stage === targetStage) {
      setDraggedModel(null);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/pipeline/models/${draggedModel.model.id}/stage?stage=${targetStage}`,
        { method: "PATCH" }
      );

      if (res.ok) {
        // Update local state optimistically
        setModelsByStage((prev) => {
          const newState = { ...prev };
          // Remove from old stage
          if (newState[draggedModel.stage]) {
            newState[draggedModel.stage] = newState[draggedModel.stage].filter(
              (m) => m.id !== draggedModel.model.id
            );
          }
          // Add to new stage
          if (!newState[targetStage]) {
            newState[targetStage] = [];
          }
          newState[targetStage] = [...newState[targetStage], draggedModel.model];
          return newState;
        });
        // Trigger refresh to ensure consistency
        setRefreshKey((prev) => prev + 1);
      } else {
        alert("Failed to move model. Please try again.");
      }
    } catch (err) {
      console.error("Error moving model:", err);
      alert("Failed to move model. Please try again.");
    } finally {
      setDraggedModel(null);
    }
  };

  const getStageColor = (color: string) => {
    const colors: Record<string, string> = {
      gray: "bg-gray-500/20 border-gray-500/30",
      blue: "bg-blue-500/20 border-blue-500/30",
      green: "bg-green-500/20 border-green-500/30",
      yellow: "bg-yellow-500/20 border-yellow-500/30",
      purple: "bg-purple-500/20 border-purple-500/30",
      indigo: "bg-indigo-500/20 border-indigo-500/30",
      emerald: "bg-emerald-500/20 border-emerald-500/30",
      red: "bg-red-500/20 border-red-500/30",
    };
    return colors[color] || colors.gray;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading pipeline...
      </div>
    );
  }

  return (
    <div className="h-full overflow-x-auto p-6">
      <div className="flex gap-4 h-full min-w-max">
        {stages.map((stage) => {
          const models = modelsByStage[stage.key] || [];
          return (
            <div
              key={stage.key}
              className={`w-80 flex-shrink-0 flex flex-col transition-all ${
                dragOverStage === stage.key ? "ring-2 ring-purple-500 rounded-lg" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(stage.key)}
            >
              {/* Stage Header */}
              <div
                className={`p-4 rounded-t-lg border ${getStageColor(stage.color)} mb-2`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white">{stage.label}</h3>
                  <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                    {models.length}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{stage.description}</p>
              </div>

              {/* Models in this stage */}
              <div className={`flex-1 overflow-y-auto space-y-3 pb-4 rounded-b-lg transition-colors ${
                dragOverStage === stage.key ? "bg-purple-500/5" : ""
              }`}>
                {models.length === 0 ? (
                  <div className={`text-center py-8 text-gray-600 text-sm border-2 border-dashed rounded-lg transition-colors ${
                    dragOverStage === stage.key ? "border-purple-500/50 bg-purple-500/10" : "border-white/10"
                  }`}>
                    {dragOverStage === stage.key ? "Drop here" : "No models"}
                  </div>
                ) : (
                  models.map((model) => (
                    <div
                      key={model.id}
                      draggable
                      onDragStart={() => handleDragStart(model, stage.key)}
                      onClick={() => setSelectedModel(model.id)}
                      className="cursor-move"
                    >
                      <CompactModelCard model={model} onClick={() => setSelectedModel(model.id)} />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

