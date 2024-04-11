import { UserJSON, UserWebhookEvent, WebhookEvent } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(request: Request) {
  const payload: UserWebhookEvent = await request.json();
  if (payload.type !== "user.created") {
    return Response.json({ message: "OK" });
  }
  console.log(payload.data);
  db.insert(users).values({
    clerkId: payload.data.id,
    username: payload.data.username,
    email: payload.data.email_addresses[0]?.email_address,
  });
  return Response.json({ message: "OK" });
}

export async function GET() {
  return Response.json({ message: "Hello World!" });
}
