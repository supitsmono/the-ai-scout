"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import ModelCard from "../ModelCard";
import ChatListItem from "../../chats/components/ChatListItem";
import type { DashboardModel } from "../page";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface LeftPanelProps {
  onClose?: () => void;
}

export default function LeftPanel({ onClose }: LeftPanelProps) {
  const { viewMode, selectedModelId, activeChatId, setSelectedModel, setActiveChat, searchQuery, selectedTab, setSelectedTab } = useWorkspace();
  const [chats, setChats] = useState([]);
  const [models, setModels] = useState<DashboardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load chats
  useEffect(() => {
    if (viewMode === "chats") {
      const loadChats = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${API_BASE}/chats`);
          if (res.ok) {
            const data = await res.json();
            setChats(data);
          }
        } catch (err) {
          console.error("Error loading chats:", err);
        } finally {
          setLoading(false);
        }
      };
      loadChats();
      
      const interval = setInterval(loadChats, 10000);
      return () => clearInterval(interval);
    } else {
      // Reset chats when not in chats view
      setChats([]);
    }
  }, [viewMode]);

  // Load models for applications view
  useEffect(() => {
    if (viewMode === "applications") {
      const loadModels = async () => {
        setLoading(true);
        try {
          let aiCategory: string | undefined;
          
          if (selectedTab === "perfectFit") {
            aiCategory = "perfectFit";
          } else if (selectedTab === "goodFit") {
            aiCategory = "goodFit";
          } else if (selectedTab === "lowPotential") {
            aiCategory = "lowPotential";
          }

          const params = new URLSearchParams({
            page: "1",
            limit: "100",
            sort_by: "id",
            sort_order: "desc",
          });

          if (searchQuery) params.set("search", searchQuery);
          // Backend filters on both ai_category and status when ai_category is provided
          if (aiCategory) params.set("ai_category", aiCategory);

          const res = await fetch(`${API_BASE}/models?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            const transformedModels: DashboardModel[] = data.models.map((m: any) => {
              // Normalize photos - ensure they have type labels
              let photos = [];
              if (m.photos && Array.isArray(m.photos) && m.photos.length > 0) {
                photos = m.photos.map((p: any, idx: number) => {
                  if (typeof p === "string") {
                    const types = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
                    return { url: p, type: types[idx] || "Photo" };
                  }
                  if (!p.type) {
                    const types = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
                    p.type = types[idx] || "Photo";
                  }
                  return p;
                });
              } else {
                photos = [
                  { url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg", type: "Full Face" },
                  { url: "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg", type: "Full Body" },
                  { url: "https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg", type: "Side Profile" },
                ];
              }
              
              return {
                id: m.id,
                name: m.name,
                age: m.age || 0,
                height: m.height_cm || m.height || 0,
                country: m.country || "Unknown",
                photos: photos,
                measurements: { bust: 82, waist: 60, hips: 90 },
                motivation: "Passionate about modeling and ready to work.",
                status: (m.status || m.ai_category || "active") as any,
                aiCategory: m.ai_category || m.status || null,
                aiReasons: m.ai_reasons || null,
              };
            });
            setModels(transformedModels);
          }
        } catch (err) {
          console.error("Error loading models:", err);
        } finally {
          setLoading(false);
        }
      };

      loadModels();
      const interval = setInterval(loadModels, 30000);
      return () => clearInterval(interval);
    } else {
      // Reset models when not in applications view
      setModels([]);
    }
  }, [viewMode, selectedTab, searchQuery]);

  // Filter chats by search query
  const filteredChats = chats.filter((chat: any) => {
    if (!searchQuery) return true;
    const modelName = chat.model?.name?.toLowerCase() || "";
    return modelName.includes(searchQuery.toLowerCase());
  });

  // Chats view - show only contacted models in compact list
  if (viewMode === "chats") {
    return (
      <div className="flex flex-col h-full bg-[#050505]">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white">Chats</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {chats.length > 0 && (
            <p className="text-xs text-gray-500">
              {chats.length} conversation{chats.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Chat List - Ultra Compact */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-gray-400 text-sm py-8 text-center">Loading chats...</div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-2">
                <svg className="w-12 h-12 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-white">No chats yet</p>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery ? `No matches for "${searchQuery}"` : "Contact a model to start chatting"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredChats.map((chat: any) => {
                const model = chat.model;
                const modelPhoto = model?.photos?.[0]?.url || 
                  (typeof model?.photos?.[0] === 'string' ? model.photos[0] : null) ||
                  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";
                
                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setActiveChat(chat.id);
                      onClose?.();
                    }}
                    className={`group flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-white/5 ${
                      activeChatId === chat.id ? "bg-purple-600/10 border-l-2 border-purple-600 pl-[14px]" : "border-l-2 border-transparent"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-10 h-10 shrink-0">
                      <img
                        src={modelPhoto}
                        alt={model?.name || "Model"}
                        className="w-full h-full rounded-full object-cover border border-white/10"
                      />
                      {chat.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 bg-purple-600 rounded-full w-4 h-4 flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold">{chat.unread_count > 9 ? "9+" : chat.unread_count}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className={`font-medium truncate text-sm ${activeChatId === chat.id ? "text-purple-400" : "text-white group-hover:text-purple-400 transition-colors"}`}>
                          {model?.name || "Unknown"}
                        </h3>
                        {chat.last_message && (
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {new Date(chat.last_message_time || chat.updated_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
                          </span>
                        )}
                      </div>
                      
                      {chat.last_message && (
                        <p className="text-xs text-gray-400 truncate">
                          {chat.last_message.length > 50 ? chat.last_message.substring(0, 50) + "..." : chat.last_message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Applications view - Compact model list with tabs
  if (viewMode === "applications") {

    const tabs = [
      { key: "all", label: "All" },
      { key: "perfectFit", label: "Perfect Fit" },
      { key: "goodFit", label: "Good Fit" },
      { key: "lowPotential", label: "Low Potential" },
    ];

    return (
      <div className="flex flex-col h-full bg-[#050505]">
        {/* Header with Tabs */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Applications</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTab === tab.key
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Model List */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-gray-400 text-sm py-8 text-center">Loading models...</div>
          ) : models.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No models found</p>
              {searchQuery && <p className="text-xs text-gray-600 mt-1">Try a different search</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {models.map((model) => {
                const photoUrl = model.photos?.[0]?.url || 
                  (typeof model.photos?.[0] === 'string' ? model.photos[0] : null) ||
                  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";
                
                // AI category color indicator
                const categoryColor = 
                  model.aiCategory === "perfectFit" ? "bg-green-500" :
                  model.aiCategory === "goodFit" ? "bg-yellow-500" :
                  model.aiCategory === "lowPotential" ? "bg-red-500" : "bg-gray-500";

                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      onClose?.();
                    }}
                    className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-white/5 ${
                      selectedModelId === model.id ? "bg-purple-600/10 border border-purple-500/30" : "border border-transparent"
                    }`}
                  >
                    {/* Photo */}
                    <div className="relative w-16 h-20 shrink-0 rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={photoUrl}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                      {/* AI Category Indicator */}
                      <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${categoryColor}`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm text-white truncate min-w-0">
                          {model.name}
                        </h3>
                        {/* AI Category Badge - show in All tab */}
                        {selectedTab === "all" && model.aiCategory && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap shrink-0 ${
                            model.aiCategory === "perfectFit" ? "bg-green-500/20 text-green-400" :
                            model.aiCategory === "goodFit" ? "bg-yellow-500/20 text-yellow-400" :
                            model.aiCategory === "lowPotential" ? "bg-red-500/20 text-red-400" :
                            "bg-gray-500/20 text-gray-400"
                          }`}>
                            {model.aiCategory === "perfectFit" ? "Perfect Fit" :
                             model.aiCategory === "goodFit" ? "Good Fit" :
                             model.aiCategory === "lowPotential" ? "Low Potential" :
                             model.aiCategory}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 text-xs text-gray-400">
                        <span>{model.country}</span>
                        <span>{model.age} y/o • {model.height} cm</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

