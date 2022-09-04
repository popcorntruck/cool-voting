import type { Poll } from "@prisma/client";
import React, { useState } from "react";
import NextLink from "next/link";
import { FiCopy } from "react-icons/fi";

interface DashboardPollCardProps {
  poll: Poll & {
    _count: {
      votes: number;
    };
  };
}

const copyUrlToClipboard = (path: string) => {
  if (!process.browser) return;
  navigator.clipboard.writeText(`${window.location.origin}${path}`);
};

export const DashboardPollCard: React.FC<
  React.PropsWithChildren<DashboardPollCardProps>
> = ({ poll }) => {
  const [voteCopied, setVoteCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  return (
    <button className="bg-zinc-800 p-3 rounded h-28 w-[20rem]">
      <NextLink href={`/${poll.id}`}>
        <div>
          {poll.question}
          <p className="bold">{poll._count.votes} Votes</p>
          <div className="border-b border-zinc-700 my-1" />
        </div>
      </NextLink>

      <div className="grid grid-cols-2 divide-x divide-zinc-700">
        <button
          className="p-1 flex gap-2 justify-center"
          onClick={() => {
            copyUrlToClipboard(`/vote/${poll.id}`);
            setVoteCopied(true);

            setTimeout(() => {
              setVoteCopied(false);
            }, 2000);
          }}
        >
          <FiCopy size={24} />
          {voteCopied ? "Copied!" : "Vote URL"}
        </button>
        <button
          className=" p-1 flex gap-2 justify-center"
          onClick={() => {
            copyUrlToClipboard(`/embed/${poll.id}`);

            setEmbedCopied(true);

            setTimeout(() => {
              setEmbedCopied(false);
            }, 2000);
          }}
        >
          <FiCopy size={24} />
          {embedCopied ? "Copied!" : "Embed URL"}
        </button>
      </div>
    </button>
  );
};
