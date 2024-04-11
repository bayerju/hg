import { UserJSON, UserWebhookEvent, WebhookEvent } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(request: Request) {
  const payload: UserWebhookEvent = await request.json();
  if (payload.type !== "user.created") {
    return Response.json({ message: "OK" });
  }
  console.log(payload.data);
  const email = payload.data.email_addresses[0]?.email_address;
  if (email === null) {
    throw new Error("Email is null");
  }
  if (email === undefined) {
    throw new Error("Email is undefined");
  }
  if (payload.data.username === null) {
    throw new Error("Username is null");
  }
  if (payload.data.username === undefined) {
    throw new Error("Username is undefined");
  }
  if (email !== null && payload.data.username != null) {
    await db.insert(users).values({
      username: payload.data.username,
      email: email,
      clerkId: payload.data.id,
    });
  }
  return Response.json({ message: "OK" });
}

export async function GET() {
  return Response.json({ message: "Hello World!" });
}
