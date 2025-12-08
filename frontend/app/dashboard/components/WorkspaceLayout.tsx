"use client";

import { ReactNode, useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";
import TopBar from "./TopBar";
import { Menu } from "lucide-react";

interface WorkspaceLayoutProps {
  children?: ReactNode;
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const { viewMode } = useWorkspace();
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);

  // Show left panel for both Applications, Chats and Favorites views
  const showLeftPanel = viewMode === "chats" || viewMode === "applications" || viewMode === "favorites";

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Main Workspace Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay */}
        {showLeftPanel && leftPanelOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setLeftPanelOpen(false)}
          />
        )}

        {/* Left Panel - Shown for Applications and Chats views */}
        {showLeftPanel && (
          <div
            className={`${leftPanelOpen ? "translate-x-0" : "-translate-x-full"
              } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 border-r border-slate-800/50 bg-[#0B0F19]/60 backdrop-blur-xl transition-transform duration-300`}
          >
            <LeftPanel onClose={() => setLeftPanelOpen(false)} />
          </div>
        )}

        {/* Center Panel - Model Detail / Chat Window / Pipeline */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {/* Mobile menu button */}
          {showLeftPanel && (
            <button
              onClick={() => setLeftPanelOpen(true)}
              className="lg:hidden absolute top-4 left-4 z-30 p-2 bg-slate-900/80 text-white rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
            >
              <Menu size={20} />
            </button>
          )}

          {/* Content Area - Scrollable */}
          {/* Remove padding for chats view to allow full-width design */}
          <div className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent ${viewMode === 'chats' ? '' : 'p-4 sm:p-6'}`}>
            <CenterPanel />
          </div>
        </div>

        {/* Right Panel - Profile / Info (optional, slides in) */}
        {/* Only show global RightPanel if NOT in chats view (Chats handles its own profile panel) */}
        {viewMode !== 'chats' && <RightPanel />}
      </div>
    </div>
  );
}
