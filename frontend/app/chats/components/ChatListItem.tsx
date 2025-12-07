"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import timeago from "@/lib/timeago";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ChatListItem({ chat, onArchive, onDelete }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Get avatar - use placeholder if no photo available
  const avatar = chat.model?.photos?.[0]?.url || 
    (typeof chat.model?.photos?.[0] === 'string' ? chat.model.photos[0] : null) ||
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";

  // Format last message preview (truncate if too long)
  const lastMessagePreview = chat.last_message 
    ? (chat.last_message.length > 50 
        ? chat.last_message.substring(0, 50) + "..." 
        : chat.last_message)
    : "No messages yet";

  const handleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isArchiving) return;
    
    setIsArchiving(true);
    try {
      const action = chat.is_archived ? "unarchive" : "archive";
      const res = await fetch(`${API_BASE}/chats/${chat.id}/${action}`, {
        method: "POST",
      });
      if (res.ok && onArchive) {
        onArchive();
      }
    } catch (err) {
      console.error("Error archiving chat:", err);
      alert("Failed to archive chat");
    } finally {
      setIsArchiving(false);
      setShowMenu(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const confirmed = window.confirm(
      `⚠️ WARNING: This will permanently delete the chat AND remove "${chat.model?.name || "this model"}" from the system.\n\nThis action cannot be undone. Are you sure?`
    );
    
    if (!confirmed) {
      setShowMenu(false);
      return;
    }

    const doubleConfirm = window.confirm(
      `Are you absolutely sure? This will permanently delete:\n- All messages in this chat\n- The model "${chat.model?.name || ""}"\n\nThis cannot be undone!`
    );

    if (!doubleConfirm) {
      setShowMenu(false);
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/chats/${chat.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (onDelete) {
          onDelete();
        } else {
          router.push("/chats");
        }
      } else {
        throw new Error("Failed to delete chat");
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
      alert("Failed to delete chat. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative group">
      <Link
        href={`/chats/${chat.id}`}
        className="flex items-center gap-4 bg-[#111] border border-white/10 
                   p-4 rounded-2xl hover:bg-[#181818] transition relative"
      >
      <div className="relative flex-shrink-0">
        <img
          src={avatar}
          alt={chat.model?.name || "Model"}
          className="w-14 h-16 rounded-xl object-cover border border-white/10"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.src = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";
          }}
        />
        {chat.unread_count > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full border-2 border-[#111] flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{chat.unread_count}</span>
          </div>
        )}
        {chat.is_archived && (
          <div className="absolute -bottom-1 -left-1 bg-gray-600 rounded-full border-2 border-[#111] p-1">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-white text-lg font-semibold truncate">
            {chat.model?.name || "Unknown Model"}
          </h3>
          {chat.is_archived && (
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">Archived</span>
          )}
          {chat.unread_count > 0 && !chat.is_archived && (
            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
          )}
        </div>

        <p className="text-gray-400 text-sm truncate">
          {lastMessagePreview}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-gray-500 text-xs whitespace-nowrap">
          {chat.last_timestamp ? timeago(chat.last_timestamp) : "Just now"}
        </p>
      </div>

      {/* MENU BUTTON */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        title="More options"
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </Link>

    {/* DROPDOWN MENU */}
    {showMenu && (
      <>
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
        <div className="absolute top-12 right-4 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl z-20 min-w-[180px] overflow-hidden">
          <button
            onClick={handleArchive}
            disabled={isArchiving}
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            {chat.is_archived ? "Unarchive" : "Archive"}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </>
    )}
    </div>
  );
}
