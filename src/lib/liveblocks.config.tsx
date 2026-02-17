"use client";

import {
  Annotation,
  ChatMessage,
  ClientToServerEvents,
  RoomState,
  ServerToClientEvents,
  User,
  UserInfo,
} from "@/server/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import io from "socket.io-client";

interface RoomContextType {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  roomId: string;
  roomState: RoomState | null;
  currentUser: User | null;
  others: User[];
  isConnected: boolean;
  updateMyPresence: (presence: {
    cursor: { line: number; column: number } | null;
  }) => void;
}

export const RoomContext = createContext<RoomContextType | null>(null);

export interface RoomProviderProps {
  id: string;
  initialPresence: { cursor: { line: number; column: number } | null };
  initialStorage?: unknown;
  initialCode?: string;
  children: ReactNode;
}

export function RoomProvider({ id, initialCode, children }: RoomProviderProps) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [userInfo] = useState<UserInfo>(() => ({
    name: "Anonymous",
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    picture: `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.random()}`,
  }));

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
    
    const socketInstance: Socket<ServerToClientEvents, ClientToServerEvents> =
      io(socketUrl, {
        path: "/socket.io",
      });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setIsConnected(true);
      socketInstance.emit("join-room", id, userInfo, initialCode);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("room-state", (state: RoomState) => {
      setRoomState(state);
      const me = state.users.find(
        (u: User) => u.socketId === socketInstance.id,
      );
      if (me) setCurrentUser(me);
    });

    socketInstance.on("user-joined", (user: User) => {
      setRoomState((prev) => {
        if (!prev) return null;
        if (prev.users.find((u) => u.id === user.id)) return prev;
        return { ...prev, users: [...prev.users, user] };
      });
    });

    socketInstance.on("user-left", (userId: string) => {
      setRoomState((prev) => {
        if (!prev) return null;
        return { ...prev, users: prev.users.filter((u) => u.id !== userId) };
      });
    });

    socketInstance.on(
      "cursor-update",
      (userId: string, cursor: { line: number; column: number } | null) => {
        setRoomState((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            users: prev.users.map((u) =>
              u.id === userId ? { ...u, cursor } : u,
            ),
          };
        });
      },
    );

    socketInstance.on("code-update", (code: string) => {
      setRoomState((prev) => {
        if (!prev) return null;
        return { ...prev, code };
      });
    });

    socketInstance.on("annotation-added", (annotation: Annotation) => {
      setRoomState((prev) => {
        if (!prev) return null;
        return { ...prev, annotations: [...prev.annotations, annotation] };
      });
    });

    socketInstance.on("annotation-deleted", (annotationId: string) => {
      setRoomState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          annotations: prev.annotations.filter((a) => a.id !== annotationId),
        };
      });
    });

    socketInstance.on("chat-received", (message: ChatMessage) => {
      setRoomState((prev) => {
        if (!prev) return null;
        return { ...prev, chatMessages: [...prev.chatMessages, message] };
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [id, userInfo, initialCode]);

  const updateMyPresence = useCallback(
    (presence: { cursor: { line: number; column: number } | null }) => {
      if (!socket || !isConnected) return;
      if (presence.cursor) {
        socket.emit("cursor-move", presence.cursor);
      }
    },
    [socket, isConnected],
  );

  const others = roomState
    ? roomState.users.filter((u) => u.id !== currentUser?.id)
    : [];

  return (
    <RoomContext.Provider
      value={{
        socket,
        roomId: id,
        roomState,
        currentUser,
        others,
        isConnected,
        updateMyPresence,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) throw new Error("useRoom must be used within a RoomProvider");
  return context;
}

export function useMyPresence() {
  const context = useContext(RoomContext);
  if (!context)
    throw new Error("useMyPresence must be used within a RoomProvider");

  const presence = context.currentUser?.cursor
    ? { cursor: context.currentUser.cursor }
    : { cursor: null };
  return [presence, context.updateMyPresence] as const;
}

export function useOthers() {
  const context = useContext(RoomContext);
  if (!context) throw new Error("useOthers must be used within a RoomProvider");

  return context.others.map((user) => ({
    connectionId: user.id,
    presence: { cursor: user.cursor },
    info: user.info,
  }));
}

export function useSelf() {
  const context = useContext(RoomContext);
  if (!context) throw new Error("useSelf must be used within a RoomProvider");
  if (!context.currentUser) return null;

  return {
    connectionId: context.currentUser.id,
    presence: { cursor: context.currentUser.cursor },
    info: context.currentUser.info,
  };
}

export function useStorage<T>(selector: (root: RoomState) => T) {
  const context = useContext(RoomContext);
  if (!context)
    throw new Error("useStorage must be used within a RoomProvider");
  if (!context.roomState) return null;
  return selector(context.roomState);
}

export function useMutation<TArgs extends unknown[]>(
  callback: (
    context: { storage: { get: (key: string) => unknown } },
    ...args: TArgs
  ) => void,
  deps: unknown[],
) {
  const context = useContext(RoomContext);

  return useCallback(
    (...args: TArgs) => {
      if (!context || !context.socket) return;

      const storageShim = {
        get: (key: string) => {
          if (key === "code")
            return {
              set: (val: string) => context.socket!.emit("code-change", val),
            };
          if (key === "annotations")
            return {
              push: (
                val: Omit<
                  Annotation,
                  "id" | "userId" | "userInfo" | "createdAt"
                >,
              ) => context.socket!.emit("annotation-add", val),
              delete: (idx: number) => {
                const annotation = context.roomState?.annotations[idx];
                if (annotation)
                  context.socket!.emit("annotation-delete", annotation.id);
              },
            };
          if (key === "chatMessages")
            return {
              push: (val: { text: string }) =>
                context.socket!.emit("chat-message", val.text),
            };
          return { push: () => {}, delete: () => {}, set: () => {} };
        },
      };

      callback({ storage: storageShim }, ...args);
    },
    // eslint-disable-next-line react-hooks/use-memo
    [context, callback, ...deps],
  );
}

export const ClientSideSuspense = ({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: () => ReactNode;
}) => {
  const context = useContext(RoomContext);
  if (!context || !context.isConnected || !context.roomState) return fallback;
  return children();
};
