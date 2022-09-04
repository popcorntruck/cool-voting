// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { pollRouter } from "./poll";
import { authRouter } from "./auth";
import type { inferProcedureOutput } from "@trpc/server";

export const appRouter = t.router({
  poll: pollRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
