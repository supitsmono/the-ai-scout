"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChatListItem from "./components/ChatListItem";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ChatsPage() {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Go to dashboard on Cmd/Ctrl + D
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        router.push("/dashboard");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/chats?include_archived=${showArchived}`);
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    
    // Auto-refresh chats every 10 seconds for real-time updates
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [showArchived]);

  if (loading)
    return (
      <div className="p-6 text-gray-400">
        Loading chats...
      </div>
    );

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const modelName = chat.model?.name?.toLowerCase() || "";
    return modelName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Chats</h1>
          {chats.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {chats.length} conversation{chats.length !== 1 ? "s" : ""}
              {chats.reduce((sum, c) => sum + (c.unread_count || 0), 0) > 0 && (
                <span className="ml-2 text-purple-400">
                  • {chats.reduce((sum, c) => sum + (c.unread_count || 0), 0)} unread
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* ARCHIVE TOGGLE */}
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              showArchived
                ? "bg-purple-600/20 border border-purple-500/30 text-purple-300"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </button>
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search chats by model name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
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

      {loading ? (
        <div className="text-gray-400 text-center py-8">Loading chats...</div>
      ) : filteredChats.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">
            {searchQuery ? "No chats found" : "No chats yet."}
          </p>
          {!searchQuery && (
            <Link
              href="/dashboard"
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              Go to Dashboard to contact models
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredChats.map((chat) => (
            <ChatListItem
              chat={chat}
              key={chat.id}
              onArchive={() => {
                // Reload chats after archive
                fetch(`${API_BASE}/chats?include_archived=${showArchived}`)
                  .then((r) => r.json())
                  .then(setChats);
              }}
              onDelete={() => {
                // Reload chats after delete
                fetch(`${API_BASE}/chats?include_archived=${showArchived}`)
                  .then((r) => r.json())
                  .then(setChats);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
