"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TopBar() {
  const { viewMode, setViewMode, searchQuery, setSearchQuery, sortBy, setSortBy, sortOrder, setSortOrder } = useWorkspace();
  const [unreadCount, setUnreadCount] = useState(0);

  // Load unread count
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
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-14 border-b border-white/10 bg-[#0A0A0A] flex items-center justify-between px-6">
      {/* Title / View Name */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-white">
          {viewMode === "applications" ? "Applications" : viewMode === "chats" ? "Chats" : "Analytics"}
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Quick Actions - Removed */}
      <div className="flex items-center gap-2">
      </div>
    </div>
  );
}

