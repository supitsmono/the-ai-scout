"use client";

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import type { DashboardModel } from "../page";
import { CheckSquare, Square, Trash2, Heart, Download, Filter, MessageSquare } from "lucide-react";
import ModelCard from "./ModelCard";
import ModelFilter from "./ModelFilter";
import { motion, AnimatePresence } from "framer-motion";

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

  // Filter State
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{
    ageMin: number | null;
    ageMax: number | null;
    heightMin: number | null;
    heightMax: number | null;
    country: string | null;
  }>({
    ageMin: null,
    ageMax: null,
    heightMin: null,
    heightMax: null,
    country: null,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Caching State
  const modelsCache = useRef<Record<string, { models: DashboardModel[], page: number, hasMore: boolean, scrollTop: number }>>({});
  const ignorePageFetch = useRef(false);

  // Helper to generate cache key
  const getCacheKey = useCallback(() => {
    let aiCategory = "all";
    if (selectedTab === "perfectFit") aiCategory = "perfectFit";
    else if (selectedTab === "goodFit") aiCategory = "goodFit";
    else if (selectedTab === "lowPotential") aiCategory = "lowPotential";

    return JSON.stringify({
      ...filters,
      searchQuery,
      viewMode,
      aiCategory,
      isFavorites: viewMode === "favorites"
    });
  }, [selectedTab, filters, searchQuery, viewMode]);

  // --- RENDER-TIME STATE UPDATE PATTERN ---
  const currentKey = getCacheKey();
  const [lastKey, setLastKey] = useState(currentKey);

  if (currentKey !== lastKey) {
    setLastKey(currentKey);
    const cached = modelsCache.current[currentKey];

    if (cached) {
      setModels(cached.models);
      setPage(cached.page);
      setHasMore(cached.hasMore);
      setLoading(false);
      if (cached.page > 1) {
        ignorePageFetch.current = true;
      }
    } else {
      setModels([]);
      setPage(1);
      setHasMore(true);
      setLoading(true);
    }
  }
  // ---------------------------------------

  const saveScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const key = getCacheKey();
      if (!modelsCache.current[key]) {
        modelsCache.current[key] = { models, page, hasMore, scrollTop: 0 };
      }
      modelsCache.current[key].scrollTop = scrollContainerRef.current.scrollTop;
    }
  }, [getCacheKey, models, page, hasMore]);


  // Actions
  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === models.length) setSelectedItems(new Set());
    else setSelectedItems(new Set(models.map(m => m.id)));
  };

  // Load Chats
  useEffect(() => {
    if (viewMode === "chats") {
      let timeoutId: NodeJS.Timeout;
      const loadChats = async () => {
        setLoading(true);
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 10000);
        try {
          const res = await fetch(`${API_BASE}/chats`, { signal: controller.signal });
          if (res.ok) {
            const data = await res.json();
            const normalizedChats = (Array.isArray(data) ? data : []).map((chat: any) => {
              // Ensure photo structure
              if (chat.model?.photos && Array.isArray(chat.model.photos) && chat.model.photos.length > 0) {
                chat.model.photos = chat.model.photos.map((p: any, idx: number) => {
                  const type = typeof p === 'string' ? '' : (p.type || '');
                  const url = typeof p === 'string' ? p : (p.url || '');
                  const requiredTypes = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
                  return { url, type: type || requiredTypes[idx] || (idx === 4 ? "Hobby" : "") };
                });
              }
              return chat;
            });
            setChats(normalizedChats);
          } else {
            console.warn("Failed to load chats:", res.status);
            setChats([]);
          }
        } catch (err: any) {
          if (err.name !== 'AbortError') console.error("Error loading chats:", err);
          setChats([]);
        } finally {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      };
      loadChats();
      const interval = setInterval(loadChats, 10000);
      return () => { clearInterval(interval); if (timeoutId) clearTimeout(timeoutId); };
    } else {
      setChats([]);
      setLoading(false);
    }
  }, [viewMode]);

  // Load Models
  const loadModels = useCallback(async (pageNum: number) => {
    const key = getCacheKey();
    if (!hasMore && pageNum > 1) return;
    if (pageNum > 1) setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      let aiCategory: string | undefined;
      if (selectedTab === "perfectFit") aiCategory = "perfectFit";
      else if (selectedTab === "goodFit") aiCategory = "goodFit";
      else if (selectedTab === "lowPotential") aiCategory = "lowPotential";

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "30",
        sort_by: "id",
        sort_order: "desc",
      });

      if (searchQuery) params.set("search", searchQuery);
      if (viewMode === "favorites") params.set("status", "favorite");
      else if (aiCategory) params.set("ai_category", aiCategory);

      if (filters.ageMin !== null) params.set("age_min", filters.ageMin.toString());
      if (filters.ageMax !== null) params.set("age_max", filters.ageMax.toString());
      if (filters.heightMin !== null) params.set("height_min", filters.heightMin.toString());
      if (filters.heightMax !== null) params.set("height_max", filters.heightMax.toString());
      if (filters.country !== null) params.set("country", filters.country);

      const res = await fetch(`${API_BASE}/models?${params.toString()}`, { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        const transformedModels: DashboardModel[] = (data.models || []).map((m: any) => {
          let photos = [];
          if (m.photos && Array.isArray(m.photos) && m.photos.length > 0) {
            photos = m.photos.map((p: any, idx: number) => {
              const url = typeof p === 'string' ? p : (p.url || '');
              let type = typeof p === 'string' ? '' : (p.type || '');
              if (!type) {
                const requiredTypes = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
                type = requiredTypes[idx] || (idx === 4 ? "Hobby" : "");
              }
              return { url, type };
            });
          } else {
            photos = [
              { url: "https://images.pexels.com/photos/1921168/pexels-photo-1921168.jpeg", type: "Full Face" },
              { url: "https://images.pexels.com/photos/1559086/pexels-photo-1559086.jpeg", type: "Full Body" },
              { url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", type: "Side Profile" },
              { url: "https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg", type: "Hips to Head" },
              { url: "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg", type: "Hobby" },
              { url: "https://images.pexels.com/photos/2709563/pexels-photo-2709563.jpeg", type: "Editorial" },
              { url: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg", type: "Commercial" },
              { url: "https://images.pexels.com/photos/2836486/pexels-photo-2836486.jpeg", type: "Fashion" }
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

        const newHasMore = transformedModels.length >= 30;
        setModels(prev => {
          const newModels = pageNum === 1 ? transformedModels : [...prev, ...transformedModels];
          const currentCache = modelsCache.current[key];
          modelsCache.current[key] = {
            ...(currentCache || { scrollTop: 0 }),
            models: newModels,
            page: pageNum,
            hasMore: newHasMore
          };
          return newModels;
        });
        if (!newHasMore) setHasMore(false);
      } else {
        if (pageNum === 1) {
          setModels([]);
          modelsCache.current[key] = { models: [], page: 1, hasMore: false, scrollTop: 0 };
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError' && pageNum === 1 && loading && !modelsCache.current[key]?.models.length) {
        setModels([]);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [viewMode, selectedTab, searchQuery, filters, hasMore, getCacheKey, loading]);

  useLayoutEffect(() => {
    if (viewMode === "applications" || viewMode === "favorites") {
      const key = getCacheKey();
      const cached = modelsCache.current[key];

      if (cached) {
        if (cached.scrollTop > 0) {
          if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = cached.scrollTop;
        } else {
          if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
        }
        if (ignorePageFetch.current) {
          setTimeout(() => { ignorePageFetch.current = false; }, 200);
        }
      } else {
        if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
        loadModels(1);
      }
    }
  }, [viewMode, selectedTab, searchQuery, filters, getCacheKey]);

  useEffect(() => {
    if ((viewMode === "applications" || viewMode === "favorites") && page > 1) {
      if (!ignorePageFetch.current) loadModels(page);
    }
  }, [page, viewMode]);

  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const isLoadingMoreRef = useRef(false);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (container && !loading && hasMore && !isLoadingMoreRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollHeight - scrollTop - clientHeight < 300) {
          isLoadingMoreRef.current = true;
          setPage(prev => (prev < 1000 ? prev + 1 : prev));
          setTimeout(() => { isLoadingMoreRef.current = false; }, 500);
        }
      }
    }, 150);
  }, [loading, hasMore]);


  // --- CHATS VIEW (RESTORED) ---
  const filteredChats = chats.filter((chat: any) => {
    if (!searchQuery) return true;
    const modelName = chat.model?.name?.toLowerCase() || "";
    return modelName.includes(searchQuery.toLowerCase());
  });

  if (viewMode === "chats") {
    return (
      <div className="flex flex-col h-full bg-linear-to-b from-[#0A0D14] to-[#050608] border-r border-white/5">
        <div className="px-4 py-4 flex items-center justify-between border-b border-white/5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare size={16} /> Direct Messages
          </h2>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        >
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 w-full bg-white/5 rounded-lg animate-pulse mb-1" />
            ))
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageSquare size={32} className="text-gray-600 mb-3" />
              <p className="text-sm text-gray-500">No active chats</p>
            </div>
          ) : (
            filteredChats.map((chat: any) => {
              const isActive = activeChatId === chat.id;
              const unreadCount = chat.unread_count || 0;
              const hasUnread = unreadCount > 0;

              const findProfilePhoto = () => {
                if (!chat.model?.photos || !Array.isArray(chat.model.photos) || chat.model.photos.length === 0) {
                  return "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";
                }
                const fullFacePhoto = chat.model.photos.find((p: any) => {
                  const photo = typeof p === 'string' ? { url: p, type: '' } : p;
                  const type = (photo.type || '').toLowerCase();
                  return type === 'full face' || type.includes('full face') || type.includes('headshot');
                });

                if (fullFacePhoto) {
                  return typeof fullFacePhoto === 'string' ? fullFacePhoto : fullFacePhoto.url;
                }

                const firstPhoto = chat.model.photos[0];
                return typeof firstPhoto === 'string' ? firstPhoto : firstPhoto.url;
              };

              const avatarPhoto = findProfilePhoto();
              const lastMessage = chat.last_message || "No messages yet";
              const truncatedMessage = lastMessage.length > 40 ? lastMessage.substring(0, 40) + "..." : lastMessage;

              return (
                <div
                  key={chat.id}
                  onClick={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (activeChatId !== chat.id) { setActiveChat(chat.id); onClose?.(); }
                  }}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all border ${isActive ? "bg-slate-800/60 border-slate-600/70 shadow-md" : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"}`}
                >
                  <div className="relative w-12 h-12 shrink-0">
                    <img src={avatarPhoto} className={`w-12 h-12 rounded-full object-cover border-2 ${isActive ? "border-slate-500/60" : "border-white/10"}`} alt={chat.model?.name || "Avatar"} />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${isActive ? "border-slate-800/60" : "border-[#0A0D14]"} bg-emerald-500`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-gray-200"}`}>{chat.model?.name || "Unknown"}</h3>
                      {hasUnread && !isActive && (
                        <div className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-cyan-600 text-white text-[10px] font-bold">{unreadCount > 99 ? "99+" : unreadCount}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-gray-500">
                      {chat.model?.age && <><span className="font-medium">{chat.model.age}y</span><span className="w-0.5 h-0.5 bg-gray-600 rounded-full" /></>}
                      {chat.model?.height_cm && <><span className="font-medium">{chat.model.height_cm}cm</span><span className="w-0.5 h-0.5 bg-gray-600 rounded-full" /></>}
                      {chat.model?.country && <span className="truncate">{chat.model.country}</span>}
                    </div>
                    <p className={`text-xs truncate ${isActive ? "text-gray-300" : "text-gray-500"}`}>{truncatedMessage}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  // --- MODELS VIEW (Using cached state, no exit animations, useLayoutEffect for scroll) ---
  const tabs = [
    { key: "all", label: "All" },
    { key: "perfectFit", label: "Perfect" },
    { key: "goodFit", label: "Good" },
    { key: "lowPotential", label: "Low" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0B0F19]/60 backdrop-blur-xl relative overflow-hidden">
      <div className="flex-none p-4 border-b border-slate-700/50 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-white">{viewMode === "favorites" ? "My Favorites" : "Applications"}</h2>
          <div className="flex items-center gap-2">
            {viewMode === "applications" && (
              <button onClick={() => setFilterOpen(true)} className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${(filters.ageMin !== null || filters.ageMax !== null || filters.heightMin !== null || filters.heightMax !== null || filters.country !== null) ? "bg-cyan-600 text-white border-cyan-500" : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"}`}><Filter size={12} /> Filter</button>
            )}
            <button onClick={() => { setSelectionMode(!selectionMode); setSelectedItems(new Set()); }} className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${selectionMode ? "bg-purple-600 text-white border-purple-500" : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"}`}>{selectionMode ? "Cancel" : "Select"}</button>
          </div>
        </div>

        {viewMode === "applications" && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-nowrap">
            {tabs.map((tab) => {
              const isActive = selectedTab === tab.key;
              const getTabStyles = () => {
                if (!isActive) return "bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300";

                switch (tab.key) {
                  case "perfectFit": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                  case "goodFit": return "bg-blue-500/10 text-blue-400 border-blue-500/20"; // Changed cyan to blue
                  case "lowPotential": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
                  default: return "bg-white text-black border-white"; // All tab
                }
              };

              return (
                <motion.button
                  key={tab.key}
                  onClick={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (selectedTab !== tab.key) {
                      saveScrollPosition();
                      setSelectedTab(tab.key);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all border shrink-0 ${getTabStyles()}`}
                >
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        )}

        {selectionMode && (<div className="flex items-center gap-2 px-1"><button onClick={selectAll} className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors">{selectedItems.size === models.length && models.length > 0 ? <CheckSquare size={14} className="text-cyan-400" /> : <Square size={14} />} Select All Loaded</button><div className="ml-auto text-xs text-cyan-400 font-bold">{selectedItems.size} selected</div></div>)}
      </div>

      <div ref={scrollContainerRef} onScroll={handleScroll} onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent hover:scrollbar-thumb-slate-600/50 transition-colors pb-20">
        {models.length === 0 && !loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-slate-600 text-xs">No models found</motion.div>
        ) : (
          models.map((model, index) => (
            <ModelCard key={model.id} model={model} index={index} isSelected={selectedItems.has(model.id)} isActive={selectedModelId === model.id && !selectionMode} selectionMode={selectionMode} selectedTab={selectedTab} onSelect={() => toggleSelection(model.id)} onClick={() => { if (!selectionMode && selectedModelId !== model.id) { setSelectedModel(model.id); onClose?.(); } }} />
          ))
        )}

        {loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-6 flex flex-col items-center gap-2">
            <div className="flex gap-1">{[0, 1, 2].map((i) => (<motion.div key={i} className="w-2 h-2 rounded-full bg-cyan-500" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />))}</div>
            <span className="text-[10px] text-slate-500">Loading more talent...</span>
          </motion.div>
        )}

        {!hasMore && models.length > 0 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 text-center text-[10px] text-slate-600">All {models.length} models loaded</motion.div>}
      </div>

      <AnimatePresence>
        {selectionMode && selectedItems.size > 0 && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="absolute bottom-4 left-4 right-4 bg-slate-900/98 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl p-3 flex justify-between items-center z-20">
            <div className="flex gap-1.5">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2.5 hover:bg-emerald-500/20 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors border border-transparent hover:border-emerald-500/30" title="Mark as Favorite"><Heart size={16} /></motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2.5 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30" title="Archive Selected"><Trash2 size={16} /></motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2.5 hover:bg-cyan-500/20 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/30" title="Export CSV"><Download size={16} /></motion.button>
            </div>
            <div className="h-6 w-px bg-slate-700/50 mx-2" />
            <div className="flex items-center gap-3"><span className="text-xs text-slate-400 font-medium"><span className="text-cyan-400 font-bold">{selectedItems.size}</span> selected</span><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 bg-cyan-600 text-white text-xs font-bold rounded-lg hover:bg-cyan-500 transition-all border border-cyan-500/30">Apply Action</motion.button></div>
          </motion.div>
        )}
      </AnimatePresence>

      {viewMode === "applications" && (
        <ModelFilter open={filterOpen} onOpenChange={setFilterOpen} filters={filters} onFiltersChange={setFilters} />
      )}
    </div>
  );
}
