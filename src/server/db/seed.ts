import { clerkClient } from "@clerk/nextjs";
import { db } from ".";
import { users } from "./schema";

export async function seed() {
  const clerkUsers = await clerkClient.users.getUserList();
  await db
    .insert(users)
    .values(
      clerkUsers.map((iUser) => ({
        clerkId: iUser.id,
        username:
          iUser.username ?? (Math.random() + 1).toString(36).substring(10),
        email: iUser.emailAddresses[0]?.emailAddress,
      })),
    )
    .onConflictDoNothing()
    .execute();
}
