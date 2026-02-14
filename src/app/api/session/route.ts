import { db } from "@/db";
import { sessions } from "@/db/schema";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, language, code } = await req.json();

    const sessionId = nanoid(10);

    await db.insert(sessions).values({
      id: sessionId,
      title: title || "Untitled Session",
      language: language || "javascript",
      code: code || "// Start coding here...",
    });

    return NextResponse.json({ id: sessionId });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
