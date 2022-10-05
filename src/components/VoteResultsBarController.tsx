import type { PollVote, Prisma } from "@prisma/client";
import React, { useState } from "react";
import { useDatabaseChange } from "../utils/supabase";
import { trpc } from "../utils/trpc";
import { AutoAnimate } from "./AutoAnimate";
import { Spinner } from "./ui/Spinner";
import { VoteResultsBar } from "./VoteResultsBar";

interface VoteResultsBarControllerProps {
  pollId: string;
  isEmbed?: boolean;
}

export const VoteResultsBarController: React.FC<
  React.PropsWithChildren<VoteResultsBarControllerProps>
> = ({ pollId, isEmbed = false }) => {
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

  if (!isEmbed)
    return <VoteResultsBar poll={pollData.poll} votes={votesData || []} />;

  return (
    <AutoAnimate className="space-y-2">
      {isEmbed && pollData.poll.ended && (
        <div className="bg-zinc-800 rounded-lg p-2 bg-opacity-50">
          <h4>Poll Ended!</h4>
        </div>
      )}
      <VoteResultsBar poll={pollData.poll} votes={votesData || []} />
    </AutoAnimate>
  );
};
