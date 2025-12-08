"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { Users, BarChart3, FileText, Settings, LogOut, Home, Shield } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !user.is_admin)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.is_admin) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-[#050816] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/50 bg-[#0B0F19]/40 backdrop-blur-xl shrink-0 flex flex-col">
        <div className="p-6 flex-1">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            <p className="text-xs text-slate-400">System Administration</p>
            <div className="mt-2 text-xs text-slate-500">
              Logged in as: {user.email}
            </div>
          </div>
          
          <nav className="space-y-1">
            <AdminNavItem href="/admin" icon={<BarChart3 size={18} />} label="Dashboard" />
            <AdminNavItem href="/admin/users" icon={<Users size={18} />} label="Users" />
            <AdminNavItem href="/admin/logs" icon={<FileText size={18} />} label="Logs" />
            <AdminNavItem href="/admin/settings" icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800/50 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Home size={18} />
            <span>Back to Dashboard</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#050816]">
        {children}
      </main>
    </div>
  );
}

function AdminNavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/admin" && pathname?.startsWith(href));
  
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

