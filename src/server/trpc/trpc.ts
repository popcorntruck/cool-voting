import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import superjson from "superjson";
import { randomUUID } from "crypto";

export const t = initTRPC<{ ctx: Context }>()({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      // infers that `session` is non-nullable to downstream resolvers
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const voterTokenMiddleware = t.procedure.use(({ ctx, next }) => {
  let token = ctx.req.cookies["v_t"];

  if (!token) {
    token = randomUUID();

    ctx.res.setHeader("Set-Cookie", `v_t=${token}; HttpOnly; SameSite=Lax`);
  }

  return next({
    ctx: {
      ...ctx,
      voterToken: token,
    },
  });
});
