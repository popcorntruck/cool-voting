import type { Poll, Prisma } from "@prisma/client";
import React from "react";

interface VoteResultsBarProps {
  poll: Poll;
  votes: (Prisma.PickArray<Prisma.PollVoteGroupByOutputType, "choice"[]> & {
    _count: number;
  })[];
}

export const VoteResultsBar: React.FC<
  React.PropsWithChildren<VoteResultsBarProps>
> = ({ poll, votes }) => {
  let totalVotes = 0;
  const getTotalVotes = (votes: any) => {
    votes?.map((choice: { _count: number }) => {
      totalVotes += choice._count;
    });
  };

  const getPercent = (voteCount: any) => {
    if (voteCount !== undefined && totalVotes > 0)
      return (voteCount / totalVotes) * 100;
    else if (voteCount == undefined) return 0;
  };

  getTotalVotes(votes);

  return (
    <div className="space-y-3">
      {poll.options.map((d, idx) => (
        <div
          className="w-full h-24 rounded p-5 flex justify-between items-center bg-green border border-zinc-700"
          style={{
            background: `linear-gradient(to right, rgb(34, 197, 94) ${getPercent(
              votes?.find(({ choice }) => choice === idx + 1)?._count
            )?.toFixed()}%, transparent ${getPercent(
              votes?.find(({ choice }) => choice === idx + 1)?._count
            )?.toFixed()}% 100%)`,
          }}
          key={`pq_idx_${idx}`}
        >
          <h4>{idx + 1}.</h4>
          <h4>{d}</h4>

          <h4>
            {getPercent(
              votes?.find(({ choice }) => choice === idx + 1)?._count
            )?.toFixed()}
            %
          </h4>
        </div>
      ))}
    </div>
  );
};
