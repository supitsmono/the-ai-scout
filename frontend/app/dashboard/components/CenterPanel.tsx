"use client";

import { useEffect, useState, useRef } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import ModelDetailPanel from "../ModelDetailPanel";
import MessageBubble from "../../chats/[chatId]/components/MessageBubble";
import ChatInput from "../../chats/[chatId]/components/ChatInput";
import ModelProfilePanel from "../../chats/[chatId]/components/ModelProfilePanel";
import type { DashboardModel } from "../page";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CenterPanel() {
  const { viewMode, selectedModelId, activeChatId, setActiveChat, setViewMode, setSelectedModel, goBack, showRightPanel, setShowRightPanel } = useWorkspace();
  const [selectedModelData, setSelectedModelData] = useState<DashboardModel | null>(null);
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState([]);
  const [chatModelData, setChatModelData] = useState<DashboardModel | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load selected model
  useEffect(() => {
    if (selectedModelId && (viewMode === "applications")) {
      const loadModel = async () => {
        try {
          const res = await fetch(`${API_BASE}/models/${selectedModelId}`);
          if (res.ok) {
            const m = await res.json();
            const model: DashboardModel = {
              id: m.id,
              name: m.name,
              age: m.age || 0,
              height: m.height_cm || m.height || 0,
              country: m.country || "Unknown",
              photos: [
                {
                  url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
                  type: "Full Face",
                },
              ],
              measurements: { bust: 82, waist: 60, hips: 90 },
              motivation: "Passionate about modeling and ready to work.",
              status: (m.status || m.ai_category || "active") as any,
              aiCategory: m.ai_category || null,
              aiReasons: m.ai_reasons || null,
            };
            setSelectedModelData(model);
          }
        } catch (err) {
          console.error("Error loading model:", err);
        }
      };
      loadModel();
    } else {
      setSelectedModelData(null);
    }
  }, [selectedModelId, viewMode]);

  // Also load model for applications view when selected
  useEffect(() => {
    if (selectedModelId && viewMode === "applications" && !selectedModelData) {
      const loadModel = async () => {
        try {
          const res = await fetch(`${API_BASE}/models/${selectedModelId}`);
          if (res.ok) {
            const m = await res.json();
            const model: DashboardModel = {
              id: m.id,
              name: m.name,
              age: m.age || 0,
              height: m.height_cm || m.height || 0,
              country: m.country || "Unknown",
              photos: [
                {
                  url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
                  type: "Full Face",
                },
              ],
              measurements: { bust: 82, waist: 60, hips: 90 },
              motivation: "Passionate about modeling and ready to work.",
              status: (m.status || m.ai_category || "active") as any,
              aiCategory: m.ai_category || null,
              aiReasons: m.ai_reasons || null,
            };
            setSelectedModelData(model);
          }
        } catch (err) {
          console.error("Error loading model:", err);
        }
      };
      loadModel();
    }
  }, [selectedModelId, viewMode, selectedModelData]);

  // Load chat
  useEffect(() => {
    if (activeChatId && viewMode === "chats") {
      const loadChat = async () => {
        try {
          const chatRes = await fetch(`${API_BASE}/chats/${activeChatId}`);
          const chatData = await chatRes.json();
          
          if (chatData.model?.id) {
            try {
              const modelRes = await fetch(`${API_BASE}/models/${chatData.model.id}`);
              if (modelRes.ok) {
                const fullModelData = await modelRes.json();
                chatData.model = { ...chatData.model, ...fullModelData };
                
                // Transform to DashboardModel format for profile panel
                const model: DashboardModel = {
                  id: fullModelData.id,
                  name: fullModelData.name,
                  age: fullModelData.age || 0,
                  height: fullModelData.height_cm || fullModelData.height || 0,
                  country: fullModelData.country || "Unknown",
                  photos: fullModelData.photos || [],
                  measurements: { bust: 82, waist: 60, hips: 90 },
                  motivation: "Passionate about modeling and ready to work.",
                  status: (fullModelData.status || fullModelData.ai_category || "active") as any,
                  aiCategory: fullModelData.ai_category || null,
                  aiReasons: fullModelData.ai_reasons || null,
                };
                setChatModelData(model);
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
    } else {
      setChat(null);
      setChatModelData(null);
    }
  }, [activeChatId, viewMode]);

  // Load messages
  useEffect(() => {
    if (activeChatId) {
      const loadMessages = async () => {
        try {
          const messagesRes = await fetch(`${API_BASE}/chats/${activeChatId}/messages`);
          if (messagesRes.ok) {
            const messagesData = await messagesRes.json();
            setMessages(messagesData);
            setTimeout(() => {
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }

          await fetch(`${API_BASE}/chats/${activeChatId}/mark-read`, {
            method: "POST",
          });
        } catch (err) {
          console.error("Error loading messages:", err);
        }
      };
      loadMessages();

      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  // Auto-scroll
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send message
  const handleSend = async (text: string) => {
    if (!activeChatId || !text.trim()) return;
    
    try {
      const res = await fetch(
        `${API_BASE}/chats/${activeChatId}/send-message?sender=agency&text=${encodeURIComponent(text)}`,
        { method: "POST" }
      );

      if (res.ok) {
        const msg = await res.json();
        setMessages((prev: any) => [...prev, msg]);
        scrollToBottom();
        
        // Reload chat to update last message
        const chatRes = await fetch(`${API_BASE}/chats/${activeChatId}`);
        if (chatRes.ok) {
          const chatData = await chatRes.json();
          setChat(chatData);
        }
      } else {
        const errorText = await res.text();
        console.error("Error sending message:", res.status, errorText);
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please check your connection and try again.");
    }
  };

  // Applications view - show empty state or model detail as slide-over
  if (viewMode === "applications") {
    return (
      <div className="h-full relative">
        {/* Empty state when no model selected */}
        {!selectedModelId && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">Select a model to view details</p>
              <p className="text-sm text-gray-600">Click on a model from the left panel</p>
            </div>
          </div>
        )}

        {/* Model Detail Panel as Slide-over from right */}
        {selectedModelId && selectedModelData && (
          <div className="absolute inset-0 z-50">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={goBack}
            />
            
            {/* Slide-over Panel */}
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-[#0A0A0A] shadow-2xl overflow-y-auto">
              <ModelDetailPanel
                model={selectedModelData}
                onClose={goBack}
                onContact={async (modelId, chatId) => {
                  if (chatId) {
                    // Model is now contacted - switch to chats view
                    setActiveChat(chatId);
                    setViewMode("chats");
                    setSelectedModel(null);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Chats view - empty state
  if (viewMode === "chats" && !activeChatId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">Select a chat to start messaging</p>
          <p className="text-sm text-gray-600">Click on a chat from the left panel</p>
        </div>
      </div>
    );
  }

  // Chat view - Instagram-style layout
  if (viewMode === "chats" && activeChatId && chat) {
    const model = chat.model;
    const modelPhoto = model?.photos?.[0]?.url || 
      (typeof model?.photos?.[0] === 'string' ? model.photos[0] : null) ||
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";

    return (
      <div className="flex flex-col h-full relative">
        {/* Chat Header */}
        <div className="border-b border-white/10 p-4 flex items-center gap-4 bg-[#0A0A0A]">
          <button
            onClick={goBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            title="Back (Esc)"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src={modelPhoto}
            className="w-10 h-10 rounded-full object-cover border border-white/10 cursor-pointer"
            alt={model?.name || "Model"}
            onClick={() => setShowRightPanel(!showRightPanel)}
          />
          <div className="flex-1">
            <h2 className="text-base font-semibold text-white">{model?.name || "Unknown"}</h2>
            <p className="text-gray-400 text-xs">
              {model?.age && `${model.age} y/o`}
              {model?.country && ` • ${model.country}`}
            </p>
          </div>
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="View Profile"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#050505]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-sm mb-1">No messages yet</p>
              <p className="text-xs text-gray-600">Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((msg: any) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4 bg-[#0A0A0A]">
          <ChatInput onSend={handleSend} />
        </div>

        {/* Profile Panel Slide-over from right */}
        {showRightPanel && chatModelData && (
          <div className="absolute inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowRightPanel(false)}
            />
            
            {/* Slide-over Panel */}
            <div className="w-full max-w-md bg-[#050505] shadow-2xl">
              <ModelProfilePanel
                model={chatModelData}
                onClose={() => setShowRightPanel(false)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Model detail view (should not be reached in new design, but keep for safety)
  if (viewMode === "applications" && selectedModelId && selectedModelData && false) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
            <button onClick={() => setViewMode("models")} className="hover:text-white transition-colors">
              Dashboard
            </button>
            <span>/</span>
            <button onClick={() => setViewMode("models")} className="hover:text-white transition-colors">
              Models
            </button>
            <span>/</span>
            <span className="text-white font-medium">{selectedModelData.name}</span>
          </div>
          
          <ModelDetailPanel
            model={selectedModelData}
            onClose={goBack}
            onContact={async (modelId, chatId) => {
              if (chatId) {
                setActiveChat(chatId);
                setViewMode("chats");
              }
            }}
          />
        </div>
      </div>
    );
  }

  return null;
}

