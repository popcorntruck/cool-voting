import type { Poll } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { TbCircle, TbCircleDot, TbCheck } from "react-icons/tb";
import { trpc } from "../utils/trpc";
import { Spinner } from "./ui/Spinner";

interface VotePageBoxProps {
  poll: Poll;
}

export const VotePageBox: React.FC<
  React.PropsWithChildren<VotePageBoxProps>
> = ({ poll }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const { mutate, isLoading, isSuccess } = trpc.proxy.poll.vote.useMutation();

  if (isSuccess) {
    return (
      <div className="flex items-center space-x-2">
        <TbCheck size={24} />
        <h4>You have voted!</h4>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 border rounded-md border-zinc-700 p-4 md:w-4/6 w-3/4">
      <h4>{poll.question}</h4>

      {poll.options.map((q, idx) => (
        <Button
          key={`q_${idx}`}
          className="w-5/4 justify-between flex"
          onClick={() => setSelected(idx)}
        >
          {q}
          {selected === idx ? (
            <TbCircleDot size={24} />
          ) : (
            <TbCircle size={24} />
          )}
        </Button>
      ))}

      <div className="border-b border-zinc-700" />

      <Button
        color="secondary"
        disabled={selected === null}
        className="flex justify-between"
        onClick={() => {
          console.log(selected);
          if (selected !== null) {
            mutate({
              pollId: poll.id,
              choice: selected + 1,
            });
          }
        }}
      >
        {isLoading ? "Voting..." : "Vote!"} {isLoading && <Spinner />}
      </Button>
    </div>
  );
};
