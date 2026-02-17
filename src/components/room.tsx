"use client";

import { ClientSideSuspense, RoomProvider } from "@/lib/liveblocks.config";
import { ReactNode } from "react";

interface RoomProps {
  children: ReactNode;
  roomId: string;
  initialCode?: string;
  userName?: string;
}

export function Room({
  children,
  roomId,
  initialCode = "",
  userName,
}: RoomProps) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
      initialCode={initialCode}
      userName={userName}
    >
      <ClientSideSuspense fallback={<LoadingState />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

function LoadingState() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0f] text-white">
      <div className="flex flex-col gap-4 items-center">
        <div className="w-12 h-12 rounded-full border-4 animate-spin border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent"></div>
        <p className="text-gray-400 animate-pulse">Entering secure room...</p>
      </div>
    </div>
  );
}
