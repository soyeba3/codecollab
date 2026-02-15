"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const startSession = async () => {
    if (!username.trim()) return;
    setLoading(true);
    // In a real app, you might want to create the session in DB here
    // but for now we can just redirect and create it on the join/first load if needed
    // OR we can create it via API.
    // Let's create via API to be safe and consistent with the plan.

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Session",
          language: "javascript",
        }),
      });

      if (!res.ok) throw new Error("Failed to create session");

      const session = await res.json();
      router.push(`/review/${session.id}?user=${encodeURIComponent(username)}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 space-y-8 w-full max-w-2xl text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-200 md:text-7xl">
            CodeCollab
          </h1>
          <p className="mx-auto max-w-lg text-lg leading-relaxed text-gray-400 md:text-xl">
            Real-time collaborative code review. Share snippets, debug together,
            and ship faster.
          </p>
        </div>

        <div className="p-8 space-y-6 rounded-2xl border shadow-2xl backdrop-blur-xl bg-white/5 border-white/10">
          <div className="space-y-2 text-left">
            <label
              htmlFor="username"
              className="ml-1 text-sm font-medium text-gray-300"
            >
              Enter your name to join
            </label>
            <input
              id="username"
              type="text"
              placeholder="e.g. Soyeb"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 w-full font-medium text-white rounded-xl border transition-all bg-black/20 border-white/10 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              onKeyDown={(e) => e.key === "Enter" && startSession()}
            />
          </div>

          <button
            onClick={startSession}
            disabled={loading || !username.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex gap-2 justify-center items-center">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Session...
              </span>
            ) : (
              "Start Collaborating"
            )}
          </button>
        </div>

        <p className="text-sm text-gray-500">
          No sign-up required. Just enter a name and start sharing.
        </p>
      </div>
    </main>
  );
}
