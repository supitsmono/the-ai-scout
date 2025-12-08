"use client";

import Sidebar from "@/components/layout/Sidebar";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import WorkspaceLayout from "./components/WorkspaceLayout";
import KeyboardShortcuts from "./components/KeyboardShortcuts";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <KeyboardShortcuts />
      <div className="flex h-screen w-full min-w-0 bg-[#050816] text-white relative overflow-hidden">
        {/* Ambient background used in Apply Page */}
        <div className="pointer-events-none absolute inset-0 z-0 
          bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_60%),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.12),transparent_50%)]"
        />

        {/* SIDEBAR (fixed width) */}
        <aside className="w-64 h-full border-r border-slate-800/50 relative z-20 bg-[#0B0F19]/40 backdrop-blur-xl shrink-0">
          <Sidebar />
        </aside>

        {/* MAIN WORKSPACE AREA */}
        <main className="flex-1 min-w-0 overflow-hidden relative z-10">
          <WorkspaceLayout />
        </main>
      </div>
    </WorkspaceProvider>
  );
}
