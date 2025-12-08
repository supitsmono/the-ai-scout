"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useWorkspace } from "../context/WorkspaceContext";
import MessageBubble from "../../chats/[chatId]/components/MessageBubble";
import ChatInput from "../../chats/[chatId]/components/ChatInput";
import ModelDetailPanel from "../ModelDetailPanel";
import { ArrowLeft, User, Trash2, MoreVertical, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DashboardModel } from "../page";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ChatInterfaceProps {
    chatId: number;
    initialChatData?: any;
}

export default function ChatInterface({ chatId, initialChatData }: ChatInterfaceProps) {
    const { goBack, setShowRightPanel, showRightPanel, setActiveChat, viewMode } = useWorkspace();

    const [chat, setChat] = useState<any>(initialChatData || null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(!initialChatData);
    const [modelData, setModelData] = useState<DashboardModel | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Track previous chatId to detect actual changes
    const prevChatIdRef = useRef<number | null>(null);
    const isInitialMount = useRef(true);

    // Set mounted state for portal
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close profile panel when viewMode changes (e.g., navigating away from chats)
    useEffect(() => {
        if (viewMode !== "chats") {
            setShowRightPanel(false);
        }
    }, [viewMode, setShowRightPanel]);

    // Close profile panel when chatId changes (switching to different chat)
    // Only close if chatId actually changed (not on initial mount)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevChatIdRef.current = chatId;
            return;
        }
        
        if (prevChatIdRef.current !== null && prevChatIdRef.current !== chatId) {
            console.log("Chat ID changed, closing profile panel", { prev: prevChatIdRef.current, new: chatId });
            setShowRightPanel(false);
        }
        prevChatIdRef.current = chatId;
    }, [chatId, setShowRightPanel]);

    // Load Chat & Model Data
    useEffect(() => {
        setChat(null);
        setLoading(true);
        const loadData = async () => {
            try {
                const chatRes = await fetch(`${API_BASE}/chats/${chatId}`);
                if (chatRes.ok) {
                    const data = await chatRes.json();
                    setChat(data);

                    if (data.model?.id) {
                        const modelRes = await fetch(`${API_BASE}/models/${data.model.id}`);
                        if (modelRes.ok) {
                            const m = await modelRes.json();
                            // Normalize photos and assign types (same as CenterPanel)
                            let photos = [];
                            if (m.photos && Array.isArray(m.photos) && m.photos.length > 0) {
                                photos = m.photos.map((p: any, idx: number) => {
                                    if (typeof p === "string") {
                                        // Assign types to first 4 photos (required photos)
                                        const requiredTypes = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
                                        return { url: p, type: requiredTypes[idx] || (idx === 4 ? "Hobby" : "") };
                                    }
                                    // If photo object exists but no type, assign based on index
                                    if (!p.type) {
                                        const requiredTypes = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
                                        p.type = requiredTypes[idx] || (idx === 4 ? "Hobby" : "");
                                    }
                                    return p;
                                });
                            } else {
                                // Fallback photos if none exist
                                photos = [
                                    { url: "https://images.pexels.com/photos/1921168/pexels-photo-1921168.jpeg", type: "Full Face" },
                                    { url: "https://images.pexels.com/photos/1559086/pexels-photo-1559086.jpeg", type: "Full Body" },
                                    { url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", type: "Side Profile" },
                                    { url: "https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg", type: "Hips to Head" },
                                ];
                            }
                            
                            setModelData({
                                id: m.id,
                                name: m.name,
                                age: m.age || 0,
                                height: m.height_cm || m.height || 0,
                                country: m.country || "Unknown",
                                photos: photos,
                                measurements: { bust: 82, waist: 60, hips: 90 },
                                motivation: m.motivation || "",
                                status: m.status || "active",
                                aiCategory: m.ai_category || null,
                                aiReasons: m.ai_reasons || null,
                            });
                        }
                    }
                }
            } catch (err) { 
                console.error("Error loading chat:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [chatId]);

    // Load Messages
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const res = await fetch(`${API_BASE}/chats/${chatId}/messages`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                    scrollToBottom();
                }
                
                // Mark as read
                await fetch(`${API_BASE}/chats/${chatId}/mark-read`, {
                    method: "POST",
                });
            } catch (err) { 
                console.error("Error loading messages:", err);
            }
        };

        loadMessages();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [chatId]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const scrollToBottom = () => {
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSend = async (text: string) => {
        try {
            const res = await fetch(`${API_BASE}/chats/${chatId}/send-message?sender=agency&text=${encodeURIComponent(text)}`, { 
                method: "POST" 
            });
            if (res.ok) {
                const msg = await res.json();
                setMessages((prev: any) => [...prev, msg]);
                scrollToBottom();
            }
        } catch (err) { 
            console.error("Error sending message:", err);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`${API_BASE}/chats/${chatId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setActiveChat(null);
                goBack();
            } else {
                throw new Error("Failed to delete chat");
            }
        } catch (err) {
            console.error("Error deleting chat:", err);
            alert("Failed to delete chat. Please try again.");
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
            setShowMenu(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#050505]">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-gray-400">Loading chat...</p>
                </div>
            </div>
        );
    }

    // Find "Full Face" photo for profile, otherwise use first photo
    const findProfilePhoto = () => {
        // First try modelData (normalized photos)
        if (modelData?.photos && modelData.photos.length > 0) {
            const fullFacePhoto = modelData.photos.find((p: any) => {
                const type = p.type?.toLowerCase() || '';
                return type.includes('full face') || type.includes('headshot') || type === 'full face';
            });
            
            if (fullFacePhoto) {
                return fullFacePhoto.url;
            }
            
            // Fallback to first photo
            return modelData.photos[0]?.url || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";
        }
        
        // Fallback to chat.model.photos if modelData not loaded yet
        if (chat?.model?.photos && Array.isArray(chat.model.photos) && chat.model.photos.length > 0) {
            // Normalize on the fly if needed
            const photos = chat.model.photos.map((p: any, idx: number) => {
                if (typeof p === "string") {
                    const requiredTypes = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
                    return { url: p, type: requiredTypes[idx] || "" };
                }
                if (!p.type) {
                    const requiredTypes = ["Full Face", "Full Body", "Side Profile", "Hips to Head"];
                    p.type = requiredTypes[idx] || "";
                }
                return p;
            });
            
            const fullFacePhoto = photos.find((p: any) => {
                const type = p.type?.toLowerCase() || '';
                return type.includes('full face') || type.includes('headshot') || type === 'full face';
            });
            
            if (fullFacePhoto) {
                return fullFacePhoto.url;
            }
            
            // Fallback to first photo
            const firstPhoto = photos[0];
            return typeof firstPhoto === 'string' ? firstPhoto : (firstPhoto?.url || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg");
        }
        
        return "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg";
    };
    
    const modelPhoto = findProfilePhoto();

    return (
        <div className="flex flex-col h-full relative bg-[#050505]">
            {/* HEADER - Premium Design */}
            <div className="flex-none flex items-center justify-between px-6 py-4 bg-[#0A0A0A] border-b border-white/10 relative z-30">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button 
                        onClick={goBack} 
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0 lg:hidden"
                        aria-label="Back"
                    >
                        <ArrowLeft size={20} className="text-gray-400" />
                    </button>

                    {/* Model Avatar & Info */}
                    <div 
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setShowRightPanel(!showRightPanel)}
                    >
                        <div className="relative w-10 h-10 shrink-0">
                            <img
                                src={modelPhoto}
                                alt={chat?.model?.name || "Model"}
                                className="w-full h-full rounded-full object-cover border border-white/10"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A0A0A]" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-base font-bold text-white truncate">
                                {chat?.model?.name || "Unknown"}
                            </h2>
                            <p className="text-xs text-gray-400 truncate">
                                {chat?.model?.age && `${chat?.model?.age} y/o`}
                                {chat?.model?.country && ` • ${chat?.model?.country}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("View Profile clicked", { 
                                modelData: !!modelData, 
                                showRightPanel, 
                                chatId,
                                modelDataName: modelData?.name 
                            });
                            const newValue = !showRightPanel;
                            console.log("Setting showRightPanel to:", newValue);
                            setShowRightPanel(newValue);
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                            showRightPanel
                                ? "bg-purple-600 text-white"
                                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                        }`}
                    >
                        <User size={16} />
                        View Profile
                    </button>

                    {/* More Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            aria-label="More options"
                        >
                            <MoreVertical size={18} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0A0A0A] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Delete Chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#050505] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <User size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            Start the conversation
                        </h3>
                        <p className="text-sm text-gray-400 max-w-md">
                            Send a message to {chat?.model?.name || "this model"} to begin your conversation.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 max-w-3xl mx-auto">
                        {messages.map((msg: any, i: number) => {
                            const prevMsg = messages[i - 1];
                            const isSameSender = prevMsg && prevMsg.sender === msg.sender;
                            const timeDelta = (prevMsg?.timestamp && msg.timestamp)
                                ? new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime()
                                : 0;
                            const isCloseInTime = timeDelta < 2 * 60 * 1000;
                            const shouldGroup = isSameSender && isCloseInTime;

                            const enrichedMsg = {
                                ...msg,
                                avatarUrl: msg.sender === 'agency'
                                    ? "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=64"
                                    : modelPhoto,
                                senderName: msg.sender === 'agency' ? "You" : chat?.model?.name
                            };

                            return (
                                <MessageBubble
                                    key={msg.id}
                                    msg={enrichedMsg}
                                    showHeader={!shouldGroup}
                                    showAvatar={!shouldGroup}
                                />
                            );
                        })}
                    </div>
                )}
                <div ref={bottomRef} className="h-4" />
            </div>

            {/* INPUT AREA */}
            <div className="flex-none p-4 bg-[#0A0A0A] border-t border-white/10">
                <ChatInput onSend={handleSend} />
            </div>

            {/* PROFILE PANEL - Slide from right - Rendered via Portal to escape overflow-hidden containers */}
            {mounted && createPortal(
                <AnimatePresence>
                    {showRightPanel && (
                        <motion.div 
                            key={`profile-panel-${chatId}`}
                            className="fixed inset-0 flex" 
                            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="flex-1 bg-black/30"
                                onClick={() => {
                                    console.log("Backdrop clicked, closing panel");
                                    setShowRightPanel(false);
                                }}
                            />
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="w-full max-w-2xl h-full bg-[#0A0A0A] border-l border-white/10 shadow-2xl overflow-hidden flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {modelData ? (
                                    <ModelDetailPanel
                                        model={modelData}
                                        onClose={() => {
                                            setShowRightPanel(false);
                                        }}
                                        onDelete={handleDelete}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                            <p className="text-sm text-gray-400">Loading profile...</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* DELETE CONFIRMATION MODAL */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0A0A0A] border border-red-500/30 rounded-xl p-6 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Trash2 size={20} className="text-red-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Delete Chat?
                                </h3>
                            </div>
                            
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                                <p className="text-sm text-red-200 font-medium leading-relaxed">
                                    This will <span className="font-bold underline">permanently delete</span> the chat with
                                    <span className="text-white mx-1">"{chat?.model?.name}"</span>
                                    and remove the model from the system.
                                </p>
                                <p className="text-xs text-red-300 mt-2 uppercase font-bold tracking-wide">
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowDeleteConfirm(false)} 
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 font-semibold text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? "Deleting..." : "Delete Chat"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
