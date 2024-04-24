import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { clearingToUsers, clearings } from "~/server/db/schema";
import { isNil } from "lodash";
import { SimpleUserSchema } from "~/types/simple_user";

export const clearingsRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const id = ctx.auth.userId;
    if (!id) throw new Error("No user id");
    // TODO: fix findmany to give Ids and then fix querying clearings
    const clearingToUsers = await ctx.db.query.clearingToUsers.findMany({
      where: (clearingToUser, op) => op.eq(clearingToUser.clerkId, id),
    });
    const clearings = await ctx.db.query.clearings.findMany({
      with: {
        users: true,
      },
      where: (clearing, op) =>
        op.inArray(
          clearing.id,
          clearingToUsers.map((iUser) => iUser.clearingId),
        ),
    });
    return clearings;
  }),
  create: publicProcedure
    .input(
      z.object({
        involvedUsers: z.array(SimpleUserSchema),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const clearing = await tx
          .insert(clearings)
          .values({ name: input.name })
          .returning();
        if (clearing.length < 1 || isNil(clearing[0])) {
          tx.rollback();
          throw new Error("Could not create clearing");
        }
        await tx.insert(clearingToUsers).values(
          input.involvedUsers.map((iUser) => ({
            clearingId: clearing[0]!.id,
            clerkId: iUser.clerkId,
          })),
        );
      });
      console.log("input", input);
      return result;
    }),
});
