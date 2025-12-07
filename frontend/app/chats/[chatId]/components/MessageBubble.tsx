"use client";

export default function MessageBubble({ msg }) {
  const isAgency = msg.sender === "agency";

  return (
    <div className={`flex ${isAgency ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-3 rounded-2xl max-w-xs text-sm shadow-md
          ${isAgency ? "bg-purple-600 text-white" : "bg-white/10"}
        `}
      >
        {msg.text}
      </div>
    </div>
  );
}
