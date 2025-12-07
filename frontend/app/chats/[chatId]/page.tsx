"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MessageBubble from "./components/MessageBubble";
import ChatInput from "./components/ChatInput";
import ModelProfilePanel from "./components/ModelProfilePanel";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Chat menu component for archive/delete actions
function ChatMenuButton({ chatId, modelName }: { chatId: string; modelName?: string }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      // First check if chat is archived
      const chatRes = await fetch(`${API_BASE}/chats/${chatId}`);
      const chat = await chatRes.json();
      const action = chat.is_archived ? "unarchive" : "archive";
      
      const res = await fetch(`${API_BASE}/chats/${chatId}/${action}`, {
        method: "POST",
      });
      if (res.ok) {
        router.push("/chats");
      }
    } catch (err) {
      console.error("Error archiving chat:", err);
      alert("Failed to archive chat");
    } finally {
      setIsArchiving(false);
      setShowMenu(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `⚠️ WARNING: This will permanently delete the chat AND remove "${modelName || "this model"}" from the system.\n\nThis action cannot be undone. Are you sure?`
    );
    
    if (!confirmed) {
      setShowMenu(false);
      return;
    }

    const doubleConfirm = window.confirm(
      `Are you absolutely sure? This will permanently delete:\n- All messages in this chat\n- The model "${modelName || ""}"\n\nThis cannot be undone!`
    );

    if (!doubleConfirm) {
      setShowMenu(false);
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/chats/${chatId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/chats");
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
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        title="More options"
      >
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl z-20 min-w-[200px] overflow-hidden">
            <button
              onClick={handleArchive}
              disabled={isArchiving}
              className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              {isArchiving ? "Processing..." : "Archive Chat"}
            </button>
            <div className="border-t border-white/10" />
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

export default function ChatWindowPage({ params }) {
  const router = useRouter();
  const chatId = params.chatId;
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const bottomRef = useRef(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close profile
      if (e.key === "Escape" && showProfile) {
        setShowProfile(false);
        return;
      }
      // Cmd/Ctrl + K to go back
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        router.push("/chats");
      }
      // Cmd/Ctrl + P to toggle profile
      if ((e.metaKey || e.ctrlKey) && e.key === "p") {
        e.preventDefault();
        setShowProfile(!showProfile);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showProfile, router]);

  // Auto-scroll
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load chat info and full model data
  useEffect(() => {
    const loadChat = async () => {
      try {
        const chatRes = await fetch(`${API_BASE}/chats/${chatId}`);
        const chatData = await chatRes.json();
        
        // Load full model data with photos if model exists
        if (chatData.model?.id) {
          try {
            const modelRes = await fetch(`${API_BASE}/models/${chatData.model.id}`);
            if (modelRes.ok) {
              const fullModelData = await modelRes.json();
              chatData.model = { ...chatData.model, ...fullModelData };
            }
          } catch (err) {
            console.error("Error loading full model data:", err);
          }
        }
        
        setChat(chatData);
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };
    
    loadChat();
  }, [chatId]);

  // Load messages and mark chat as read
  useEffect(() => {
    const loadMessages = async () => {
      try {
        // Load messages
        const messagesRes = await fetch(`${API_BASE}/chats/${chatId}/messages`);
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
        scrollToBottom();

        // Mark chat as read when opening
        await fetch(`${API_BASE}/chats/${chatId}/mark-read`, {
          method: "POST",
        });
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    loadMessages();
  }, [chatId]);

  // Send message handler
  const handleSend = async (text) => {
    try {
      const res = await fetch(
        `${API_BASE}/chats/${chatId}/send-message?sender=agency&text=${encodeURIComponent(
          text
        )}`,
        { method: "POST" }
      );

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  // Auto-refresh messages every 5 seconds for real-time updates
  useEffect(() => {
    if (!chatId) return;

    const refreshMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/chats/${chatId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          // Only auto-scroll if user is near bottom
          const isNearBottom = 
            bottomRef.current && 
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
          if (isNearBottom) {
            scrollToBottom();
          }
        }
      } catch (err) {
        console.error("Error refreshing messages:", err);
      }
    };

    const interval = setInterval(refreshMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  if (!chat)
    return <div className="p-6 text-gray-400">Loading chat...</div>;

  const model = chat.model;
  
  // Get model photo for header
  const modelPhoto = model?.photos?.[0]?.url || 
    (typeof model?.photos?.[0] === 'string' ? model.photos[0] : null) ||
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";

  return (
    <>
      {/* BACKDROP (subtle overlay when profile is open) */}
      {showProfile && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setShowProfile(false)}
        />
      )}

      <div 
        className={`flex flex-col h-[calc(100vh-40px)] max-w-3xl mx-auto p-6 transition-all duration-500 ease-out-smooth ${
          showProfile ? 'mr-[600px] opacity-95' : 'opacity-100'
        }`}
      >
        {/* BREADCRUMB NAVIGATION */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
          <Link 
            href="/chats" 
            className="hover:text-white transition-colors"
          >
            Chats
          </Link>
          <span>/</span>
          <span className="text-white font-medium">{model?.name || "Chat"}</span>
        </div>

        {/* HEADER */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
          {/* BACK BUTTON */}
          <button
            onClick={() => router.push("/chats")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
            title="Back to chats (⌘K)"
          >
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="relative">
            <img
              src={modelPhoto}
              className="w-16 h-20 rounded-xl object-cover border border-white/10 shadow-lg"
              alt={model?.name || "Model"}
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#050505]"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{model?.name || "Unknown"}</h2>
            <p className="text-gray-400 text-sm">
              {model?.age && `${model.age} y/o`}
              {model?.height_cm && ` • ${model.height_cm} cm`}
              {model?.country && ` • ${model.country}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* VIEW PROFILE BUTTON */}
            <button
              onClick={() => setShowProfile(true)}
              className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 rounded-xl text-sm font-medium text-purple-300 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              title="View Profile (⌘P)"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              View Profile
              <span className="text-xs opacity-60 ml-1">⌘P</span>
            </button>

            {/* MENU BUTTON */}
            <ChatMenuButton chatId={chatId} modelName={model?.name} />
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto pr-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm font-medium mb-1">No messages yet</p>
              <p className="text-xs text-gray-600">Start the conversation with {model?.name || "this model"}!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <ChatInput onSend={handleSend} />
      </div>

      {/* PROFILE PANEL */}
      {showProfile && (
        <ModelProfilePanel
          model={model}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}
