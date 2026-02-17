"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinRoomForm({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (!name.trim()) return;
    router.replace(
      `/review/${sessionId}?user=${encodeURIComponent(name.trim())}`,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="p-8 space-y-6 rounded-2xl border shadow-2xl backdrop-blur-xl bg-white/5 border-white/10">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center font-bold text-lg text-white">
                cc
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Join Session</h2>
            <p className="text-sm text-gray-400">
              Someone invited you to collaborate. Enter your name to join.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="join-name"
              className="ml-1 text-sm font-medium text-gray-300"
            >
              Your name
            </label>
            <input
              id="join-name"
              type="text"
              autoFocus
              placeholder="e.g. John"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className="px-4 py-3 w-full font-medium text-white rounded-xl border transition-all bg-black/20 border-white/10 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 active:scale-[0.98]"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
