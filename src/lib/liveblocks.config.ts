import { createClient, LiveList } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

import { type Annotation, type ChatMessage, type UserMeta } from "@/types";

// Presence represents the properties that exist on every user in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
type Presence = {
  cursor: { line: number; column: number } | null;
};

// Storage represents the shared document that persists in the Room, even after
// all users leave. Fields under Storage typically are LiveList, LiveMap,
// LiveObject instances, for which updates are automatically persisted and
// synced to all connected clients.
type Storage = {
  code: string;
  annotations: LiveList<Annotation>;
  chatMessages: LiveList<ChatMessage>;
};

// UserMeta represents static/readonly metadata on each user, as provided by
// your own custom auth backend (if used). Useful for data that will not change
// during a session, like a user's name or avatar.
// Imported from @/types

// Optionally, the type of custom events broadcast and listened to in this
// room. Use a union for multiple events. Must be JSON-serializable.
type RoomEvent = Record<string, never>;

// ThreadMetadata represents metadata on each thread.
export type ThreadMetadata = Record<string, never>;

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useUser,
    useCreateThread,
    useEditThreadMetadata,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(
  client,
);
