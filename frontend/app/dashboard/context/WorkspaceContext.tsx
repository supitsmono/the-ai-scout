"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ViewMode = "home" | "applications" | "chats" | "analytics" | "favorites" | "settings";

interface WorkspaceState {
  viewMode: ViewMode;
  selectedModelId: number | null;
  activeChatId: number | null;
  showRightPanel: boolean;
  searchQuery: string;
  selectedTab: string;
  showArchived: boolean;
  sortBy: string;
  sortOrder: string;
}

interface WorkspaceContextType extends WorkspaceState {
  setViewMode: (mode: ViewMode) => void;
  setSelectedModel: (modelId: number | null) => void;
  setActiveChat: (chatId: number | null) => void;
  setViewModeAndChat: (mode: ViewMode, chatId: number | null) => void;
  setShowRightPanel: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTab: (tab: string) => void;
  setShowArchived: (show: boolean) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  goBack: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

function WorkspaceProviderInner({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state - don't use searchParams in useState initializer (SSR issue)
  const [state, setState] = useState<WorkspaceState>(() => {
    // Default state - will be updated in useEffect
    return {
      viewMode: "home",
      selectedModelId: null,
      activeChatId: null,
      showRightPanel: false,
      searchQuery: "",
      selectedTab: "all",
      showArchived: false,
      sortBy: "id",
      sortOrder: "desc",
    };
  });

  // Initialize from URL params on mount (client-side only)
  useEffect(() => {
    const view = searchParams.get("view");
    const model = searchParams.get("model");
    const chat = searchParams.get("chat");
    const search = searchParams.get("search");
    const tab = searchParams.get("tab");

    // Map old view modes to new ones for backward compatibility
    let mappedView: ViewMode = "home"; // Default to home
    if (view === "pipeline" || view === "models" || view === "applications") {
      mappedView = "applications";
    } else if (view === "chats") {
      mappedView = "chats";
    } else if (view === "analytics") {
      mappedView = "analytics";
    } else if (view === "favorites") {
      mappedView = "favorites";
    } else if (view === "settings") {
      mappedView = "settings";
    } else if (view === "home") {
      mappedView = "home";
    }

    setState((prev) => ({
      ...prev,
      viewMode: mappedView,
      selectedModelId: model ? parseInt(model) : null,
      activeChatId: chat ? parseInt(chat) : null,
      searchQuery: search || "",
      selectedTab: tab || (mappedView === "applications" ? "all" : "all"),
    }));
  }, [searchParams]);

  // Sync state with URL params when they change (e.g., from sidebar navigation)
  // This handles browser back/forward buttons
  useEffect(() => {
    const view = searchParams.get("view");
    const model = searchParams.get("model");
    const chat = searchParams.get("chat");
    const search = searchParams.get("search");
    const tab = searchParams.get("tab");
    
    let mappedView: ViewMode = "home"; // Default to home if no param

    if (view) {
      if (view === "pipeline" || view === "models" || view === "applications") {
        mappedView = "applications";
      } else if (view === "chats") {
        mappedView = "chats";
      } else if (view === "analytics") {
        mappedView = "analytics";
      } else if (view === "favorites") {
        mappedView = "favorites";
      } else if (view === "settings") {
        mappedView = "settings";
      } else if (view === "home") {
        mappedView = "home";
      }
    }

    // Only update state if URL actually changed (prevents loops)
    setState((prev) => {
      if (prev.viewMode === mappedView && 
          prev.selectedModelId === (model ? parseInt(model) : null) &&
          prev.activeChatId === (chat ? parseInt(chat) : null) &&
          prev.searchQuery === (search || "") &&
          prev.selectedTab === (tab || (mappedView === "applications" ? "all" : "all"))) {
        return prev; // No changes needed
      }
      
      return {
        ...prev,
        viewMode: mappedView,
        selectedModelId: model ? parseInt(model) : null,
        activeChatId: chat ? parseInt(chat) : null,
        searchQuery: search || "",
        selectedTab: tab || (mappedView === "applications" ? "all" : "all"),
        showRightPanel: prev.viewMode !== mappedView ? false : prev.showRightPanel, // Close right panel when view changes via URL
      };
    });
  }, [searchParams]);

  // Update URL when state changes - debounced to prevent race conditions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (state.viewMode !== "home") params.set("view", state.viewMode); // Don't set view param for home (default)
      if (state.selectedModelId) params.set("model", state.selectedModelId.toString());
      if (state.activeChatId) params.set("chat", state.activeChatId.toString());
      if (state.searchQuery) params.set("search", state.searchQuery);

      const newUrl = `/dashboard${params.toString() ? `?${params.toString()}` : ""}`;
      const currentUrl = typeof window !== 'undefined' 
        ? window.location.pathname + window.location.search 
        : '/dashboard';
      if (currentUrl !== newUrl) {
        router.replace(newUrl, { scroll: false });
      }
    }, 50); // Small delay to batch rapid state changes

    return () => clearTimeout(timeoutId);
  }, [state, router]);

  const setViewMode = (mode: ViewMode) => {
    // Always update to ensure navigation works, even if already on that view
    setState((prev) => {
      // Only update if actually different to prevent unnecessary re-renders
      if (prev.viewMode === mode) return prev;
      // Close right panel when navigating away from chats
      return { 
        ...prev, 
        viewMode: mode, 
        selectedModelId: null, 
        activeChatId: null,
        showRightPanel: false // Always close right panel when changing views
      };
    });
  };

  const setSelectedModel = (modelId: number | null) => {
    setState((prev) => ({ ...prev, selectedModelId: modelId, activeChatId: null }));
  };

  const setActiveChat = (chatId: number | null) => {
    setState((prev) => {
      // Only close right panel if switching to a different chat
      const shouldClosePanel = prev.activeChatId !== null && prev.activeChatId !== chatId;
      return { 
        ...prev, 
        activeChatId: chatId, 
        selectedModelId: null,
        showRightPanel: shouldClosePanel ? false : prev.showRightPanel
      };
    });
  };

  const setViewModeAndChat = (mode: ViewMode, chatId: number | null) => {
    setState((prev) => ({
      ...prev,
      viewMode: mode,
      activeChatId: chatId,
      selectedModelId: null,
      showRightPanel: false,
    }));
  };

  const setShowRightPanel = (show: boolean) => {
    setState((prev) => ({ ...prev, showRightPanel: show }));
  };

  const setSearchQuery = (query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  };

  const setSelectedTab = (tab: string) => {
    // Direct state update without URL sync for immediate response
    setState((prev) => {
      if (prev.selectedTab === tab) return prev; // Prevent unnecessary updates
      return { ...prev, selectedTab: tab };
    });
  };

  const setShowArchived = (show: boolean) => {
    setState((prev) => ({ ...prev, showArchived: show }));
  };

  const setSortBy = (sortBy: string) => {
    setState((prev) => ({ ...prev, sortBy }));
  };

  const setSortOrder = (sortOrder: string) => {
    setState((prev) => ({ ...prev, sortOrder }));
  };

  const goBack = () => {
    if (state.activeChatId) {
      setActiveChat(null);
    } else if (state.selectedModelId) {
      setSelectedModel(null);
    } else if (state.viewMode !== "applications") {
      setViewMode("applications");
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        ...state,
        setViewMode,
        setSelectedModel,
        setActiveChat,
        setViewModeAndChat,
        setShowRightPanel,
        setSearchQuery,
        setSelectedTab,
        setShowArchived,
        setSortBy,
        setSortOrder,
        goBack,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkspaceProviderInner>{children}</WorkspaceProviderInner>
    </Suspense>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

