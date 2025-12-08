
"use client";

import { motion } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    BarChart,
    Activity,
    Users,
    ArrowUpRight,
    Search,
    Filter,
    Download,
    MoreHorizontal
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

export default function DetailedDashboardPreview() {
    return (
        <div className="w-full max-w-5xl mx-auto">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-slate-800/50 pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-purple-500 flex items-center justify-center">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Candidates</CardTitle>
                                    <CardDescription>Overview of all incoming applications</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative hidden sm:block">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Search models..."
                                        className="h-9 w-64 rounded-md bg-slate-950/50 border border-slate-800 pl-9 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="h-9 border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                                <Button size="sm" className="h-9 bg-white text-black hover:bg-slate-200">
                                    <Download className="mr-2 h-4 w-4" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Tabs defaultValue="all" className="w-full">
                            <div className="px-6 py-2 border-b border-slate-800/50 bg-slate-900/30">
                                <TabsList className="bg-transparent h-auto p-0 gap-6">
                                    <DashboardTab value="all" label="All Candidates" count={142} />
                                    <DashboardTab value="perfect" label="Perfect Fit" count={38} color="text-blue-400" />
                                    <DashboardTab value="good" label="Good Fit" count={64} color="text-green-400" />
                                    <DashboardTab value="low" label="Low Potential" count={40} color="text-orange-400" />
                                </TabsList>
                            </div>

                            <TabsContent value="all" className="m-0">
                                <Table>
                                    <TableHeader className="bg-slate-900/50 hover:bg-slate-900/50">
                                        <TableRow className="border-slate-800/50 hover:bg-transparent">
                                            <TableHead className="w-[300px] text-slate-400">Name</TableHead>
                                            <TableHead className="text-slate-400">Status</TableHead>
                                            <TableHead className="text-slate-400">Location</TableHead>
                                            <TableHead className="text-slate-400 hidden md:table-cell">Applied</TableHead>
                                            <TableHead className="text-right text-slate-400">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dashboardData.map((candidate, i) => (
                                            <TableRow key={i} className="border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border border-slate-700">
                                                            <AvatarFallback className="bg-slate-800 text-xs text-slate-300">
                                                                {candidate.initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                                                                {candidate.name}
                                                            </div>
                                                            <div className="text-xs text-slate-500">{candidate.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={candidate.status} />
                                                </TableCell>
                                                <TableCell className="text-slate-300 text-sm">
                                                    {candidate.location}
                                                </TableCell>
                                                <TableCell className="text-slate-400 text-sm hidden md:table-cell">
                                                    {candidate.date}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                                                        <MoreHorizontal size={14} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination fake */}
                                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/50">
                                    <div className="text-xs text-slate-500">
                                        Showing <strong>1-5</strong> of <strong>142</strong> candidates
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-800 bg-slate-900" disabled>
                                            &lt;
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-800 bg-slate-900 hover:bg-slate-800">
                                            1
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500">
                                            2
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500">
                                            ...
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-800 bg-slate-900 hover:bg-slate-800">
                                            &gt;
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

function DashboardTab({ value, label, count, color = "text-slate-400" }: { value: string, label: string, count: number, color?: string }) {
    return (
        <TabsTrigger
            value={value}
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none pb-3 pt-2 px-1 border-b-2 border-transparent transition-all"
        >
            <div className="flex items-center gap-2">
                <span className="">{label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full bg-slate-800 ${color}`}>
                    {count}
                </span>
            </div>
        </TabsTrigger>
    );
}

const dashboardData = [
    {
        name: "Sophia Milan",
        initials: "SM",
        email: "sophia.milan@example.com",
        status: "perfectFit",
        location: "Amsterdam, NL",
        date: "2 mins ago"
    },
    {
        name: "Emma Wilson",
        initials: "EW",
        email: "emma.w@example.com",
        status: "goodFit",
        location: "Berlin, DE",
        date: "15 mins ago"
    },
    {
        name: "Liam Verhoeven",
        initials: "LV",
        email: "liam.v@example.com",
        status: "lowPotential",
        location: "Rotterdam, NL",
        date: "1 hour ago"
    },
    {
        name: "Isabella Rossi",
        initials: "IR",
        email: "isa.rossi@example.com",
        status: "perfectFit",
        location: "Milan, IT",
        date: "3 hours ago"
    },
    {
        name: "Lucas Dubois",
        initials: "LD",
        email: "lucas.d@example.com",
        status: "contacted",
        location: "Paris, FR",
        date: "5 hours ago"
    }
];
