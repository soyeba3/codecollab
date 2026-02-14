"use client";

import { AnnotationsPanel } from "@/components/annotations-panel";
import { ChatPanel } from "@/components/chat-panel";
import { CodeEditor } from "@/components/code-editor";
import { SessionHeader } from "@/components/session-header";
import { type Session } from "@/types";
import { useState } from "react";

export default function EditorPageClient({ session }: { session: Session }) {
  const [activeTab, setActiveTab] = useState<"code" | "chat" | "annotations">(
    "code",
  );

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Header */}
      <SessionHeader session={session} />

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden flex border-b border-white/5 bg-[#0c0c12]">
        <button
          onClick={() => setActiveTab("code")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "code"
              ? "text-purple-400 border-b-2 border-purple-500"
              : "text-gray-400"
          }`}
        >
          Code
        </button>
        <button
          onClick={() => setActiveTab("annotations")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "annotations"
              ? "text-purple-400 border-b-2 border-purple-500"
              : "text-gray-400"
          }`}
        >
          Annotations
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "chat"
              ? "text-purple-400 border-b-2 border-purple-500"
              : "text-gray-400"
          }`}
        >
          Chat
        </button>
      </div>

      {/* Main Content - Grid Layout */}
      <main className="flex overflow-hidden relative flex-1">
        {/* Left: Annotations */}
        <aside
          className={`w-full lg:w-80 border-r border-white/5 flex-col bg-[#0c0c12] absolute inset-0 lg:static z-20 
                ${activeTab === "annotations" ? "flex" : "hidden lg:flex"}`}
        >
          <div className="flex gap-2 items-center p-4 text-sm font-medium tracking-wider text-gray-400 uppercase border-b border-white/5">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            Annotations
          </div>
          <div className="overflow-y-auto flex-1 p-4 custom-scrollbar">
            <AnnotationsPanel />
          </div>
        </aside>

        {/* Center: Editor */}
        <section
          className={`flex-1 relative min-w-0 bg-[#0a0a0f] h-full
                ${activeTab === "code" ? "block" : "hidden lg:block"}`}
        >
          <CodeEditor />
        </section>

        {/* Right: Chat */}
        <aside
          className={`w-full lg:w-80 border-l border-white/5 flex-col bg-[#0c0c12] absolute inset-0 lg:static z-20
                ${activeTab === "chat" ? "flex" : "hidden lg:flex"}`}
        >
          <div className="flex gap-2 items-center p-4 text-sm font-medium tracking-wider text-gray-400 uppercase border-b border-white/5">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Live Chat
          </div>
          <div className="overflow-hidden relative flex-1">
            <ChatPanel />
          </div>
        </aside>
      </main>
    </div>
  );
}
