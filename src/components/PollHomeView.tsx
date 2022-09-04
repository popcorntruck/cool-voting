import React, { useState } from "react";
import { AutoAnimate } from "./AutoAnimate";
import { Button } from "./ui/Button";
import { FiPlus, FiCopy } from "react-icons/fi";
import { PollModal } from "./PollModal";
import { trpc } from "../utils/trpc";
import { Spinner } from "./ui/Spinner";
import NextLink from "next/link";
import { DashboardPollCard } from "./DashboardPollCard";

interface PollHomeViewProps {}

export const PollHomeView: React.FC<
  React.PropsWithChildren<PollHomeViewProps>
> = ({}) => {
  const [polls, setPolls] = useState<Array<any>>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: pollData, isLoading } = trpc.proxy.poll.getMyPolls.useQuery();

  if (isLoading || !pollData) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Spinner size="4" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h4>Your Polls</h4>
        <Button
          className="px-5 py-3"
          onClick={() => {
            setPolls((o) => [{}, ...o]);
            setModalOpen(true);
          }}
        >
          <FiPlus size={24} />
          Create Poll
        </Button>
      </div>

      <AutoAnimate className="flex flex-wrap justify-center gap-4 p-8">
        {pollData.map((p, idx) => (
          <DashboardPollCard poll={p} />
        ))}
      </AutoAnimate>
      <PollModal isOpen={modalOpen} requestClose={() => setModalOpen(false)} />
    </>
  );
};
