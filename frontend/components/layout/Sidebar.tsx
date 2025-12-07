"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [unreadCount, setUnreadCount] = useState(0);
  
  const currentView = searchParams?.get("view") || "applications";

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
    if (pathname !== "/dashboard") return false;
    if (view === "applications" && (!currentView || currentView === "applications")) return true;
    return currentView === view;
  };

  const handleNavClick = (view: string) => {
    router.push(`/dashboard?view=${view}`);
  };

  return (
    <aside className="w-64 h-full bg-[#0A0A0A] border-r border-white/10 p-6 flex flex-col">

      <h1 className="text-2xl font-extrabold text-white mb-8">
        AI Scout
      </h1>

      <nav className="flex flex-col gap-3">
        <button
          onClick={() => handleNavClick("applications")}
          className={`
            block w-full text-left px-6 py-3 rounded-xl font-semibold text-sm transition relative
            ${isActive("applications")
              ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"}
          `}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Applications</span>
          </div>
        </button>
        <button
          onClick={() => handleNavClick("chats")}
          className={`
            block w-full text-left px-6 py-3 rounded-xl font-semibold text-sm transition relative
            ${isActive("chats")
              ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"}
          `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Chats</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </button>
        <Link href="/analytics" className={`
          block px-6 py-3 rounded-xl font-semibold text-sm transition relative
          ${pathname === "/analytics" || pathname?.startsWith("/analytics")
            ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"}
        `}>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Analytics</span>
          </div>
        </Link>
      </nav>

      <div className="flex-grow" />

      <nav className="flex flex-col gap-3">
        <Link href="/settings" className={`
          block px-6 py-3 rounded-xl font-semibold text-sm transition relative
          ${pathname === "/settings" || pathname?.startsWith("/settings")
            ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"}
        `}>Settings</Link>
        <button className="text-gray-500 hover:text-red-400 text-sm text-left px-6">
          Logout
        </button>
      </nav>
    </aside>
  );
}
