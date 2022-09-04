import type { PollVote, Prisma } from "@prisma/client";
import React, { useState } from "react";
import { useDatabaseChange } from "../utils/supabase";
import { trpc } from "../utils/trpc";
import { Spinner } from "./ui/Spinner";
import { VoteResultsBar } from "./VoteResultsBar";

interface VoteResultsBarControllerProps {
  pollId: string;
}

export const VoteResultsBarController: React.FC<
  React.PropsWithChildren<VoteResultsBarControllerProps>
> = ({ pollId }) => {
  const tctx = trpc.proxy.useContext();
  // const { data, isLoading, error, refetch } =
  //   trpc.proxy.poll.getByIdWithVotes.useQuery(
  //     {
  //       id: pollId,
  //     },
  //     {
  //       cacheTime: Infinity,
  //       refetchInterval: false,
  //       refetchOnMount: false,
  //       refetchOnWindowFocus: false,
  //     }
  //   );

  const {
    data: pollData,
    isLoading: pollIsLoading,
    error: pollError,
  } = trpc.proxy.poll.getById.useQuery(
    {
      id: pollId,
    },
    {
      cacheTime: Infinity,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: votesData,
    isLoading: votesIsLoading,
    error: votesError,
    refetch: refetchVotes,
  } = trpc.proxy.poll.getVotes.useQuery(
    {
      pollId: pollId,
    },
    {
      cacheTime: Infinity,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  // const { data, isLoading, error, refetch } =
  //   trpc.proxy.poll.getByIdWithVotes.useQuery(
  //     {
  //       id: pollId,
  //     },
  //     {
  //       cacheTime: Infinity,
  //       refetchInterval: false,
  //       refetchOnMount: false,
  //       refetchOnWindowFocus: false,
  //     }
  //   );
  useDatabaseChange(
    {
      event: "*",
      schema: "public",
      table: "PollVote",
      filter: `pollId=eq.${pollId}`,
    },
    ({ eventType, new: newOne }: { eventType: "INSERT"; new: PollVote }) => {
      tctx.poll.getVotes.setData(
        (u) => {
          const option = u?.find((v) => v.choice === newOne.choice);

          if (!option || option === undefined) {
            refetchVotes();
            return u!;
          }

          const newVotes = [...u!];

          newVotes[newOne.choice - 1] = {
            ...option,
            _count: option._count + 1,
          };

          return newVotes;
        },
        {
          pollId,
        }
      );

      // refetch();
    }
  );

  if (pollIsLoading) {
    return <Spinner size="4" />;
  }

  if (pollError || !pollData || !pollData.poll) {
    return <h4>Poll not found</h4>;
  }

  return <VoteResultsBar poll={pollData.poll} votes={votesData || []} />;
};
