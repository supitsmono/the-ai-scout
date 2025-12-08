"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Users,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    MessageSquare,
    Zap,
    TrendingUp,
    Star,
    Globe
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { useWorkspace } from "../context/WorkspaceContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Stats {
    applied: number;
    reviewing: number;
    perfectFit: number;
    goodFit: number;
    interview: number;
    selected: number;
    rejected: number;
}

interface RecentModel {
    id: number;
    name: string;
    initials: string;
    status: string;
    aiCategory: string | null;
    age: number;
    country: string;
    date: string;
}

export default function DashboardHome() {
    const { setViewMode, setSelectedModel } = useWorkspace();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentModels, setRecentModels] = useState<RecentModel[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [totalApplications, setTotalApplications] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            try {
                // Load pipeline stats
                try {
                    const statsRes = await fetch(`${API_BASE}/pipeline/stats`, {
                        signal: controller.signal
                    });
                    if (statsRes.ok) {
                        const statsData = await statsRes.json() as Stats;
                        setStats(statsData);
                        const total = (Object.values(statsData) as number[]).reduce((sum: number, val: number) => sum + val, 0);
                        setTotalApplications(total);
                    } else {
                        console.warn("Failed to load pipeline stats:", statsRes.status);
                    }
                } catch (error: any) {
                    if (error.name !== 'AbortError') {
                        console.error("Error loading pipeline stats:", error);
                    }
                }

                // Load recent models
                try {
                    const modelsRes = await fetch(`${API_BASE}/models/?limit=5&sort_by=id&sort_order=desc`, {
                        signal: controller.signal
                    });
                    if (modelsRes.ok) {
                        const modelsData = await modelsRes.json();
                        const recent = modelsData.models?.map((m: any) => ({
                            id: m.id,
                            name: m.name,
                            initials: m.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || "??",
                            status: m.status || m.ai_category || "active",
                            aiCategory: m.ai_category,
                            age: m.age || 0,
                            country: m.country || "Unknown",
                            date: "Just now" // TODO: Add created_at to model
                        })) || [];
                        setRecentModels(recent);
                    } else {
                        console.warn("Failed to load models:", modelsRes.status);
                    }
                } catch (error: any) {
                    if (error.name !== 'AbortError') {
                        console.error("Error loading models:", error);
                    }
                }

                // Load unread messages count
                try {
                    const chatsRes = await fetch(`${API_BASE}/chats/`, {
                        signal: controller.signal
                    });
                    if (chatsRes.ok) {
                        const chats = await chatsRes.json();
                        const unread = Array.isArray(chats) ? chats.reduce((sum: number, chat: any) => sum + (chat.unread_count || 0), 0) : 0;
                        setUnreadCount(unread);
                    } else {
                        console.warn("Failed to load chats:", chatsRes.status);
                    }
                } catch (error: any) {
                    if (error.name !== 'AbortError') {
                        console.error("Error loading chats:", error);
                    }
                }
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                clearTimeout(timeoutId);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="p-6 md:p-8 flex items-center justify-center h-full">
                <div className="text-slate-400">Loading dashboard...</div>
            </div>
        );
    }

    const perfectFitCount = stats?.perfectFit || 0;
    const goodFitCount = stats?.goodFit || 0;
    const reviewingCount = stats?.reviewing || 0;
    const selectedCount = stats?.selected || 0;

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
                    <p className="text-slate-400 text-sm">Overview of your applications and pipeline</p>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Total Applications"
                    value={totalApplications.toString()}
                    subtext={`${perfectFitCount} Perfect Fit`}
                    icon={<Users className="text-white" />}
                    color="bg-cyan-500"
                    onClick={() => setViewMode("applications")}
                />
                <MetricCard
                    label="Perfect Fit"
                    value={perfectFitCount.toString()}
                    subtext="AI classified"
                    icon={<Star className="text-white" />}
                    color="bg-emerald-500"
                    onClick={() => {
                        setViewMode("applications");
                        // TODO: Set filter to perfectFit
                    }}
                />
                <MetricCard
                    label="In Review"
                    value={reviewingCount.toString()}
                    subtext="Pending action"
                    icon={<Clock className="text-white" />}
                    color="bg-slate-500"
                />
                <MetricCard
                    label="Unread Messages"
                    value={unreadCount.toString()}
                    subtext="Requires attention"
                    icon={<MessageSquare className="text-white" />}
                    color="bg-cyan-500"
                    onClick={() => setViewMode("chats")}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Applications (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Recent Applications</h2>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-auto py-1" onClick={() => setViewMode("applications")}>
                            View All <ArrowUpRight className="ml-1 w-3 h-3" />
                        </Button>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden">
                        {recentModels.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No applications yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-white/2 border-b border-white/5">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-6 whitespace-nowrap">Model</TableHead>
                                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">AI Category</TableHead>
                                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Age</TableHead>
                                            <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Country</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentModels.map((model) => (
                                            <TableRow 
                                                key={model.id} 
                                                className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors group cursor-pointer"
                                                onClick={() => {
                                                    setSelectedModel(model.id);
                                                    setViewMode("applications");
                                                }}
                                            >
                                                <TableCell className="pl-6 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 border border-white/10 rounded-lg shrink-0">
                                                            <AvatarFallback className="bg-slate-800 text-[10px] text-slate-300 rounded-lg">
                                                                {model.initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                                                                {model.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3 whitespace-nowrap">
                                                    <StatusBadge status={model.aiCategory || model.status} />
                                                </TableCell>
                                                <TableCell className="text-slate-400 text-sm py-3 whitespace-nowrap">
                                                    {model.age}y
                                                </TableCell>
                                                <TableCell className="text-slate-400 text-sm py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-1">
                                                        <Globe className="w-3 h-3 shrink-0" />
                                                        <span className="truncate">{model.country}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Quick Stats (1/3 width) */}
                <div className="space-y-4">
                    {/* AI Category Breakdown */}
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5">
                        <h3 className="font-bold text-white text-sm mb-4">AI Classification</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-sm text-slate-300">Perfect Fit</span>
                                </div>
                                <span className="text-sm font-bold text-white">{perfectFitCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                    <span className="text-sm text-slate-300">Good Fit</span>
                                </div>
                                <span className="text-sm font-bold text-white">{goodFitCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                    <span className="text-sm text-slate-300">In Review</span>
                                </div>
                                <span className="text-sm font-bold text-white">{reviewingCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    <span className="text-sm text-slate-300">Selected</span>
                                </div>
                                <span className="text-sm font-bold text-white">{selectedCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5">
                        <h3 className="font-bold text-white text-sm mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Button 
                                variant="ghost" 
                                className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5"
                                onClick={() => setViewMode("applications")}
                            >
                                <Users className="mr-2 h-4 w-4" />
                                View Applications
                            </Button>
                            <Button 
                                variant="ghost" 
                                className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5"
                                onClick={() => setViewMode("chats")}
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Open Chats {unreadCount > 0 && `(${unreadCount})`}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

function MetricCard({ label, value, subtext, icon, color, onClick }: any) {
    // Map color to shadow
    const shadowClass = color === "bg-cyan-500" ? "shadow-cyan-500/20" : 
                       color === "bg-emerald-500" ? "shadow-emerald-500/20" : 
                       "shadow-slate-500/20";
    
    return (
        <div 
            className={`bg-[#0A0A0A] border border-white/5 rounded-xl p-5 relative group overflow-hidden transition-all hover:border-white/10 hover:bg-[#0F0F0F] ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shadow-lg ${shadowClass}`}>
                    {icon}
                </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1 tracking-tight">{value}</div>
            <div className="text-sm font-medium text-slate-400 mb-1">{label}</div>
            {subtext && (
                <div className="text-xs text-slate-500 mt-1">{subtext}</div>
            )}
        </div>
    );
}
