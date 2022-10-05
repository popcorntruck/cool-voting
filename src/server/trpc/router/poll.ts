import { authedProcedure, t, voterTokenMiddleware } from "../trpc";
import { z } from "zod";
import { createPollValidator } from "../../../shared/createPollValidator";
import { TRPCError } from "@trpc/server";

export const pollRouter = t.router({
  create: authedProcedure
    .input(createPollValidator)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.poll.create({
        data: {
          question: input.question,
          options: input.options.map(({ option }) => option),
          ownerId: ctx.session.user.id,
        },
      });
    }),
  getMyPolls: authedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.poll.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });
  }),
  getById: voterTokenMiddleware
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const poll = await ctx.prisma.poll.findUnique({
        where: {
          id: input.id,
        },
        include: {
          votes: {
            where: {
              voteToken: ctx.voterToken,
            },
            select: { id: true, choice: true },
          },
        },
      });

      if (!poll) return null;

      return {
        isMine: !!ctx.session && poll.ownerId === ctx.session.user?.id,
        poll,
        alreadyVoted: poll.votes.length !== 0,
      };
    }),
  getByIdWithVotes: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const poll = await ctx.prisma.poll.findUnique({
        where: {
          id: input.id,
        },
      });
      const votes = await ctx.prisma.pollVote.groupBy({
        where: { pollId: input.id },
        by: ["choice"],
        _count: true,
      });

      return {
        poll,
        votes,
      };
    }),
  getVotes: t.procedure
    .input(z.object({ pollId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.pollVote.groupBy({
        where: { pollId: input.pollId },
        by: ["choice"],
        _count: true,
      });
    }),
  vote: voterTokenMiddleware
    .input(z.object({ pollId: z.string(), choice: z.number().min(1).max(4) }))
    .mutation(async ({ ctx, input }) => {
      if (
        await ctx.prisma.pollVote.findFirst({
          where: {
            voteToken: ctx.voterToken,
            pollId: input.pollId,
          },
        })
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have already voted on this poll",
        });
      }

      if (
        (
          await ctx.prisma.poll.findUnique({
            where: {
              id: input.pollId,
            },
          })
        )?.ended
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can't vote on an inactive poll",
        });
      }

      return await ctx.prisma.pollVote.create({
        data: {
          pollId: input.pollId,
          choice: input.choice,
          voteToken: ctx.voterToken,
        },
      });
    }),

  endPoll: authedProcedure
    .input(z.object({ pollId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.poll.updateMany({
        data: {
          ended: true,
        },
        where: {
          id: input.pollId,
          ownerId: ctx.session.user.id,
        },
      });
    }),
});
