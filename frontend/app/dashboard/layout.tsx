"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Pipeline", icon: "📊" },
    { href: "/dashboard/favorites", label: "Favorites", icon: "⭐" },
    { href: "/dashboard/rejected", label: "Rejected", icon: "❌" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#050816] text-white flex">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden sm:flex w-[210px] shrink-0 flex-col border-r border-slate-800 bg-slate-950/30 backdrop-blur-xl">
        <Sidebar navItems={navItems} pathname={pathname} />
      </div>

      {/* MOBILE HEADER */}
      <div className="sm:hidden fixed top-0 left-0 z-30 w-full h-14 bg-[#050816]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold">The AI Scout</span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="text-[20px] text-slate-300"
        >
          ☰
        </button>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {open && (
          <>
            {/* DARK BACKDROP */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/70 z-40"
            />

            {/* SLIDE-IN SIDEBAR */}
            <motion.div
              key="mobile-sidebar"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed top-0 left-0 z-50 w-[240px] h-full bg-slate-950 border-r border-slate-800 flex flex-col"
            >
              <Sidebar
                navItems={navItems}
                pathname={pathname}
                onSelect={() => setOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-screen pt-14 sm:pt-0">{children}</div>
    </main>
  );
}

/* ----------------------------------------
   SIDEBAR COMPONENT (shared desktop/mobile)
---------------------------------------- */
function Sidebar({
  navItems,
  pathname,
  onSelect,
}: {
  navItems: { href: string; label: string; icon: string }[];
  pathname: string;
  onSelect?: () => void;
}) {
  return (
    <>
      {/* LOGO */}
      <div className="px-5 py-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-[0_0_14px_rgba(56,189,248,0.45)]">
            <span className="text-[11px] font-semibold tracking-tight">AI</span>
          </div>

          <div className="leading-tight">
            <p className="text-[14px] font-semibold">The AI Scout</p>
            <p className="text-[10px] text-slate-400">Agency OS</p>
          </div>
        </div>
      </div>

      {/* NAV ITEMS */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onSelect?.()}
              className="block relative"
            >
              <div
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition
                  ${
                    active
                      ? "text-slate-900 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }
                `}
              >
                {active && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute inset-0 bg-sky-400 rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}

                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="px-5 py-4 border-t border-slate-800 text-[11px] text-slate-500">
        <p>Logged in as:</p>
        <p className="text-slate-300">Agency Account</p>
      </div>
    </>
  );
}
