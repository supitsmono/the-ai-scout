"use client";

import { useState } from "react";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Settings</h1>
        <p className="text-slate-400">System configuration and preferences</p>
      </div>

      {/* System Settings */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white">System Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Maintenance Mode
            </label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm text-slate-400">
                Enable maintenance mode (blocks all non-admin access)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Notifications
            </label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm text-slate-400">
                Send email notifications for important events
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Auto-block Suspicious IPs
            </label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm text-slate-400">
                Automatically block IPs after multiple failed signup attempts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Settings */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white">Trial Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Default Trial Duration (days)
            </label>
            <input
              type="number"
              defaultValue={7}
              min={1}
              max={365}
              className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Allow Multiple Trials
            </label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-sm text-slate-400">
                Allow users to use multiple trial periods
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-white">Security Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Rate Limit (requests per minute)
            </label>
            <input
              type="number"
              defaultValue={100}
              min={10}
              max={1000}
              className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              JWT Token Expiration (days)
            </label>
            <input
              type="number"
              defaultValue={7}
              min={1}
              max={30}
              className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Warning */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-300">
          <p className="font-medium mb-1">Important</p>
          <p className="text-amber-400/80">
            Changes to these settings may affect system behavior. Please review carefully before saving.
          </p>
        </div>
      </div>
    </div>
  );
}

