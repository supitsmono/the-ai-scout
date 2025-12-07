"use client";

import { ReactNode, useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";
import TopBar from "./TopBar";

interface WorkspaceLayoutProps {
  children?: ReactNode;
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const { viewMode } = useWorkspace();
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  
  // Show left panel for both Applications and Chats views
  const showLeftPanel = viewMode === "chats" || viewMode === "applications";

  return (
    <div className="flex flex-col h-full w-full bg-[#050505]">
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Main Workspace Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay */}
        {showLeftPanel && leftPanelOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setLeftPanelOpen(false)}
          />
        )}

        {/* Left Panel - Shown for Applications and Chats views */}
        {showLeftPanel && (
          <div
            className={`${
              leftPanelOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 border-r border-white/10 overflow-y-auto bg-[#050505] transition-transform duration-300`}
          >
            <LeftPanel onClose={() => setLeftPanelOpen(false)} />
          </div>
        )}

        {/* Center Panel - Model Detail / Chat Window / Pipeline */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Mobile menu button - show for Applications and Chats views */}
          {showLeftPanel && (
            <button
              onClick={() => setLeftPanelOpen(true)}
              className="lg:hidden fixed top-16 left-4 z-30 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <CenterPanel />
        </div>

        {/* Right Panel - Profile / Info (optional, slides in) */}
        <RightPanel />
      </div>
    </div>
  );
}

