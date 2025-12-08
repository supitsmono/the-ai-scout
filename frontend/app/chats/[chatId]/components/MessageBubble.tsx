"use client";

import timeago from "@/lib/timeago";
import { Check, CheckCheck } from "lucide-react";

export default function MessageBubble({ msg, showHeader = true, showAvatar = true }: { msg: any, showHeader?: boolean, showAvatar?: boolean }) {
  const isAgency = msg.sender === "agency";
  const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Now";

  // Avatar Image Source (Mock logic or passed logic)
  // In a real app, you'd pass the avatar URL as a prop derived from the chat's model data or user session
  // For "Agency", we use a generic placeholder or the user's avatar. For "Model", we use the model's photo.
  // We'll rely on a default fallback here since we don't have the full user object passed in just yet,
  // or we can expect it in the `msg` if we enriched it upstream.
  // Let's assume `msg.avatarUrl` or fallback.
  const avatarUrl = msg.avatarUrl || (isAgency
    ? "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64" // Agency User
    : "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64" // Model
  );

  const senderName = isAgency ? "You" : (msg.senderName || "Candidate");

  return (
    <div className={`flex gap-3 group px-4 py-0.5 hover:bg-[#1A1D21]/50 -mx-4 transition-colors ${showHeader ? "mt-3" : "mt-0.5"}`}>
      {/* Left Gutter: Avatar or Timestamp on hover */}
      <div className="w-9 flex-shrink-0 flex items-start justify-end">
        {showAvatar ? (
          <div className="w-9 h-9 rounded-md overflow-hidden bg-slate-700">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="hidden group-hover:block text-[10px] text-slate-500 pt-1 w-full text-right pr-1 select-none">
            {timestamp}
          </div>
        )}
      </div>

      {/* Content Column */}
      <div className="flex-1 min-w-0">
        {showHeader && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="font-bold text-[15px] text-[#D1D5DB] leading-tight cursor-pointer hover:underline">
              {senderName}
            </span>
            <span className="text-[11px] text-[#ABABAD] select-none">{timestamp}</span>
          </div>
        )}

        <div className="text-[15px] text-[#D1D5DB] leading-relaxed whitespace-pre-wrap break-words">
          {msg.text}
        </div>
      </div>
    </div>
  );
}
