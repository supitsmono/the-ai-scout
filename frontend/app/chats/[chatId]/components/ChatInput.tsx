"use client";

import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex gap-3 mt-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
        placeholder="Type a message..."
      />

      <button
        onClick={send}
        className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white text-sm font-semibold"
      >
        Send
      </button>
    </div>
  );
}
