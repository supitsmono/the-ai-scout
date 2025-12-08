"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Clock, CheckCircle2, XCircle, CreditCard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function SubscriptionStatus() {
  const { user } = useAuth();
  const router = useRouter();
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (user?.subscription_status === "trial" && user?.trial_ends_at) {
      const endDate = new Date(user.trial_ends_at);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays > 0 ? diffDays : 0);
    }
  }, [user]);

  if (!user) return null;

  // Admins don't need subscription status
  if (user.is_admin) return null;

  // Active subscription - no warning needed
  if (user.subscription_status === "active") {
    return (
      <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-sm">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span className="text-emerald-400">Active subscription</span>
      </div>
    );
  }

  // Trial - show countdown
  if (user.subscription_status === "trial" && daysRemaining !== null) {
    if (daysRemaining <= 0) {
      return (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-400 mb-1">Trial Expired</h3>
              <p className="text-sm text-slate-400 mb-3">
                Your trial period has ended. Please upgrade to continue using the platform.
              </p>
              <button
                onClick={() => router.push("/upgrade")}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (daysRemaining <= 3) {
      return (
        <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-400 mb-1">
                Trial Ending Soon
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                Your trial expires in {daysRemaining} {daysRemaining === 1 ? "day" : "days"}. 
                Upgrade now to continue uninterrupted access.
              </p>
              <button
                onClick={() => router.push("/upgrade")}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-blue-400" />
        <span className="text-blue-400">
          Trial: {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining
        </span>
      </div>
    );
  }

  // Cancelled or expired
  if (user.subscription_status === "cancelled" || user.subscription_status === "expired") {
    return (
      <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-400 mb-1">
              {user.subscription_status === "cancelled" ? "Subscription Cancelled" : "Subscription Expired"}
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              {user.subscription_status === "cancelled" 
                ? "Your subscription has been cancelled. Reactivate to continue using the platform."
                : "Your subscription has expired. Please upgrade to continue using the platform."}
            </p>
            <button
              onClick={() => router.push("/upgrade")}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {user.subscription_status === "cancelled" ? "Reactivate" : "Upgrade Now"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

