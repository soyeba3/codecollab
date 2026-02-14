"use client";

import { useMutation, useSelf, useStorage } from "@/lib/liveblocks.config";
import { type ChatMessage, type UserMeta } from "@/types";
import { FormEvent, useEffect, useRef, useState } from "react";
import { UserAvatar } from "./user-avatar";

export function ChatPanel() {
  const user = useSelf();
  const messages = useStorage((root) => root.chatMessages);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = useMutation(
    ({ storage }, text: string) => {
      if (!text.trim()) return;

      storage.get("chatMessages").push({
        id: Date.now().toString(),
        text,
        userId: user?.connectionId ?? 0,
        timestamp: Date.now(),
        userInfo:
          user?.info ??
          ({
            name: "Anonymous",
            color: "#808080",
            picture: "",
          } as UserMeta["info"]),
      });
    },
    [user],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(draft);
    setDraft("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages?.length]); // Auto scroll on new message

  if (!messages) {
    return <div className="p-4 text-gray-500">Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#0c0c12]">
      <div
        className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
        ref={scrollRef}
      >
        {messages.length === 0 && (
          <p className="text-gray-500 text-center text-sm mt-10">
            No messages yet. Say hi!
          </p>
        )}
        {messages.map((msg: ChatMessage) => {
          const isMe = msg.userId === user?.connectionId;
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
            >
              <UserAvatar
                name={msg.userInfo?.name}
                src={msg.userInfo?.picture}
                color={msg.userInfo?.color}
                className="flex-shrink-0 w-8 h-8 mt-1"
              />
              <div
                className={`flex flex-col max-w-[80%] ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400 font-medium">
                    {msg.userInfo?.name}
                  </span>
                  <span className="text-[10px] text-gray-600">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div
                  className={`px-3 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "bg-purple-600 text-white rounded-tr-sm"
                      : "bg-white/10 text-gray-200 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-white/5 bg-[#0a0a0f]"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
        />
      </form>
    </div>
  );
}
