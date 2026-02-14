import { type UserMeta } from "@/types";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const { room } = await request.json();

  // For a pet project/resume, we'll assign a random user
  // In a real app, you'd verify the session token from your auth provider here

  const userIndex = Math.floor(Math.random() * 1000);
  const user: UserMeta["info"] = {
    name: `Developer #${userIndex}`,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    picture: `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.random()}`,
  };

  // Identify the user and return the result
  const session = liveblocks.prepareSession(
    `user-${userIndex}`, // Unique user ID
    { userInfo: user },
  );

  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
