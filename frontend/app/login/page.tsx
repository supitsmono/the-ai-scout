"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // TODO: call your Flask /api/login here later
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-soft">
        <h1 className="text-lg font-semibold">Log in to your agency</h1>
        <p className="mt-1 text-xs text-slate-400">
          Use your agency credentials to access the dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs outline-none ring-0 focus:border-brand-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs outline-none ring-0 focus:border-brand-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-950 disabled:opacity-60"
          >
            {loading ? "Entering..." : "Enter dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
