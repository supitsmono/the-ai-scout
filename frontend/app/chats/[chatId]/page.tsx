"use client";

import { useEffect, useState, useRef } from "react";
import MessageBubble from "./components/MessageBubble";
import ChatInput from "./components/ChatInput";
import ModelProfilePanel from "./components/ModelProfilePanel";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ChatWindowPage({ params }) {
  const chatId = params.chatId;
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load chat info
  useEffect(() => {
    fetch(`${API_BASE}/chats/${chatId}`)
      .then((r) => r.json())
      .then(setChat);
  }, [chatId]);

  // Load messages
  useEffect(() => {
    fetch(`${API_BASE}/chats/${chatId}/messages`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(data);
        scrollToBottom();
      });
  }, [chatId]);

  // Send message handler
  const handleSend = async (text) => {
    const res = await fetch(
      `${API_BASE}/chats/${chatId}/send-message?sender=agency&text=${encodeURIComponent(
        text
      )}`,
      { method: "POST" }
    );

    const msg = await res.json();

    setMessages((prev) => [...prev, msg]);
    scrollToBottom();
  };

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
        {/* HEADER */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
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

          <button
            onClick={() => setShowProfile(true)}
            className="ml-auto px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 rounded-xl text-sm font-medium text-purple-300 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
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
          </button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))
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
