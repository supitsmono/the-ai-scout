"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Clock, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { getAdminStats } from "@/lib/api";

interface AdminStats {
  total_users: number;
  active_users: number;
  trial_users: number;
  active_subscriptions: number;
  cancelled_subscriptions: number;
  expired_subscriptions: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
  unverified_users: number;
  admin_users: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-slate-400">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <div className="text-red-400">Failed to load admin statistics</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">System overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats.total_users}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="Active Users"
          value={stats.active_users}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          label="Trial Users"
          value={stats.trial_users}
          icon={<Clock className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          label="Active Subscriptions"
          value={stats.active_subscriptions}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          label="New Users Today"
          value={stats.new_users_today}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="New This Week"
          value={stats.new_users_this_week}
          icon={<TrendingUp className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="New This Month"
          value={stats.new_users_this_month}
          icon={<TrendingUp className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="Unverified Users"
          value={stats.unverified_users}
          icon={<AlertCircle className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          label="Cancelled"
          value={stats.cancelled_subscriptions}
          icon={<XCircle className="w-5 h-5" />}
          color="red"
        />
        <StatCard
          label="Expired"
          value={stats.expired_subscriptions}
          icon={<XCircle className="w-5 h-5" />}
          color="red"
        />
        <StatCard
          label="Admin Users"
          value={stats.admin_users}
          icon={<Users className="w-5 h-5" />}
          color="purple"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div className={`bg-[#0A0A0A] border rounded-xl p-5 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium opacity-80">{label}</div>
    </div>
  );
}

