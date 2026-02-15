export type UserInfo = {
  name: string;
  color: string;
  picture: string;
};

export type User = {
  id: string;
  socketId: string;
  info: UserInfo;
  cursor: { line: number; column: number } | null;
  joinedAt: number;
};

export type Annotation = {
  id: string;
  line: number;
  text: string;
  userId: string;
  userInfo: UserInfo;
  createdAt: number;
};

export type ChatMessage = {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
  userInfo: UserInfo;
};

export type RoomState = {
  roomId: string;
  code: string;
  users: User[];
  annotations: Annotation[];
  chatMessages: ChatMessage[];
  lastUpdated: number;
};

// Client -> Server Events
export interface ClientToServerEvents {
  "join-room": (
    roomId: string,
    userInfo: UserInfo,
    initialCode?: string,
  ) => void;
  "leave-room": () => void;
  "cursor-move": (position: { line: number; column: number }) => void;
  "code-change": (code: string) => void;
  "annotation-add": (
    annotation: Omit<Annotation, "id" | "userId" | "userInfo" | "createdAt">,
  ) => void;
  "annotation-delete": (annotationId: string) => void;
  "chat-message": (message: string) => void;
}

// Server -> Client Events
export interface ServerToClientEvents {
  "room-state": (state: RoomState) => void;
  "user-joined": (user: User) => void;
  "user-left": (userId: string) => void;
  "cursor-update": (
    userId: string,
    position: { line: number; column: number } | null,
  ) => void;
  "code-update": (code: string) => void;
  "annotation-added": (annotation: Annotation) => void;
  "annotation-deleted": (annotationId: string) => void;
  "chat-received": (message: ChatMessage) => void;
  error: (message: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  roomId: string;
  userId: string;
  userInfo: UserInfo;
}
