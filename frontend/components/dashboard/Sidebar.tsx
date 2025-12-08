"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Settings, Sparkles } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="flex h-full flex-col px-4 py-6">
      {/* Brand Header */}
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20">
          <span className="text-xs font-bold text-white">AI</span>
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-white">AI Scout</div>
          <div className="text-[10px] text-slate-400 font-medium">Agency Dashboard</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        <NavItem
          href="/dashboard"
          icon={<Home size={18} />}
          label="Overview"
          active={isActive("/dashboard")}
        />
        <NavItem
          href="/dashboard/models"
          icon={<Users size={18} />}
          label="Models"
          active={isActive("/dashboard/models")}
        />
        <NavItem
          href="/dashboard/settings"
          icon={<Settings size={18} />}
          label="Settings"
          active={isActive("/dashboard/settings")}
        />
      </nav>

      {/* Footer / User Info */}
      <div className="mt-auto pt-6 border-t border-slate-800/50">
        <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800/50 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-[10px] font-bold">
            AG
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">Agency Admin</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 group relative overflow-hidden ${active
          ? "bg-slate-800/50 text-white shadow-[0_0_20px_rgba(124,58,237,0.15)] border border-slate-700/50"
          : "text-slate-400 hover:text-white hover:bg-slate-800/30"
        }`}
    >
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full" />
      )}
      <span className={`relative z-10 transition-colors ${active ? "text-purple-400" : "group-hover:text-purple-300"}`}>{icon}</span>
      <span className="text-xs font-medium relative z-10">{label}</span>

      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-50" />
      )}
    </Link>
  )
}
