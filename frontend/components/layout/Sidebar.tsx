"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `
      block px-6 py-3 rounded-xl font-semibold text-sm transition
      ${pathname === path
        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
        : "text-gray-400 hover:text-white hover:bg-white/5"}
    `;

  return (
    <aside className="w-64 h-full bg-[#0A0A0A] border-r border-white/10 p-6 flex flex-col">

      <h1 className="text-2xl font-extrabold text-white mb-8">
        AI Scout
      </h1>

      <nav className="flex flex-col gap-3">
        <Link href="/dashboard" className={linkClasses("/dashboard")}>Dashboard</Link>
        <Link href="/workflow" className={linkClasses("/workflow")}>Workflow</Link>
        <Link href="/chats" className={linkClasses("/chats")}>Chats</Link>
        <Link href="/analytics" className={linkClasses("/analytics")}>Analytics</Link>
      </nav>

      <div className="flex-grow" />

      <nav className="flex flex-col gap-3">
        <Link href="/settings" className={linkClasses("/settings")}>Settings</Link>
        <button className="text-gray-500 hover:text-red-400 text-sm text-left px-6">
          Logout
        </button>
      </nav>
    </aside>
  );
}
