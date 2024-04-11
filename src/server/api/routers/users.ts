import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  findByUsername: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.users.findMany({
        where: (users, op) => op.ilike(users.username, input.username),
        limit: 10,
      });
    }),
});
