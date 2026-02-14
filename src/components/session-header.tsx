"use client";

import { useOthers, useStorage } from "@/lib/liveblocks.config";
import { type Session } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserAvatar } from "./user-avatar";

export function SessionHeader({ session }: { session: Session }) {
  const router = useRouter();
  const others = useOthers();
  const userCount = others.length + 1;
  const code = useStorage((root) => root.code);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/session/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      // Optional: Show toast
      alert("Session saved to database!");
    } catch (error) {
      console.error(error);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0a0a0f]/50 backdrop-blur-md z-10 h-16">
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-bold text-lg pointer-events-none select-none text-white">
            cc
          </div>
          <h1 className="font-medium text-lg hidden md:block text-white hover:text-purple-300 transition-colors">
            {session.title}
          </h1>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-mono text-gray-400 border border-white/5 uppercase tracking-wide">
          {session.language}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex -space-x-2 overflow-hidden">
          {others.map((user) => (
            <UserAvatar
              key={user.connectionId}
              name={user.info?.name}
              src={user.info?.picture}
              color={user.info?.color}
            />
          ))}
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#0a0a0f] bg-white/10 text-xs text-gray-400 font-medium"
            title={`${userCount} active users`}
          >
            +{userCount}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-white/5"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={handleShare}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-purple-900/20"
        >
          Share
        </button>
      </div>
    </header>
  );
}
