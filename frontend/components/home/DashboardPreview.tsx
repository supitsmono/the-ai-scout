"use client";

import { Button } from "@/components/ui/button";
import {
    Users,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    MessageSquare,
    Star,
    Globe
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";

// Static mock data for the preview
const mockStats = {
    totalApplications: 142,
    perfectFit: 38,
    goodFit: 64,
    reviewing: 28,
    selected: 12,
    unreadMessages: 7
};

const mockRecentModels = [
    { id: 1, name: "Sophia Milan", initials: "SM", aiCategory: "perfectFit", age: 22, country: "Netherlands" },
    { id: 2, name: "Emma Wilson", initials: "EW", aiCategory: "goodFit", age: 24, country: "Germany" },
    { id: 3, name: "Isabella Rossi", initials: "IR", aiCategory: "perfectFit", age: 21, country: "Italy" },
    { id: 4, name: "Lucas Dubois", initials: "LD", aiCategory: "reviewing", age: 23, country: "France" },
    { id: 5, name: "Liam Verhoeven", initials: "LV", aiCategory: "goodFit", age: 25, country: "Netherlands" },
];

export default function DashboardPreview() {
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
                    value={mockStats.totalApplications.toString()}
                    subtext={`${mockStats.perfectFit} Perfect Fit`}
                    icon={<Users className="text-white" />}
                    color="bg-cyan-500"
                />
                <MetricCard
                    label="Perfect Fit"
                    value={mockStats.perfectFit.toString()}
                    subtext="AI classified"
                    icon={<Star className="text-white" />}
                    color="bg-emerald-500"
                />
                <MetricCard
                    label="In Review"
                    value={mockStats.reviewing.toString()}
                    subtext="Pending action"
                    icon={<Clock className="text-white" />}
                    color="bg-slate-500"
                />
                <MetricCard
                    label="Unread Messages"
                    value={mockStats.unreadMessages.toString()}
                    subtext="Requires attention"
                    icon={<MessageSquare className="text-white" />}
                    color="bg-cyan-500"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Applications (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Recent Applications</h2>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-auto py-1">
                            View All <ArrowUpRight className="ml-1 w-3 h-3" />
                        </Button>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden">
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
                                    {mockRecentModels.map((model) => (
                                        <TableRow
                                            key={model.id}
                                            className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors group cursor-pointer"
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
                                                <StatusBadge status={model.aiCategory} />
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
                                <span className="text-sm font-bold text-white">{mockStats.perfectFit}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                    <span className="text-sm text-slate-300">Good Fit</span>
                                </div>
                                <span className="text-sm font-bold text-white">{mockStats.goodFit}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                    <span className="text-sm text-slate-300">In Review</span>
                                </div>
                                <span className="text-sm font-bold text-white">{mockStats.reviewing}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    <span className="text-sm text-slate-300">Selected</span>
                                </div>
                                <span className="text-sm font-bold text-white">{mockStats.selected}</span>
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
                            >
                                <Users className="mr-2 h-4 w-4" />
                                View Applications
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5"
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Open Chats ({mockStats.unreadMessages})
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

function MetricCard({ label, value, subtext, icon, color }: any) {
    // Map color to shadow
    const shadowClass = color === "bg-cyan-500" ? "shadow-cyan-500/20" :
        color === "bg-emerald-500" ? "shadow-emerald-500/20" :
            "shadow-slate-500/20";

    return (
        <div
            className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 relative group overflow-hidden transition-all hover:border-white/10 hover:bg-[#0F0F0F]"
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
