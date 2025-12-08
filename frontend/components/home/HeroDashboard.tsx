
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, MoreHorizontal, Check, X } from "lucide-react";

export default function HeroDashboard() {
    return (
        <div className="relative w-full max-w-[500px] mx-auto">
            {/* Abstract background elements */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />

            {/* Main Card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-800/50">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Bell size={16} />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 divide-x divide-slate-800/50 border-b border-slate-800/50">
                            <div className="p-4 text-center">
                                <p className="text-xs text-slate-400 mb-1">New</p>
                                <p className="text-xl font-bold text-white">42</p>
                            </div>
                            <div className="p-4 text-center">
                                <p className="text-xs text-slate-400 mb-1">Perfect</p>
                                <p className="text-xl font-bold text-blue-400">18</p>
                            </div>
                            <div className="p-4 text-center">
                                <p className="text-xs text-slate-400 mb-1">Review</p>
                                <p className="text-xl font-bold text-purple-400">12</p>
                            </div>
                        </div>

                        {/* List */}
                        <div className="p-4 space-y-4">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Recent Applications
                            </div>

                            <AnimateRow delay={0.4}>
                                <ApplicantRow
                                    name="Sophia Milan"
                                    location="Amsterdam"
                                    match="98%"
                                    image="/avatars/01.png"
                                    status="perfect"
                                />
                            </AnimateRow>

                            <AnimateRow delay={0.6}>
                                <ApplicantRow
                                    name="Elena R."
                                    location="Berlin"
                                    match="85%"
                                    image="/avatars/02.png"
                                    status="good"
                                />
                            </AnimateRow>

                            <AnimateRow delay={0.8}>
                                <ApplicantRow
                                    name="Marcus J."
                                    location="London"
                                    match="42%"
                                    image="/avatars/03.png"
                                    status="low"
                                />
                            </AnimateRow>
                        </div>

                        {/* Pop-up Notification Animation */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 2, duration: 0.5, type: "spring" }}
                            className="absolute bottom-4 right-4 bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl flex items-center gap-3 pr-6"
                        >
                            <div className="relative">
                                <div className="w-2 h-2 bg-blue-500 rounded-full absolute -top-1 -right-1 animate-pulse" />
                                <Avatar className="h-8 w-8 border border-slate-600">
                                    <AvatarFallback className="bg-purple-900 text-xs">NL</AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-white">New Application</p>
                                <p className="text-[10px] text-slate-400">Just now · Perfect Fit</p>
                            </div>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

function AnimateRow({ children, delay }: { children: React.ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}

function ApplicantRow({ name, location, match, image, status }: { name: string, location: string, match: string, image: string, status: "perfect" | "good" | "low" }) {
    return (
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-700">
                    <AvatarFallback className="text-xs bg-slate-800 text-slate-300">
                        {name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{name}</p>
                    <p className="text-xs text-slate-500">{location}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className={`text-xs font-bold ${status === "perfect" ? "text-blue-400" :
                        status === "good" ? "text-green-400" : "text-slate-500"
                    }`}>
                    {match}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                    <MoreHorizontal size={14} />
                </Button>
            </div>
        </div>
    );
}
