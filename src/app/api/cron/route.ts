import { NextResponse } from "next/server";

export async function GET() {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

  if (!socketUrl) {
    return NextResponse.json(
      { ok: false, error: "Socket URL not defined" },
      { status: 400 },
    );
  }

  try {
    // Ping the socket server to keep it alive
    const response = await fetch(socketUrl);

    return NextResponse.json({
      ok: true,
      status: response.status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron ping failed:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to ping server" },
      { status: 500 },
    );
  }
}
