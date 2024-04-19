import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { seed } from "~/server/db/seed";

export const usersRouter = createTRPCRouter({
  findByUsername: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.query.users.findMany({
        where: (users, op) => op.ilike(users.username, `${input.username}%`),
        limit: 10,
      });
      return users;
    }),
});
