import { Room } from "@/components/room";
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditorPageClient from "./editor-page-client";

interface PageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ user?: string }>;
}

export default async function ReviewSessionPage({
  params,
  searchParams,
}: PageProps) {
  const { sessionId } = await params;
  const { user } = await searchParams;

  // Fetch session from DB to get initial code
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  });

  if (!session) {
    notFound();
  }

  return (
    <Room roomId={sessionId} initialCode={session.code} userName={user}>
      <EditorPageClient session={session} />
    </Room>
  );
}
