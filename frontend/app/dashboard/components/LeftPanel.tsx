"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import type { DashboardModel } from "../page";
import { CheckSquare, Square, Trash2, Heart, Download, MoreHorizontal, Filter, Layers, Sparkles } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface LeftPanelProps {
  onClose?: () => void;
}

export default function LeftPanel({ onClose }: LeftPanelProps) {
  const { viewMode, selectedModelId, activeChatId, setSelectedModel, setActiveChat, searchQuery, selectedTab, setSelectedTab } = useWorkspace();

  // Data State
  const [chats, setChats] = useState([]);
  const [models, setModels] = useState<DashboardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Selection State
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Toggle Selection
  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === models.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(models.map(m => m.id)));
    }
  };

  // Load chats (unchanged logic for now, but kept clean)
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
      setChats([]);
    }
  }, [viewMode]);

  // Load models for applications or favorites view (Infinite Scroll)
  useEffect(() => {
    if (viewMode === "applications" || viewMode === "favorites") {
      // Reset when these change
      setModels([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);
    }
  }, [viewMode, selectedTab, searchQuery]);

  const loadModels = useCallback(async (pageNum: number) => {
    if (!hasMore && pageNum > 1) return;

    try {
      let aiCategory: string | undefined;
      if (selectedTab === "perfectFit") aiCategory = "perfectFit";
      else if (selectedTab === "goodFit") aiCategory = "goodFit";
      else if (selectedTab === "lowPotential") aiCategory = "lowPotential";

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "20", // Smaller batches for infinite scroll
        sort_by: "id",
        sort_order: "desc",
      });

      if (searchQuery) params.set("search", searchQuery);
      if (viewMode === "favorites") {
        params.set("status", "favorite");
      } else if (aiCategory) {
        params.set("ai_category", aiCategory);
      }

      const res = await fetch(`${API_BASE}/models?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();

        // Transform
        const transformedModels: DashboardModel[] = data.models.map((m: any) => {
          // Robust Photo Generation logic
          let photos = [];
          if (m.photos && Array.isArray(m.photos) && m.photos.length > 0) {
            photos = m.photos.map((p: any) => typeof p === "string" ? { url: p, type: "Main" } : p);
          } else {
            // High-Quality Agency Mock Photos
            photos = [
              { url: "https://images.pexels.com/photos/1921168/pexels-photo-1921168.jpeg", type: "Portfolio Headshot" },
              { url: "https://images.pexels.com/photos/1559086/pexels-photo-1559086.jpeg", type: "Full Body" },
              { url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", type: "Polaroid (Natural)" },
              { url: "https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg", type: "Side Profile" },
            ];
          }

          return {
            id: m.id,
            name: m.name,
            age: m.age || 21,
            height: m.height_cm || m.height || 178,
            country: m.country || "France",
            photos: photos,
            measurements: { bust: 82, waist: 60, hips: 90 },
            motivation: "Passionate about high fashion and editorial work.",
            status: (m.status || m.ai_category || "active") as any,
            aiCategory: m.ai_category || m.status || "goodFit",
            aiReasons: m.ai_reasons || ["Symmetrical features", "Height requirement met", "Strong portfolio"],
          };
        });

        if (transformedModels.length < 20) {
          setHasMore(false);
        }

        setModels(prev => pageNum === 1 ? transformedModels : [...prev, ...transformedModels]);
      }
    } catch (err) {
      console.error("Error loading models:", err);
    } finally {
      setLoading(false);
    }
  }, [viewMode, selectedTab, searchQuery, hasMore]);

  // Trigger load on page change
  useEffect(() => {
    if (viewMode === "applications" || viewMode === "favorites") {
      loadModels(page);
    }
  }, [page, loadModels, viewMode]);

  // Infinite Scroll Handler
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 100 && !loading && hasMore) {
        setPage(prev => prev + 1);
      }
    }
  };

  // Chats filtering
  const filteredChats = chats.filter((chat: any) => {
    if (!searchQuery) return true;
    const modelName = chat.model?.name?.toLowerCase() || "";
    return modelName.includes(searchQuery.toLowerCase());
  });

  // Render Chats
  if (viewMode === "chats") {
    return (
      <div className="flex flex-col h-full bg-[#111] border-r border-[#1A1D21]">
        <div className="px-4 py-3 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
          <h2 className="text-sm font-bold text-slate-300 group-hover:text-white flex items-center gap-1">
            Direct Messages <span className="text-slate-500 font-normal">▼</span>
          </h2>
          {/* Mock Plus Button */}
          <button className="text-slate-500 hover:text-white"><Layers size={14} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-[1px] scrollbar-none">
          {loading ? (
            // Skeleton
            [1, 2, 3].map(i => <div key={i} className="h-7 w-full bg-white/5 rounded animate-pulse mb-1" />)
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-4 opacity-50"><p className="text-xs">No active chats</p></div>
          ) : (
            filteredChats.map((chat: any) => {
              const isActive = activeChatId === chat.id;
              const hasUnread = Math.random() > 0.8; // Mock unread

              return (
                <div
                  key={chat.id}
                  onClick={() => { setActiveChat(chat.id); onClose?.(); }}
                  className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all
                      ${isActive
                      ? "bg-[#1164A3] text-white" // Slack Active Blue
                      : "text-slate-400 hover:bg-[#1A1D21] hover:text-slate-200"
                    }`}
                >
                  {/* Status / Avatar */}
                  <div className="relative w-4 h-4 shrink-0">
                    <img
                      src={chat.model?.photos?.[0]?.url || chat.model?.photos?.[0] || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"}
                      className={`w-4 h-4 rounded-[4px] object-cover ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
                      alt="avatar"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 ${isActive ? "border-[#1164A3]" : "border-[#111]"} bg-emerald-500`} />
                  </div>

                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className={`text-[13px] truncate ${hasUnread && !isActive ? "font-bold text-white" : "font-normal"}`}>
                      {chat.model?.name || "Unknown"}
                    </span>
                    {hasUnread && !isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  // Render Applications with Bulk Actions
  const tabs = [
    { key: "all", label: "All" },
    { key: "perfectFit", label: "Perfect" },
    { key: "goodFit", label: "Good" },
    { key: "lowPotential", label: "Low" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0B0F19]/60 backdrop-blur-xl relative">
      {/* Header with Tabs & Selection Toggle */}
      <div className="flex-none p-4 border-b border-slate-700/50 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">
            {viewMode === "favorites" ? "My Favorites" : "Applications"}
          </h2>
          <button
            onClick={() => {
              setSelectionMode(!selectionMode);
              setSelectedItems(new Set());
            }}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${selectionMode ? "bg-purple-600 text-white border-purple-500" : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"}`}
          >
            {selectionMode ? "Cancel" : "Select"}
          </button>
        </div>

        {/* Tabs - Only show for applications view */}
        {viewMode === "applications" && (
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border ${selectedTab === tab.key
                  ? tab.key === "perfectFit" 
                    ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-900/30"
                    : tab.key === "goodFit"
                    ? "bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-900/30"
                    : tab.key === "lowPotential"
                    ? "bg-slate-600 text-white border-slate-500 shadow-lg shadow-slate-900/30"
                    : "bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/30"
                  : "bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-300 hover:bg-slate-800/50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Bulk Checkbox Header */}
        {selectionMode && (
          <div className="flex items-center gap-2 px-1">
            <button onClick={selectAll} className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors">
              {selectedItems.size === models.length && models.length > 0 ? <CheckSquare size={14} className="text-purple-400" /> : <Square size={14} />}
              Select All Loaded
            </button>
            <div className="ml-auto text-xs text-purple-400 font-bold">
              {selectedItems.size} selected
            </div>
          </div>
        )}
      </div>

      {/* Model List with Infinite Scroll */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pb-20"
      >
        {models.length === 0 && !loading ? (
          <div className="text-center py-12 text-slate-600 text-xs">No models found</div>
        ) : (
          models.map((model) => {
            const photoUrl = model.photos?.[0]?.url || "https://placehold.co/100";
            const isSelected = selectedItems.has(model.id);
            const isActive = selectedModelId === model.id && !selectionMode;

            // Match Score Mock
            const matchScore = model.aiCategory === "perfectFit" ? 98 : model.aiCategory === "goodFit" ? 85 : 60;
            const scoreColor = matchScore > 90 ? "text-emerald-400" : matchScore > 75 ? "text-amber-400" : "text-slate-400";
            const ringColor = matchScore > 90 ? "border-emerald-500/50" : matchScore > 75 ? "border-amber-500/50" : "border-slate-600/50";
            const scoreBg = matchScore > 90 ? "bg-emerald-500/10 border-emerald-500/30" : matchScore > 75 ? "bg-amber-500/10 border-amber-500/30" : "bg-slate-500/10 border-slate-500/30";

            return (
              <div
                key={model.id}
                onClick={() => {
                  if (selectionMode) toggleSelection(model.id);
                  else {
                    setSelectedModel(model.id);
                    onClose?.();
                  }
                }}
                className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 border
                  ${selectionMode && isSelected
                    ? "bg-purple-900/30 border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                    : isActive
                      ? "bg-[#1A1D21] border-purple-500/40 shadow-lg shadow-purple-900/10 scale-[1.02] ring-1 ring-purple-500/20"
                      : "bg-[#0F1115] border-[#1F2937] hover:bg-[#1A1D21] hover:border-slate-600/60 hover:scale-[1.01] hover:shadow-md"
                  }`}
              >
                {/* Selection Overlay/Checkbox */}
                {selectionMode && (
                  <div className="absolute top-3 right-3 z-10">
                    {isSelected
                      ? <CheckSquare size={16} className="text-purple-400 drop-shadow-md" />
                      : <Square size={16} className="text-slate-700" />}
                  </div>
                )}

                {/* Photo with Match Ring */}
                <div className={`relative w-14 h-14 shrink-0 rounded-lg p-[2px] border-2 ${ringColor}`}>
                  <div className="w-full h-full rounded-md overflow-hidden bg-slate-800 relative group-hover:brightness-110 transition-all">
                    <img src={photoUrl} className="w-full h-full object-cover" />
                  </div>
                  {/* Score Badge */}
                  <div className={`absolute -bottom-1 -right-1 ${scoreBg} text-[9px] font-bold px-1.5 py-0.5 rounded border backdrop-blur-sm ${scoreColor}`}>
                    {matchScore}%
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-sm font-bold truncate transition-colors ${isActive ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                      {model.name}
                    </h3>
                    {model.aiCategory === 'perfectFit' && !selectionMode && (
                      <div className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40 shadow-sm shadow-emerald-900/20">
                        <Sparkles size={8} /> TOP
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-[11px] font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                    <span>{model.age}y</span>
                    <span className="w-0.5 h-0.5 bg-slate-500 rounded-full" />
                    <span>{model.height}cm</span>
                    <span className="w-0.5 h-0.5 bg-slate-500 rounded-full" />
                    <span className="truncate">{model.country}</span>
                  </div>

                  {/* Quick Stat Tag */}
                  <div className="mt-2 flex">
                    <span className="text-[10px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded border border-white/10 group-hover:border-white/20 group-hover:text-slate-300 transition-colors truncate max-w-[120px]">
                      {model.motivation ? "Applied: " + model.motivation.substring(0, 15) + "..." : "New Applicant"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {loading && <div className="py-4 text-center text-[10px] text-slate-500 animate-pulse">Loading talent...</div>}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectionMode && selectedItems.size > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl p-2 flex justify-between items-center z-20 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="flex gap-1">
            <button className="p-2 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors" title="Mark Good Fit">
              <Heart size={16} />
            </button>
            <button className="p-2 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Archive">
              <Trash2 size={16} />
            </button>
            <button className="p-2 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-blue-400 transition-colors" title="Export CSV">
              <Download size={16} />
            </button>
          </div>
          <div className="h-4 w-[1px] bg-slate-700/50 mx-1" />
          <button className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-900/30">
            Action
          </button>
        </div>
      )}
    </div>
  );
}
