"use client";

import { useEffect, useState } from "react";
import ChatListItem from "./components/ChatListItem";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ChatsPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/chats`);
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-gray-400">
        Loading chats...
      </div>
    );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 p-6">
      <h1 className="text-3xl font-bold mb-6">Chats</h1>

      {chats.length === 0 && (
        <p className="text-gray-500">No chats yet.</p>
      )}

      {chats.map((chat) => (
        <ChatListItem chat={chat} key={chat.id} />
      ))}
    </div>
  );
}
