"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ViewMode = "applications" | "chats" | "analytics";

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
    let mappedView: ViewMode = "applications";
    if (view === "pipeline" || view === "models") {
      mappedView = "applications";
    } else if (view === "chats") {
      mappedView = "chats";
    } else if (view === "analytics") {
      mappedView = "analytics";
    } else if (view) {
      mappedView = view as ViewMode;
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
    if (view) {
      let mappedView: ViewMode = "applications";
      if (view === "pipeline" || view === "models") {
        mappedView = "applications";
      } else if (view === "chats") {
        mappedView = "chats";
      } else if (view === "analytics") {
        mappedView = "analytics";
      } else {
        mappedView = view as ViewMode;
      }
      
      if (state.viewMode !== mappedView) {
        setState((prev) => ({
          ...prev,
          viewMode: mappedView,
          selectedModelId: null,
          activeChatId: null,
        }));
      }
    }
  }, [searchParams, state.viewMode]);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.viewMode !== "applications") params.set("view", state.viewMode);
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

