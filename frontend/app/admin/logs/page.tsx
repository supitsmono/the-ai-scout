"use client";

import { useEffect, useState } from "react";
import { getSignupAttempts } from "@/lib/api";
import { CheckCircle2, XCircle, AlertCircle, Filter } from "lucide-react";

interface SignupAttempt {
  id: number;
  email: string;
  ip_address: string;
  device_fingerprint: string | null;
  success: boolean;
  blocked_reason: string | null;
  created_at: string;
}

export default function AdminLogsPage() {
  const [attempts, setAttempts] = useState<SignupAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSuccess, setFilterSuccess] = useState<boolean | null>(null);
  const [filterBlocked, setFilterBlocked] = useState<string>("");

  useEffect(() => {
    loadLogs();
  }, [filterSuccess, filterBlocked]);

  const loadLogs = async () => {
    try {
      const data = await getSignupAttempts({
        limit: 100,
        success: filterSuccess !== null ? filterSuccess : undefined,
        blocked_reason: filterBlocked || undefined,
      });
      setAttempts(data);
    } catch (error) {
      console.error("Error loading logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterSuccess(null);
    setFilterBlocked("");
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-slate-400">Loading logs...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Logs</h1>
          <p className="text-slate-400">Signup attempts and system events</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Status</label>
            <select
              value={filterSuccess === null ? "all" : filterSuccess ? "success" : "blocked"}
              onChange={(e) => {
                if (e.target.value === "all") setFilterSuccess(null);
                else setFilterSuccess(e.target.value === "success");
              }}
              className="w-full px-3 py-2 bg-[#111] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Blocked Reason</label>
            <input
              type="text"
              placeholder="Filter by reason..."
              value={filterBlocked}
              onChange={(e) => setFilterBlocked(e.target.value)}
              className="w-full px-3 py-2 bg-[#111] border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/2 border-b border-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {attempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-white/2">
                  <td className="px-6 py-4 text-sm text-white">{attempt.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{attempt.ip_address}</td>
                  <td className="px-6 py-4">
                    {attempt.success ? (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs">Success</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs">Blocked</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {attempt.blocked_reason || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(attempt.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

