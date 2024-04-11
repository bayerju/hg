import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { spendings } from "~/server/db/schema";

export const spendingsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    const id = ctx.auth.userId;
    console.log("id", id);
    return ctx.db.query.spendings.findMany();
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        price: z.number().int().min(1),
        // payedBy: z.enum(PayedByOptions),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // const resp = await ctx.db.insert(payments).values({
      //   name: input.name,
      //   price: input.price,
      //   payedBy: input.payedBy,
      // });
      // return resp;
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.spendings.findFirst({
      orderBy: (spendings, { desc }) => [desc(spendings.createdAt)],
    });
  }),
});
