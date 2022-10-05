import type { Poll, Prisma } from "@prisma/client";
import React from "react";
import { motion } from "framer-motion";

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

  const votePercentsArr = poll.options.map(
    (_, idx) =>
      getPercent(votes?.find(({ choice }) => choice === idx + 1)?._count) || 0
  );
  const winner = votePercentsArr.indexOf(Math.max(...votePercentsArr));

  console.log("WINNER", winner);

  return (
    <div className="space-y-3">
      {poll.options.map((d, idx) => {
        const percent = getPercent(
          votes?.find(({ choice }) => choice === idx + 1)?._count
        )?.toFixed();
        return (
          <div
            className="w-full h-24 rounded p-5 flex justify-between items-center  border border-zinc-700"
            style={{
              background: `linear-gradient(to right, ${
                poll.ended
                  ? idx === winner
                    ? `rgb(219, 39, 119)`
                    : `#27272A`
                  : `rgb(34, 197, 94)`
              } ${percent}%, transparent ${percent}% 100%)`,
            }}
            key={`pq_idx_${idx}`}
          >
            <h4>{idx + 1}.</h4>
            {/* // */}
            <h4>{d}</h4>

            <h4>{percent}%</h4>
          </div>
        );
      })}
    </div>
  );
};
