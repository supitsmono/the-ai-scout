"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import ModelDetailPanel from "../ModelDetailPanel";
import ModelProfilePanel from "../../chats/[chatId]/components/ModelProfilePanel";
import ChatInterface from "./ChatInterface";
import DashboardHome from "./DashboardHome";
import Analytics from "./Analytics";
import type { DashboardModel } from "../page";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CenterPanel() {
  const { viewMode, selectedModelId, activeChatId, setActiveChat, setViewMode, setSelectedModel, goBack } = useWorkspace();
  const [selectedModelData, setSelectedModelData] = useState<DashboardModel | null>(null);

  // Load selected model (applications/favorites)
  useEffect(() => {
    if (selectedModelId && (viewMode === "applications" || viewMode === "favorites")) {
      const loadModel = async () => {
        try {
          const res = await fetch(`${API_BASE}/models/${selectedModelId}`);
          if (res.ok) {
            const m = await res.json();
            const model: DashboardModel = {
              id: m.id,
              name: m.name,
              age: m.age || 0,
              height: m.height_cm || m.height || 0,
              country: m.country || "Unknown",
              photos: m.photos ? m.photos.map((p: any) => typeof p === 'string' ? { url: p } : p) : [{ url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg", type: "Full Face" }],
              measurements: { bust: 82, waist: 60, hips: 90 },
              motivation: m.motivation || "",
              status: (m.status || m.ai_category || "active") as any,
              aiCategory: m.ai_category || null,
              aiReasons: m.ai_reasons || null,
            };
            setSelectedModelData(model);
          }
        } catch (err) {
          console.error("Error loading model:", err);
        }
      };
      loadModel();
    } else {
      setSelectedModelData(null);
    }
  }, [selectedModelId, viewMode]);

  // Handle Model Loading when returning to view (Safety)
  useEffect(() => {
    if (selectedModelId && (viewMode === "applications" || viewMode === "favorites") && !selectedModelData) {
      // Re-trigger load if needed (handled by logic above mostly but redundant check is fine)
    }
  }, [selectedModelId, viewMode, selectedModelData]);


  // Home Dashboard View
  if (viewMode === "home") {
    return <DashboardHome />;
  }

  // Analytics View
  if (viewMode === "analytics") {
    return <Analytics />;
  }

  // Applications or Favorites view - show empty state or model detail as slide-over
  if (viewMode === "applications" || viewMode === "favorites") {
    return (
      <div className="h-full relative">
        {/* Empty state when no model selected */}
        {!selectedModelId && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">Select a model to view details</p>
              <p className="text-sm text-gray-600">Click on a model from the left panel</p>
            </div>
          </div>
        )}

        {/* Model Detail Panel - Full width, no backdrop */}
        {selectedModelId && selectedModelData && (
          <div className="h-full">
            <ModelDetailPanel
              model={selectedModelData}
              onClose={goBack}
              onContact={async (modelId, chatId) => {
                if (chatId) {
                  // Model is now contacted - switch to chats view
                  setActiveChat(chatId);
                  setViewMode("chats");
                  setSelectedModel(null);
                }
              }}
              onDelete={() => {
                // Model deleted - close panel and refresh
                setSelectedModel(null);
                // Optionally refresh the model list
                window.location.reload();
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // Chats view - empty state
  if (viewMode === "chats" && !activeChatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">Select a chat to start messaging</p>
          <p className="text-sm text-gray-600">Click on a chat from the left panel</p>
        </div>
      </div>
    );
  }

  // Chat view - New Interface
  if (viewMode === "chats" && activeChatId) {
    return (
      <ChatInterface chatId={activeChatId} />
    );
  }

  return null;
}
