"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWorkspace } from "../../app/dashboard/context/WorkspaceContext";
import { Logo } from "@/components/logo";
import {
  LayoutGrid,
  Users,
  MessageSquare,
  Star,
  BarChart2,
  Settings,
  Bell,
  LogOut
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { viewMode, setViewMode } = useWorkspace();

  const [unreadCount, setUnreadCount] = useState(0);

  // Load unread count for chats
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const res = await fetch(`${API_BASE}/chats`);
        if (res.ok) {
          const chats = await res.json();
          const totalUnread = chats.reduce((sum: number, chat: any) => sum + (chat.unread_count || 0), 0);
          setUnreadCount(totalUnread);
        }
      } catch (err) {
        console.error("Error loading unread count:", err);
      }
    };

    loadUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (view: string) => {
    return viewMode === view;
  };

  const handleNavClick = (view: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Always update view mode - the check is handled in setViewMode if needed
    setViewMode(view);
  };

  return (
    <aside className="w-64 h-full bg-[#0A0A0A] border-r border-white/5 p-6 flex flex-col pt-8 shrink-0">

      <div className="mb-10 px-2">
        <Logo size="default" className="group" />
      </div>

      <div className="text-xs font-bold text-slate-500 mb-4 px-4 uppercase tracking-wider">Menu</div>

      <nav className="flex flex-col gap-1.5">
        <button
          onClick={(e) => handleNavClick("home", e)}
          className={`
            block w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
            ${isActive("home")
              ? "bg-white/10 text-white"
              : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}
          `}
        >
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-5 h-5 relative -top-px" />
            <span>Home</span>
          </div>
        </button>

        <button
          onClick={(e) => handleNavClick("applications", e)}
          className={`
            block w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
            ${isActive("applications")
              ? "bg-white/10 text-white"
              : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}
          `}
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 relative -top-px" />
            <span>Applications</span>
          </div>
        </button>

        <button
          onClick={(e) => handleNavClick("chats", e)}
          className={`
             block w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
             ${isActive("chats")
              ? "bg-white/10 text-white"
              : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}
          `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 relative -top-px" />
              <span>Chats</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-5 text-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={(e) => handleNavClick("favorites", e)}
          className={`
             block w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
             ${isActive("favorites")
              ? "bg-white/10 text-white"
              : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}
          `}
        >
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 relative -top-px" />
            <span>Favorites</span>
          </div>
        </button>

        <button
          onClick={(e) => handleNavClick("analytics", e)}
          className={`
             block w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
             ${isActive("analytics")
              ? "bg-white/10 text-white"
              : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}
          `}
        >
          <div className="flex items-center gap-3">
            <BarChart2 className="w-5 h-5 relative -top-px" />
            <span>Analytics</span>
          </div>
        </button>
      </nav>

      <div className="grow" />

      <div className="border-t border-white/5 pt-4 mb-2">
        <button className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
        </button>
        <button
          onClick={(e) => handleNavClick("settings", e)}
          className={`
            flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
            ${isActive("settings")
              ? "bg-white/10 text-white"
              : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}
          `}
        >
          <Settings className="w-5 h-5" />
          <span>Account</span>
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl bg-white/5 border border-white/5">
        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
          {/* Profile Pic Placeholder */}
          <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="flex flex-col overflow-hidden min-w-0">
          <span className="text-sm font-medium text-white truncate">Agency User</span>
          <span className="text-[10px] text-slate-500 truncate">user@aiscout.com</span>
        </div>
      </div>
    </aside>
  );
}
