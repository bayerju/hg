import { seed } from "~/server/db/seed";

export async function GET() {
  await seed();
  return Response.json({ message: "Hello World!" });
}
