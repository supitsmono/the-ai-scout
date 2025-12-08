"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Activity,
    Users,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    MoreHorizontal,
    Search,
    Filter,
    Download,
    UserCheck,
    MessageSquare,
    Zap,
    TrendingUp
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { useWorkspace } from "../context/WorkspaceContext";

export default function DashboardHome() {
    const { setViewMode } = useWorkspace();

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Agency Overview</h1>
                    <p className="text-slate-500 text-sm">Welcome back, Head of Scouting</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300">
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                    <Button className="bg-white text-black hover:bg-slate-200">
                        <Zap className="mr-2 h-4 w-4" /> Invite Talent
                    </Button>
                </div>
            </div>

            {/* Agency Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="New Applications"
                    value="142"
                    subtext="+12% from last week"
                    icon={<Users className="text-white" />}
                    color="bg-blue-600 shadow-blue-900/20"
                />
                <MetricCard
                    label="Pending Review"
                    value="28"
                    subtext="Requires attention"
                    icon={<Clock className="text-white" />}
                    color="bg-amber-600 shadow-amber-900/20"
                />
                <MetricCard
                    label="Scouted This Month"
                    value="14"
                    subtext="4 signed contracts"
                    icon={<CheckCircle2 className="text-white" />}
                    color="bg-emerald-600 shadow-emerald-900/20"
                />
                <MetricCard
                    label="Response Rate"
                    value="94%"
                    subtext="Avg time: 2h 15m"
                    icon={<TrendingUp className="text-white" />}
                    color="bg-purple-600 shadow-purple-900/20"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Applications Table (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-white">Incoming Talent</h2>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Live Feed</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-auto py-1" onClick={() => setViewMode("applications")}>
                            View All <ArrowUpRight className="ml-1 w-3 h-3" />
                        </Button>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-white/[0.02] border-b border-white/5">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-6">Candidate</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ai Rating</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stats</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Country</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-right pr-6">Applied</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dashboardData.slice(0, 7).map((candidate, i) => (
                                    <TableRow key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group cursor-pointer h-12">
                                        <TableCell className="pl-6 py-2">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border border-white/10 rounded-lg">
                                                    <AvatarFallback className="bg-slate-800 text-[10px] text-slate-300 rounded-lg">
                                                        {candidate.initials}
                                                    </AvatarFallback>
                                                    {/* Ideally AvatarImage here */}
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                                                        {candidate.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <StatusBadge status={candidate.status} />
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-xs py-2">
                                            {candidate.age}y • {candidate.gender}
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-xs py-2">
                                            {candidate.country}
                                        </TableCell>
                                        <TableCell className="text-right text-slate-500 text-xs font-mono pr-6 py-2">
                                            {candidate.date}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Right Column: Quick Actions & Notices (1/3 width) */}
                <div className="space-y-6">
                    {/* Unread Messages Widget */}
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-sm">Unread Messages</h3>
                            <span className="text-xs font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">3</span>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">Emma Wilson</span>
                                    <span className="text-[10px] text-slate-500">10m</span>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-1">I can definitely make the shoot on Tuesday!</p>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">Lucas Dubois</span>
                                    <span className="text-[10px] text-slate-500">2h</span>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-1">Thanks for the feedback. I've updated my...</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-3 text-xs text-slate-500 hover:text-white" onClick={() => setViewMode("chats")}>
                            Go to Inbox
                        </Button>
                    </div>

                    {/* Quick Task */}
                    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/5 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                <Zap size={16} />
                            </div>
                            <h3 className="font-bold text-white text-sm">Quick Review</h3>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">
                            You have <span className="text-white font-bold">28 applications</span> pending AI classification verification.
                        </p>
                        <Button size="sm" className="w-full bg-white text-black hover:bg-slate-200 font-semibold text-xs">
                            Start Review Session
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}

function MetricCard({ label, value, subtext, icon, color }: any) {
    return (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 relative group overflow-hidden transition-all hover:border-white/10">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                {/* Large background icon absolute */}
                <div className="transform scale-150 text-white">{icon}</div>
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shadow-lg`}>
                    {icon}
                </div>
            </div>

            <div className="relative z-10">
                <div className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</div>
                <div className="text-sm font-medium text-slate-400">{label}</div>
                <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {subtext}
                    </span>
                </div>
            </div>
        </div>
    )
}

const dashboardData = [
    {
        name: "Sophia Milan",
        initials: "SM",
        email: "sophia.milan@example.com",
        status: "perfectFit",
        location: "Amsterdam, NL",
        age: 23,
        gender: "F",
        country: "NL",
        date: "2 mins ago"
    },
    {
        name: "Emma Wilson",
        initials: "EW",
        email: "emma.w@example.com",
        status: "goodFit",
        location: "Berlin, DE",
        age: 21,
        gender: "F",
        country: "DE",
        date: "15 mins ago"
    },
    {
        name: "Liam Verhoeven",
        initials: "LV",
        email: "liam.v@example.com",
        status: "lowPotential",
        location: "Rotterdam, NL",
        age: 25,
        gender: "M",
        country: "NL",
        date: "1 hour ago"
    },
    {
        name: "Isabella Rossi",
        initials: "IR",
        email: "isa.rossi@example.com",
        status: "perfectFit",
        location: "Milan, IT",
        age: 20,
        gender: "F",
        country: "IT",
        date: "3 hours ago"
    },
    {
        name: "Lucas Dubois",
        initials: "LD",
        email: "lucas.d@example.com",
        status: "contacted",
        location: "Paris, FR",
        age: 24,
        gender: "M",
        country: "FR",
        date: "5 hours ago"
    },
    {
        name: "Ava Chen",
        initials: "AC",
        email: "ava.c@example.com",
        status: "goodFit",
        location: "Toronto, CA",
        age: 22,
        gender: "F",
        country: "CA",
        date: "6 hours ago"
    }
];
