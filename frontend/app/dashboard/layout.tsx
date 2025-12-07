"use client";

import Sidebar from "@/components/layout/Sidebar";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import WorkspaceLayout from "./components/WorkspaceLayout";
import KeyboardShortcuts from "./components/KeyboardShortcuts";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <KeyboardShortcuts />
      <div className="flex h-screen w-screen bg-black text-white">
        {/* SIDEBAR (fixed width) */}
        <aside className="w-64 h-full border-r border-white/10">
          <Sidebar />
        </aside>

        {/* MAIN WORKSPACE AREA */}
        <main className="flex-1 overflow-hidden">
          <WorkspaceLayout />
        </main>
      </div>
    </WorkspaceProvider>
  );
}
