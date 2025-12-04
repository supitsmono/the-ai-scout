"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/incoming", label: "Incoming" },
  { href: "/dashboard/shortlisted", label: "Shortlisted" },
  { href: "/dashboard/contacted", label: "Contacted" },
  { href: "/dashboard/scouted", label: "Scouted" },
  { href: "/dashboard/archived", label: "Archived" },
];

export default function Sidebar({ activePath }: { activePath: string | null }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen border-r border-neutral-800 bg-black/60 backdrop-blur-2xl transition-all duration-300 ease-out flex flex-col ${collapsed ? "w-16" : "w-64"}`}
    >
      <div className="flex items-center justify-between px-4 h-14 border-b border-neutral-800">
        {!collapsed && (
          <div className="font-semibold text-sm tracking-tight">
            The AI Scout
          </div>
        )}
        <button
          className="text-xs text-neutral-500 hover:text-neutral-200 transition"
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = activePath?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mx-2 flex items-center rounded-xl px-3 py-2 text-xs transition-all ${
                active
                  ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/50"
                  : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/80"
              }`}
            >
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
