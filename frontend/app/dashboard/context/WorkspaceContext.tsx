"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ViewMode = "home" | "applications" | "chats" | "analytics" | "favorites";

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

  // Initialize state from URL params
  const [state, setState] = useState<WorkspaceState>(() => {
    // Initialize from URL params on mount
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
    } else if (view === "home") {
      mappedView = "home";
    } else if (view) {
      // mappedView = view as ViewMode; // Fallback
    }

    return {
      viewMode: mappedView,
      selectedModelId: model ? parseInt(model) : null,
      activeChatId: chat ? parseInt(chat) : null,
      showRightPanel: false,
      searchQuery: search || "",
      selectedTab: tab || (mappedView === "applications" ? "all" : "all"),
      showArchived: false,
      sortBy: "id",
      sortOrder: "desc",
    };
  });

  // Sync state with URL params when they change (e.g., from sidebar navigation)
  useEffect(() => {
    const view = searchParams.get("view");
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
      } else if (view === "home") {
        mappedView = "home";
      }
    }

    // Update state if it differs from URL (handles Back button AND explicit navigation consistency)
    if (state.viewMode !== mappedView) {
      // If we are already on home and URL is empty, this is fine.
      // If we are on applications and URL becomes empty (Back button), this switches us to home.
      // If we click Home button:
      // 1. setViewMode('home') -> state=home
      // 2. URL updates to ""
      // 3. Effect runs. mappedView=home. state=home. No change. Correct.
      setState((prev) => ({
        ...prev,
        viewMode: mappedView,
        selectedModelId: null,
        activeChatId: null,
      }));
    }
  }, [searchParams, state.viewMode]);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.viewMode !== "home") params.set("view", state.viewMode); // Don't set view param for home (default)
    if (state.selectedModelId) params.set("model", state.selectedModelId.toString());
    if (state.activeChatId) params.set("chat", state.activeChatId.toString());
    if (state.searchQuery) params.set("search", state.searchQuery);

    const newUrl = `/dashboard${params.toString() ? `?${params.toString()}` : ""}`;
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [state, router]);

  const setViewMode = (mode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode: mode, selectedModelId: null, activeChatId: null }));
  };

  const setSelectedModel = (modelId: number | null) => {
    setState((prev) => ({ ...prev, selectedModelId: modelId, activeChatId: null }));
  };

  const setActiveChat = (chatId: number | null) => {
    setState((prev) => ({ ...prev, activeChatId: chatId, selectedModelId: null }));
  };

  const setShowRightPanel = (show: boolean) => {
    setState((prev) => ({ ...prev, showRightPanel: show }));
  };

  const setSearchQuery = (query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  };

  const setSelectedTab = (tab: string) => {
    setState((prev) => ({ ...prev, selectedTab: tab }));
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

