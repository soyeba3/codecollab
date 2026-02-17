import { type Server as HttpServer } from "http";
import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import {
  Annotation,
  ChatMessage,
  ClientToServerEvents,
  InterServerEvents,
  RoomState,
  ServerToClientEvents,
  SocketData,
  User,
  UserInfo,
} from "./types";

// In-memory store for rooms (in production, use Redis)
const rooms = new Map<string, RoomState>();

// Helper to get or create room
const getOrCreateRoom = (
  roomId: string,
  initialCode: string = "",
): RoomState => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      roomId,
      code: initialCode, // Should load from DB here ideally
      users: [],
      annotations: [],
      chatMessages: [],
      lastUpdated: Date.now(),
    });
  }
  return rooms.get(roomId)!;
};

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on(
    "connection",
    (
      socket: Socket<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >,
    ) => {
      console.log(`Client connected: ${socket.id}`);

      // Join Room Handler
      socket.on(
        "join-room",
        (roomId: string, userInfo: UserInfo, initialCode?: string) => {
          const previousRoomId = socket.data.roomId;
          if (previousRoomId) {
            socket.leave(previousRoomId);
          }

          socket.join(roomId);

          const userId = socket.id;
          socket.data.roomId = roomId;
          socket.data.userId = userId;
          socket.data.userInfo = userInfo;

          const room = getOrCreateRoom(roomId, initialCode || "");

          const newUser: User = {
            id: userId,
            socketId: socket.id,
            info: userInfo,
            cursor: null,
            joinedAt: Date.now(),
          };

          room.users.push(newUser);

          socket.emit("room-state", room);

          socket.to(roomId).emit("user-joined", newUser);

          console.log(`User ${userInfo.name} joined room ${roomId}`);
        },
      );

      // Cursor Movement
      socket.on("cursor-move", (position) => {
        const { roomId, userId } = socket.data;
        if (!roomId || !userId) return;

        const room = rooms.get(roomId);
        if (room) {
          const user = room.users.find((u) => u.id === userId);
          if (user) {
            user.cursor = position;
            // Broadcast cursor update to others (throttle this in production)
            socket.to(roomId).emit("cursor-update", userId, position);
          }
        }
      });

      // Code Changes
      socket.on("code-change", (newCode) => {
        const { roomId } = socket.data;
        if (!roomId) return;

        const room = rooms.get(roomId);
        if (room) {
          room.code = newCode;
          room.lastUpdated = Date.now();
          // Broadcast code update to others (debounce/throttle this on client side mostly)
          socket.to(roomId).emit("code-update", newCode);

          // TODO: Ideally verify timestamp/version to handle conflicts
          // TODO: Save to DB periodically (debounced)
        }
      });

      // Annotations
      socket.on("annotation-add", (annotationData) => {
        const { roomId, userId, userInfo } = socket.data;
        if (!roomId || !userId || !userInfo) return;

        const room = rooms.get(roomId);
        if (room) {
          const newAnnotation: Annotation = {
            id: nanoid(),
            ...annotationData,
            userId,
            userInfo,
            createdAt: Date.now(),
          };

          room.annotations.push(newAnnotation);
          io.to(roomId).emit("annotation-added", newAnnotation);
        }
      });

      socket.on("annotation-delete", (annotationId) => {
        const { roomId } = socket.data;
        if (!roomId) return;

        const room = rooms.get(roomId);
        if (room) {
          const index = room.annotations.findIndex(
            (a) => a.id === annotationId,
          );
          if (index !== -1) {
            room.annotations.splice(index, 1);
            io.to(roomId).emit("annotation-deleted", annotationId);
          }
        }
      });

      // Chat
      socket.on("chat-message", (text) => {
        const { roomId, userId, userInfo } = socket.data;
        if (!roomId || !userId || !userInfo) return;

        const room = rooms.get(roomId);
        if (room) {
          const newMessage: ChatMessage = {
            id: nanoid(),
            text,
            userId,
            userInfo,
            timestamp: Date.now(),
          };

          room.chatMessages.push(newMessage);
          io.to(roomId).emit("chat-received", newMessage);
        }
      });

      // Disconnect
      socket.on("disconnect", () => {
        const { roomId, userId } = socket.data;
        if (roomId && userId) {
          const room = rooms.get(roomId);
          if (room) {
            room.users = room.users.filter((u) => u.id !== userId);
            // Broadcast user left
            socket.to(roomId).emit("user-left", userId);

            // Cleanup empty rooms immediately or after timeout
            if (room.users.length === 0) {
              // Optional: Persist final state to DB before deleting
              rooms.delete(roomId);
            }
          }
        }
        console.log(`Client disconnected: ${socket.id}`);
      });
    },
  );

  return io;
};
