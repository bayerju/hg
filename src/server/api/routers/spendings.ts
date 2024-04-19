import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  spendings,
  usersToSpendingsAffected,
  usersToSpendingsPayed,
} from "~/server/db/schema";
import { unionBy } from "lodash";

export const spendingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const id = ctx.auth.userId;
    if (!id) throw new Error("No user id");
    console.log("id", id);
    const spendingsAffected =
      await ctx.db.query.usersToSpendingsAffected.findMany({
        where: (userToSpending, op) => op.eq(userToSpending.clerkId, id),
      });
    const spendingsPayed = await ctx.db.query.usersToSpendingsPayed.findMany({
      where: (userToSpending, op) => op.eq(userToSpending.clerkId, id),
    });
    const spendingsRelations = unionBy(
      spendingsAffected,
      spendingsPayed,
      "spendingId",
    );

    if (spendingsRelations.length === 0) return [];

    const spendings = (
      await ctx.db.query.spendings.findMany({
        where: (spendings, op) =>
          op.inArray(
            spendings.id,
            spendingsRelations.map((i) => i.spendingId),
          ),
        with: {
          usersAffected: {
            with: {
              user: true,
            },
          },
          usersPayed: { with: { user: true } },
        },
      })
    ).map((iSpending) => ({
      ...iSpending,
      haveIPayed:
        iSpending.usersPayed.filter(
          (iUser) => iUser.clerkId === ctx.auth.userId,
        ).length > 0,
      amIAffected:
        iSpending.usersAffected.filter(
          (iUser) => iUser.clerkId === ctx.auth.userId,
        ).length > 0,
    }));
    return spendings;
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        price: z.number().int().min(1),
        payedByIds: z.array(z.string()),
        payedForIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (tx) => {
        const spending = await tx
          .insert(spendings)
          .values({
            name: input.name,
            amount: input.price,
          })
          .returning();

        await tx.insert(usersToSpendingsAffected).values(
          input.payedForIds.map((clerkId) => ({
            spendingId: spending[0]?.id,
            clerkId: clerkId,
          })),
        );

        await tx.insert(usersToSpendingsPayed).values(
          input.payedByIds.map((clerkId) => ({
            spendingId: spending[0]?.id,
            clerkId: clerkId,
          })),
        );

        return spending[0];
      });

      return result;
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.spendings.findFirst({
      orderBy: (spendings, { desc }) => [desc(spendings.createdAt)],
    });
  }),
});
