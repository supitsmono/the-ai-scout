"use client";

import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-black text-white">

      {/* SIDEBAR (fixed width) */}
      <aside className="w-64 h-full">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>

    </div>
  );
}
