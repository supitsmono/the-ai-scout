"use client";

import { useWorkspace } from "../context/WorkspaceContext";

export default function TopBar() {
  const { viewMode } = useWorkspace();

  const getViewTitle = () => {
    switch (viewMode) {
      case "home":
        return "Dashboard";
      case "applications":
        return "Applications";
      case "chats":
        return "Inbox";
      case "favorites":
        return "Favorites";
      case "analytics":
        return "Analytics";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="h-16 border-b border-white/5 bg-[#0A0A0A]/95 backdrop-blur-md flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          {getViewTitle()}
        </h1>
        <div className="hidden md:block h-6 w-px bg-white/10" />
        <p className="hidden md:block text-sm text-slate-400 italic font-light">
          "Every great model started with a single application"
        </p>
      </div>
    </div>
  );
}
