"use client";

import { useEffect, useState } from "react";
import {
    BarChart2,
    Users,
    Globe,
    TrendingUp,
    PieChart,
    MessageSquare,
    Star,
    CheckCircle2,
    XCircle,
    Clock,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface OverviewData {
    total_models: number;
    total_chats: number;
    active_chats: number;
    ai_classification: Record<string, number>;
}

interface CountryData {
    country: string;
    count: number;
}

interface AgeDistribution {
    age_ranges: Record<string, number>;
    average_age: number;
    min_age: number;
    max_age: number;
}

interface AIClassification {
    breakdown: Array<{ category: string; count: number }>;
    total_classified: number;
    unclassified_count: number;
    total_models: number;
    classification_rate: number;
}

interface PipelineFlow {
    categories: Record<string, number>;
    percentages: Record<string, number>;
    total_models: number;
}

interface EngagementStats {
    total_models: number;
    contacted_models: number;
    contact_rate: number;
    total_chats: number;
    active_chats: number;
    archived_chats: number;
    total_messages: number;
    avg_messages_per_chat: number;
}

export default function Analytics() {
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [ageDistribution, setAgeDistribution] = useState<AgeDistribution | null>(null);
    const [aiClassification, setAiClassification] = useState<AIClassification | null>(null);
    const [pipelineFlow, setPipelineFlow] = useState<PipelineFlow | null>(null);
    const [engagement, setEngagement] = useState<EngagementStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnalytics = async () => {
            setLoading(true);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
                // Load all analytics data in parallel
                const [overviewRes, countriesRes, ageRes, aiRes, pipelineRes, engagementRes] = await Promise.all([
                    fetch(`${API_BASE}/analytics/overview`, { signal: controller.signal }),
                    fetch(`${API_BASE}/analytics/countries`, { signal: controller.signal }),
                    fetch(`${API_BASE}/analytics/age-distribution`, { signal: controller.signal }),
                    fetch(`${API_BASE}/analytics/ai-classification`, { signal: controller.signal }),
                    fetch(`${API_BASE}/analytics/pipeline-flow`, { signal: controller.signal }),
                    fetch(`${API_BASE}/analytics/engagement`, { signal: controller.signal }),
                ]);

                if (overviewRes.ok) {
                    setOverview(await overviewRes.json());
                }
                if (countriesRes.ok) {
                    const data = await countriesRes.json();
                    setCountries(data.countries || []);
                }
                if (ageRes.ok) {
                    setAgeDistribution(await ageRes.json());
                }
                if (aiRes.ok) {
                    setAiClassification(await aiRes.json());
                }
                if (pipelineRes.ok) {
                    setPipelineFlow(await pipelineRes.json());
                }
                if (engagementRes.ok) {
                    setEngagement(await engagementRes.json());
                }
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error("Error loading analytics:", error);
                }
            } finally {
                clearTimeout(timeoutId);
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="p-6 md:p-8 flex items-center justify-center h-full">
                <div className="text-slate-400">Loading analytics...</div>
            </div>
        );
    }

    const topCountries = countries.slice(0, 5);
    const maxCountryCount = topCountries[0]?.count || 1;

    const ageRanges = ageDistribution?.age_ranges || {};
    const maxAgeCount = Math.max(...Object.values(ageRanges), 1);

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
                <p className="text-slate-400 text-sm">Comprehensive insights into your model pipeline</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Total Models"
                    value={overview?.total_models || 0}
                    icon={<Users className="text-white" />}
                    color="bg-cyan-500"
                />
                <MetricCard
                    label="Active Chats"
                    value={overview?.active_chats || 0}
                    subtext={`${overview?.total_chats || 0} total`}
                    icon={<MessageSquare className="text-white" />}
                    color="bg-purple-500"
                />
                <MetricCard
                    label="Perfect Fit"
                    value={overview?.ai_classification?.perfectFit || 0}
                    icon={<Star className="text-white" />}
                    color="bg-emerald-500"
                />
                <MetricCard
                    label="Good Fit"
                    value={pipelineFlow?.categories?.goodFit || 0}
                    icon={<CheckCircle2 className="text-white" />}
                    color="bg-cyan-500"
                />
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Engagement Overview */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6">
                    <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Engagement Overview
                    </h3>
                    {engagement && (
                        <div className="space-y-6">
                            {/* Contact Rate */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Contact Rate</span>
                                    <span className="text-lg font-bold text-white">{engagement.contact_rate.toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                        style={{ width: `${engagement.contact_rate}%` }}
                                    />
                                </div>
                                <div className="text-xs text-slate-500">
                                    {engagement.contacted_models} of {engagement.total_models} models contacted
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Active Chats</span>
                                    <span className="text-sm font-semibold text-white">{engagement.active_chats}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Total Messages</span>
                                    <span className="text-sm font-semibold text-white">{engagement.total_messages}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Avg Messages/Chat</span>
                                    <span className="text-sm font-semibold text-white">{engagement.avg_messages_per_chat.toFixed(1)}</span>
                                </div>
                                {engagement.archived_chats > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-400">Archived Chats</span>
                                        <span className="text-sm font-semibold text-slate-500">{engagement.archived_chats}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Classification Pie Chart (CSS-based) */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6">
                    <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        AI Classification
                    </h3>
                    {aiClassification && (
                        <div className="space-y-4">
                            <div className="text-center py-4">
                                <div className="text-3xl font-bold text-white mb-1">
                                    {aiClassification.total_models > 0 ? "100%" : "0%"}
                                </div>
                                <div className="text-sm text-slate-400">All Models Classified</div>
                                {aiClassification.unclassified_count > 0 && (
                                    <div className="text-xs text-amber-400 mt-1">
                                        ⚠️ {aiClassification.unclassified_count} pending classification
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                {aiClassification.breakdown.map((item) => {
                                    const percentage = aiClassification.total_models > 0
                                        ? (item.count / aiClassification.total_models) * 100
                                        : 0;
                                    const color = item.category === "perfectFit" ? "bg-emerald-500" :
                                                 item.category === "goodFit" ? "bg-cyan-500" :
                                                 item.category === "lowPotential" ? "bg-orange-500" :
                                                 "bg-slate-500";
                                    return (
                                        <div key={item.category} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${color}`} />
                                                <span className="text-sm text-slate-300 capitalize">
                                                    {item.category.replace(/([A-Z])/g, ' $1')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-slate-400">{percentage.toFixed(1)}%</span>
                                                <span className="text-sm font-semibold text-white w-8 text-right">
                                                    {item.count}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {aiClassification.unclassified_count > 0 && (
                                    <div className="flex items-center justify-between pt-2 border-t border-amber-500/20">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                                            <span className="text-sm text-amber-400">Pending Classification</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-amber-400">
                                                {((aiClassification.unclassified_count / aiClassification.total_models) * 100).toFixed(1)}%
                                            </span>
                                            <span className="text-sm font-semibold text-amber-400 w-8 text-right">
                                                {aiClassification.unclassified_count}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Top Countries */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6">
                    <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Top Countries
                    </h3>
                    <div className="space-y-4">
                        {topCountries.length === 0 ? (
                            <div className="text-center text-slate-400 py-4">No data available</div>
                        ) : (
                            topCountries.map((item) => {
                                const percentage = (item.count / maxCountryCount) * 100;
                                return (
                                    <div key={item.country} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-300">{item.country}</span>
                                            <span className="text-white font-semibold">{item.count}</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Age Distribution */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6">
                    <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Age Distribution
                    </h3>
                    {ageDistribution && (
                        <div className="space-y-4">
                            <div className="text-center py-2">
                                <div className="text-2xl font-bold text-white mb-1">
                                    {ageDistribution.average_age.toFixed(1)}
                                </div>
                                <div className="text-xs text-slate-400">Average Age</div>
                                <div className="text-xs text-slate-500 mt-1">
                                    Range: {ageDistribution.min_age} - {ageDistribution.max_age}
                                </div>
                            </div>
                            <div className="space-y-3">
                                {Object.entries(ageRanges).map(([range, count]) => {
                                    const percentage = (count / maxAgeCount) * 100;
                                    return (
                                        <div key={range} className="space-y-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-300">{range} years</span>
                                                <span className="text-white font-semibold">{count}</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

function MetricCard({ label, value, subtext, icon, color }: {
    label: string;
    value: number;
    subtext?: string;
    icon: React.ReactNode;
    color: string;
}) {
    const shadowClass = color === "bg-cyan-500" ? "shadow-cyan-500/20" :
                       color === "bg-purple-500" ? "shadow-purple-500/20" :
                       color === "bg-emerald-500" ? "shadow-emerald-500/20" :
                       "shadow-green-500/20";

    return (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-5 relative group overflow-hidden transition-all hover:border-white/10 hover:bg-[#0F0F0F]">
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

