"use client";

import timeago from "@/lib/timeago";

export default function MessageBubble({ msg }) {
  const isAgency = msg.sender === "agency";

  return (
    <div className={`flex ${isAgency ? "justify-end" : "justify-start"} mb-4 group`}>
      <div className={`flex flex-col ${isAgency ? "items-end" : "items-start"} max-w-[70%]`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm shadow-md break-words
            ${isAgency 
              ? "bg-purple-600 text-white rounded-br-md" 
              : "bg-white/10 text-gray-100 rounded-bl-md"}
          `}
        >
          {msg.text}
        </div>
        <span className="text-xs text-gray-500 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {msg.timestamp ? timeago(msg.timestamp) : "Just now"}
        </span>
      </div>
    </div>
  );
}
