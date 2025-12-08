"use client";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#050816] text-white">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    </div>
  );
}

