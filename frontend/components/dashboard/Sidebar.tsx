"use client";

import Link from "next/link";
import { Home, Users, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-white/10 bg-slate-950/90 px-4 py-5">
      <div className="mb-8 text-sm font-semibold tracking-tight">
        AI Scout
      </div>

      <nav className="flex flex-1 flex-col gap-1 text-xs text-slate-300">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-800"
        >
          <Home size={16} />
          Overview
        </Link>
        <Link
          href="/dashboard/models"
          className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-800"
        >
          <Users size={16} />
          Models
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-800"
        >
          <Settings size={16} />
          Settings
        </Link>
      </nav>

      <div className="mt-4 border-t border-white/5 pt-3 text-[10px] text-slate-500">
        Logged in as agency
      </div>
    </aside>
  );
}

