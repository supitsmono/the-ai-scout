"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import ModelDetailPanel from "../ModelDetailPanel";
import ModelProfilePanel from "../../chats/[chatId]/components/ModelProfilePanel";
import ChatInterface from "./ChatInterface";
import DashboardHome from "./DashboardHome";
import Analytics from "./Analytics";
import Settings from "./Settings";
import type { DashboardModel } from "../page";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CenterPanel() {
  const { viewMode, selectedModelId, activeChatId, setActiveChat, setViewMode, setSelectedModel, setViewModeAndChat, goBack } = useWorkspace();
  const [selectedModelData, setSelectedModelData] = useState<DashboardModel | null>(null);

  // Load selected model (applications/favorites)
  useEffect(() => {
    if (selectedModelId && (viewMode === "applications" || viewMode === "favorites")) {
      const loadModel = async () => {
        try {
          const res = await fetch(`${API_BASE}/models/${selectedModelId}`);
          if (res.ok) {
            const m = await res.json();
            // Normalize photos and assign types
            let photos = [];
            if (m.photos && Array.isArray(m.photos) && m.photos.length > 0) {
              photos = m.photos.map((p: any, idx: number) => {
                if (typeof p === "string") {
                  // Assign types to first 4 photos (required photos)
                  const requiredTypes = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
                  return { url: p, type: requiredTypes[idx] || (idx === 4 ? "Hobby" : "") };
                }
                // If photo object exists but no type, assign based on index
                if (!p.type) {
                  const requiredTypes = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
                  p.type = requiredTypes[idx] || (idx === 4 ? "Hobby" : "");
                }
                return p;
              });
            } else {
              // Fallback photos if none exist
              photos = [
                { url: "https://images.pexels.com/photos/1921168/pexels-photo-1921168.jpeg", type: "Full Face" },
                { url: "https://images.pexels.com/photos/1559086/pexels-photo-1559086.jpeg", type: "Full Body" },
                { url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", type: "Side Profile" },
                { url: "https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg", type: "Hips to Head" },
              ];
            }

            const model: DashboardModel = {
              id: m.id,
              name: m.name,
              age: m.age || 0,
              height: m.height_cm || m.height || 0,
              country: m.country || "Unknown",
              photos: photos,
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

  // Settings View
  if (viewMode === "settings") {
    return <Settings />;
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
                  // Model is now contacted - switch to chats view and open the chat
                  setViewModeAndChat("chats", chatId);
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
