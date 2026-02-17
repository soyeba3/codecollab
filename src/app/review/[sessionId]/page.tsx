import { db } from "@/db";
import { sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import JoinRoomForm from "./join-room-form";
import ReviewSessionClient from "./review-session-client";

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

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  });

  if (!session) {
    notFound();
  }

  if (!user) {
    return <JoinRoomForm sessionId={sessionId} />;
  }

  return <ReviewSessionClient session={session} userName={user} />;
}
