"use client";

import { useEffect, useState, useRef } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import MessageBubble from "../../chats/[chatId]/components/MessageBubble";
import ChatInput from "../../chats/[chatId]/components/ChatInput";
import ModelProfilePanel from "../../chats/[chatId]/components/ModelProfilePanel";
import { ArrowLeft, User, Archive, Trash2, Clock, Check, CheckCheck, MoreVertical, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DashboardModel } from "../page";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ChatInterfaceProps {
    chatId: number;
    initialChatData?: any;
}

export default function ChatInterface({ chatId, initialChatData }: ChatInterfaceProps) {
    const { goBack, setShowRightPanel, showRightPanel } = useWorkspace();

    const [chat, setChat] = useState<any>(initialChatData || null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(!initialChatData);
    const [modelData, setModelData] = useState<DashboardModel | null>(null);

    // Actions State
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    // Load Chat & Model Data - Reset on ID change
    useEffect(() => {
        setChat(null); // Clear old chat immediately to show loading state or mock skel
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
                            // Transform for Profile Panel
                            setModelData({
                                id: m.id,
                                name: m.name,
                                age: m.age || 0,
                                height: m.height_cm || m.height || 0,
                                country: m.country || "Unknown",
                                photos: m.photos || [],
                                measurements: { bust: 82, waist: 60, hips: 90 }, // Mock
                                motivation: m.motivation || "",
                                status: m.status || "active",
                                aiCategory: m.ai_category || null,
                                aiReasons: m.ai_reasons || null,
                            });
                        }
                    }
                }
            } catch (err) { console.error(err); }
            setLoading(false);
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
                    if (!loading) scrollToBottom();
                }
            } catch (err) { console.error(err); }
            setLoading(false);
        };

        loadMessages();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [chatId]);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (text: string) => {
        // ... same send logic ...
        try {
            const res = await fetch(`${API_BASE}/chats/${chatId}/send-message?sender=agency&text=${encodeURIComponent(text)}`, { method: "POST" });
            if (res.ok) {
                const msg = await res.json();
                setMessages((prev: any) => [...prev, msg]);
                scrollToBottom();
            }
        } catch (err) { console.error(err); }
    };

    const handleArchive = async () => {
        setIsArchiving(true);
        // Simulate API
        await new Promise(r => setTimeout(r, 1000));
        // Implement actual API call here if backend supported
        setIsArchiving(false);
        setShowArchiveConfirm(false);
        goBack(); // Return to list
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        // Simulate API - DELETE Model
        await new Promise(r => setTimeout(r, 1500));
        // Implement actual API call here
        setIsDeleting(false);
        setShowDeleteConfirm(false);
        goBack();
    };

    // Countdown Logic
    const getDaysRemaining = () => {
        // Mock logic: 10 days from last message
        const lastMsgDate = new Date(chat?.last_message_at || Date.now());
        const expiryDate = new Date(lastMsgDate.getTime() + (10 * 24 * 60 * 60 * 1000));
        const now = new Date();
        const days = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    if (loading) return <div className="flex h-full items-center justify-center text-slate-500">Loading chat...</div>;

    return (
        <div className="flex flex-col h-full relative bg-[#050505]">

            {/* HEADER - Agency Style */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#050505] border-b border-white/5 relative z-20">
                <div className="flex items-center gap-4">
                    <button onClick={goBack} className="p-2 -ml-2 text-slate-400 hover:text-white lg:hidden">
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
                            {chat?.model?.name || "Candidate Chat"}
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Online" />
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] uppercase font-bold tracking-wider">
                                Application
                            </div>
                            <span className="text-slate-600">|</span>
                            <span>Last active: Just now</span>
                        </div>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3 mr-4 opacity-100 hover:space-x-1 transition-all duration-300">
                        <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=64" className="w-8 h-8 rounded-full border-2 border-[#050505]" title="You" />
                        <div className="w-8 h-8 rounded-full border-2 border-[#050505] bg-slate-800 text-[10px] flex items-center justify-center text-white font-bold">+1</div>
                    </div>

                    <div className="h-6 w-px bg-white/5" />

                    <button
                        onClick={() => setShowRightPanel(!showRightPanel)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs font-semibold"
                    >
                        <User size={14} />
                        Profile
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Archive size={16} />
                    </button>
                </div>
            </div>

            {/* MESSAGES AREA - Slack Style */}
            <div
                className="flex-1 overflow-y-auto px-4 py-6 bg-[#0B0F19] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent pb-10"
            >
                {/* Intro / Welcome to Channel */}
                <div className="mb-8 mt-4 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-3">
                        <User size={32} className="text-slate-500" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">
                        Application: {chat?.model?.name}
                    </h3>
                    <p className="text-slate-500 text-xs">
                        This is the start of your conversation with <strong>{chat?.model?.name}</strong>. Also includes your team.
                    </p>
                </div>

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
                            : (chat?.model?.photos?.[0]?.url || chat?.model?.photos?.[0]),
                        senderName: msg.sender === 'agency' ? "You" : chat?.model?.name
                    };

                    return (
                        <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <MessageBubble
                                msg={enrichedMsg}
                                showHeader={!shouldGroup}
                                showAvatar={!shouldGroup}
                            />
                        </div>
                    );
                })}
                <div ref={bottomRef} className="h-4" />
            </div>

            {/* INPUT AREA */}
            <div className="p-6 bg-[#050505] border-t border-white/5 relative z-20">
                <ChatInput onSend={handleSend} />
                <div className="text-center mt-3 opacity-50 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-slate-500 font-medium">
                        <strong>Shift + Enter</strong> for new line • <strong>/</strong> for templates
                    </span>
                </div>
            </div>

            {/* PROFILE PANEL - Slide from right, no heavy backdrop */}
            <AnimatePresence>
                {showRightPanel && modelData && (
                    <div className="absolute inset-0 z-50 flex">
                        {/* Light backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="flex-1 bg-black/20"
                            onClick={() => setShowRightPanel(false)}
                        />
                        {/* Slide-over Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full max-w-2xl h-full bg-[#0A0A0A] border-l border-white/10 shadow-2xl overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ModelProfilePanel
                                model={modelData}
                                onClose={() => setShowRightPanel(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODALS */}
            {/* Archive Confirmation */}
            <AnimatePresence>
                {showArchiveConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <div className="bg-[#131722] border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <Archive className="text-amber-400" /> Archive Chat?
                            </h3>
                            <p className="text-sm text-slate-400 mb-6">
                                This conversation will be moved to archived chats. You can restore it later.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowArchiveConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition-colors">Cancel</button>
                                <button
                                    onClick={handleArchive}
                                    disabled={isArchiving}
                                    className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-500 font-bold transition-colors"
                                >
                                    {isArchiving ? "Archiving..." : "Archive"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <div className="bg-[#131722] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <AlertTriangle className="text-red-500" /> PERMANENT DELETE
                            </h3>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                                <p className="text-sm text-red-200 font-medium leading-relaxed">
                                    Warning: Closing this chat will <span className="font-bold underline">permanently delete</span> the model
                                    <span className="text-white mx-1">"{chat?.model?.name}"</span>
                                    and all associated data from the system.
                                </p>
                                <p className="text-xs text-red-300 mt-2 uppercase font-bold tracking-wide">This action cannot be undone.</p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition-colors">Cancel</button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-500 font-bold transition-colors shadow-lg shadow-red-900/20"
                                >
                                    {isDeleting ? "Deleting..." : "CLOSE & DELETE"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
