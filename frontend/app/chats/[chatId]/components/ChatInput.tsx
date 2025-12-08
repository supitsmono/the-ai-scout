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
    <div className="relative border border-slate-700/50 rounded-xl bg-[#1A1D21] focus-within:border-slate-500 focus-within:shadow-sm transition-all overflow-hidden">
      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent text-slate-200 px-4 py-3 text-sm outline-none resize-none min-h-[48px] max-h-[200px] placeholder:text-slate-500 font-normal leading-relaxed custom-scrollbar"
        placeholder="Message #general..."
        rows={1}
      />

      {/* Toolbar / Actions */}
      <div className="flex items-center justify-between px-2 py-2 bg-[#1A1D21]">
        <div className="flex items-center gap-1">
          {/* Visual-only toolbar buttons for aesthetic */}
          <button className="p-1.5 text-slate-400 hover:bg-white/5 rounded-md transition-colors" title="Add attachment">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button className="p-1.5 text-slate-400 hover:bg-white/5 rounded-md transition-colors font-bold text-xs">B</button>
          <button className="p-1.5 text-slate-400 hover:bg-white/5 rounded-md transition-colors italic text-xs">I</button>
          <button className="p-1.5 text-slate-400 hover:bg-white/5 rounded-md transition-colors line-through text-xs">S</button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button className="p-1.5 text-slate-400 hover:bg-white/5 rounded-md transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
          <button className="p-1.5 text-slate-400 hover:bg-white/5 rounded-md transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {text.length > 0 && <span className="text-[10px] text-slate-600">{text.length}</span>}
          <button
            onClick={send}
            disabled={!text.trim()}
            className={`p-2 rounded-lg transition-all ${text.trim()
                ? "bg-[#007a5a] text-white hover:bg-[#148567]"
                : "bg-transparent text-slate-500 cursor-not-allowed"
              }`}
          >
            <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
