"use client";

import { useOthers, useStorage } from "@/lib/liveblocks.config";
import { type Session } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ShareModal } from "./share-modal";
import { UserAvatar } from "./user-avatar";

export function SessionHeader({ session }: { session: Session }) {
  const router = useRouter();
  const others = useOthers();
  const userCount = others.length + 1;
  const code = useStorage((root) => root.code);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/session/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseShare = useCallback(() => setShareOpen(false), []);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0a0a0f]/50 backdrop-blur-md z-10 h-16">
        <div className="flex gap-4 items-center">
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="flex justify-center items-center w-8 h-8 text-lg font-bold text-white bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg pointer-events-none select-none">
              cc
            </div>
            <h1 className="hidden text-lg font-medium text-white transition-colors md:block hover:text-purple-300">
              {session.title}
            </h1>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-mono text-gray-400 border border-white/5 uppercase tracking-wide">
            {session.language}
          </span>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex overflow-hidden -space-x-2">
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
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all border border-white/5 ${
              saved
                ? "text-green-400 bg-green-500/20 border-green-500/30"
                : "text-white bg-white/10 hover:bg-white/20"
            }`}
          >
            {saving ? "Saving..." : saved ? "✓ Saved" : "Save"}
          </button>

          <button
            onClick={() => setShareOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md shadow-lg transition-colors hover:bg-purple-500 shadow-purple-900/20"
          >
            Share
          </button>
        </div>
      </header>

      <ShareModal
        isOpen={shareOpen}
        onClose={handleCloseShare}
        shareUrl={
          typeof window !== "undefined"
            ? window.location.origin + window.location.pathname
            : ""
        }
      />
    </>
  );
}
