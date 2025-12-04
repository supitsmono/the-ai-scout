"use client";

import type { ReactNode, ReactElement } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement | null {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-neutral-400 text-sm">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-black via-neutral-950 to-neutral-900">
      <Sidebar activePath={pathname} />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-neutral-800 flex items-center justify-between px-6 backdrop-blur-xl bg-black/40">
          <div className="text-sm text-neutral-400">
            The AI Scout <span className="text-neutral-600 mx-2">/</span>
            <span className="text-neutral-200">
              {pathname?.split("/").slice(-1)[0] || "dashboard"}
            </span>
          </div>
          <button
            className="text-xs text-neutral-400 hover:text-red-400 transition"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("apply_link");
              router.replace("/login");
            }}
          >
            Logout
          </button>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
