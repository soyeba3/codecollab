import { Room } from "@/components/room";
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditorPageClient from "./editor-page-client";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ReviewSessionPage({ params }: PageProps) {
  const { sessionId } = await params;

  // Fetch session from DB to get initial code
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  });

  if (!session) {
    notFound();
  }

  return (
    <Room roomId={sessionId} initialCode={session.code}>
      <EditorPageClient session={session} />
    </Room>
  );
}
