"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex gap-3 mt-4">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none resize-none min-h-[48px] max-h-[120px] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          rows={1}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {text.length > 0 && `${text.length} chars`}
        </div>
      </div>

      <button
        onClick={send}
        disabled={!text.trim()}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95"
      >
        Send
      </button>
    </div>
  );
}
