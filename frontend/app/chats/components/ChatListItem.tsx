"use client";

import Link from "next/link";
import timeago from "@/lib/timeago";

export default function ChatListItem({ chat }) {
  const avatar = chat.model?.photos?.[0]?.url;

  return (
    <Link
      href={`/chats/${chat.id}`}
      className="flex items-center gap-4 bg-[#111] border border-white/10 
                 p-4 rounded-2xl hover:bg-[#181818] transition"
    >
      <img
        src={avatar}
        className="w-14 h-16 rounded-xl object-cover"
      />

      <div className="flex-1">
        <h3 className="text-white text-lg font-semibold">
          {chat.model?.name}
        </h3>

        <p className="text-gray-400 text-sm">
          {chat.last_message || "No messages yet"}
        </p>
      </div>

      <div className="text-right">
        <p className="text-gray-500 text-xs">
          {timeago(chat.last_timestamp)}
        </p>

        {chat.unread_count > 0 && (
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mt-2 inline-block">
            {chat.unread_count}
          </span>
        )}
      </div>
    </Link>
  );
}
