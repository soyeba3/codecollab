"use client";

import { RoomProvider } from "@/lib/liveblocks.config";
import { LiveList } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { ReactNode } from "react";

interface RoomProps {
  children: ReactNode;
  roomId: string;
  initialCode?: string;
}

export function Room({ children, roomId, initialCode = "" }: RoomProps) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
      initialStorage={{
        code: initialCode,
        annotations: new LiveList([]),
        chatMessages: new LiveList([]),
      }}
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
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent"></div>
        <p className="text-gray-400 animate-pulse">Entering secure room...</p>
      </div>
    </div>
  );
}
