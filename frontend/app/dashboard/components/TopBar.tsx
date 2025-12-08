"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "../context/WorkspaceContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider"; // Assuming I might need to make one or use simple inputs for now to save time/complexity and stick to simple UI for specific request. I will use simple inputs in the dropdown for speed and robustness.
import { Filter, Search, Bell, X } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TopBar() {
  const { viewMode, searchQuery, setSearchQuery } = useWorkspace();
  const [unreadCount, setUnreadCount] = useState(0);

  // Filter States
  const [minHeight, setMinHeight] = useState("");
  const [ageRange, setAgeRange] = useState("all"); // all, 18-25, 25-30, 30+
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Load unread count
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const res = await fetch(`${API_BASE}/chats`);
        if (res.ok) {
          const chats = await res.json();
          const totalUnread = chats.reduce((sum: number, chat: any) => sum + (chat.unread_count || 0), 0);
          setUnreadCount(totalUnread);
        }
      } catch (err) { console.error(err) }
    };
    loadUnreadCount();
  }, []);

  // Update active filters count
  useEffect(() => {
    let count = 0;
    if (minHeight) count++;
    if (ageRange !== "all") count++;
    setActiveFiltersCount(count);
  }, [minHeight, ageRange]);

  const clearFilters = () => {
    setMinHeight("");
    setAgeRange("all");
  };

  return (
    <div className="h-16 border-b border-slate-800/50 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white tracking-tight">
          {viewMode === "home" ? "Dashboard" : 
           viewMode === "applications" ? "Applications" : 
           viewMode === "chats" ? "Inbox" : 
           viewMode === "favorites" ? "Favorites" : 
           viewMode === "analytics" ? "Analytics" : "Dashboard"}
        </h1>
        {viewMode === "applications" && (
          <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
            1,248 Total
          </span>
        )}
      </div>

      {/* Center Search & Filter */}
      <div className="flex-1 max-w-xl mx-8 flex gap-3">
        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder="Search talent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-slate-900/50 border border-slate-800 rounded-xl px-4 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-900 transition-all group-hover:border-slate-700"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
        </div>

        {/* Advanced Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-10 px-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all outline-none">
            <Filter size={16} className={activeFiltersCount > 0 ? "text-purple-400" : ""} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-purple-600 text-white text-[10px] rounded-full font-bold">
                {activeFiltersCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-[#0F1320] border-slate-800 text-slate-200 p-4" align="end">
            <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider mb-2">Refine Search</DropdownMenuLabel>

            <div className="space-y-4">
              {/* Height Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white">Min Height (cm)</label>
                <input
                  type="number"
                  placeholder="e.g. 175"
                  value={minHeight}
                  onChange={(e) => setMinHeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-purple-500/50 outline-none"
                />
              </div>

              {/* Age Range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white">Age Group</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setAgeRange("18-25")}
                    className={`px-2 py-1.5 rounded-lg text-xs border ${ageRange === "18-25" ? "bg-purple-600 border-purple-500 text-white" : "bg-slate-900 border-slate-800 hover:bg-slate-800"}`}
                  >
                    18 - 25
                  </button>
                  <button
                    onClick={() => setAgeRange("25-30")}
                    className={`px-2 py-1.5 rounded-lg text-xs border ${ageRange === "25-30" ? "bg-purple-600 border-purple-500 text-white" : "bg-slate-900 border-slate-800 hover:bg-slate-800"}`}
                  >
                    25 - 30
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between">
              <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-white">Reset</button>
              <button className="text-xs bg-white text-black px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200">Apply</button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0B0F19]" />}
        </button>
      </div>
    </div>
  );
}
