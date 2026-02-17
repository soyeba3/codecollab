"use client";

import { Room } from "@/components/room";
import { type Session } from "@/types";
import EditorPageClient from "./editor-page-client";

interface ReviewSessionClientProps {
  session: Session;
  userName: string;
}

export default function ReviewSessionClient({
  session,
  userName,
}: ReviewSessionClientProps) {
  return (
    <Room roomId={session.id} initialCode={session.code} userName={userName}>
      <EditorPageClient session={session} />
    </Room>
  );
}
