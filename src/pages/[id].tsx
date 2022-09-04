import { GetServerSidePropsContext, NextLayoutPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FiCopy } from "react-icons/fi";
import { ImStop } from "react-icons/im";
import { DashboardEmbedsConnected } from "../components/DashboardEmbedsConnected";
import { MainLayout } from "../components/MainLayout";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { VoteResultsBar } from "../components/VoteResultsBar";
import { VoteResultsBarController } from "../components/VoteResultsBarController";
import { getAuthSession } from "../server/common/getServerSession";
import { SupabaseProvider, useSupabaseStore } from "../utils/supabase";
import { trpc } from "../utils/trpc";

const copyUrlToClipboard = (path: string) => {
  if (!process.browser) return;
  navigator.clipboard.writeText(`${window.location.origin}${path}`);
};

interface PollDashboardInnerProps {
  id: string;
}

const getTotalVotes = (votes: any) => {
  let tv = 0;
  votes?.map((choice: { _count: number }) => {
    tv += choice._count;
  });

  return tv;
};

export const PollDashboardInner: React.FC<
  React.PropsWithChildren<PollDashboardInnerProps>
> = ({ id }) => {
  const { data: pollData, isLoading: pollLoading } =
    trpc.proxy.poll.getById.useQuery(
      {
        id,
      },
      {
        cacheTime: Infinity,
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );
  const { data: pollVotes, isLoading: pollVotesLoading } =
    trpc.proxy.poll.getVotes.useQuery(
      {
        pollId: id,
      },
      {
        cacheTime: Infinity,
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  if (pollLoading) {
    return <Spinner size="4" />;
  }

  if (!pollData || !pollData?.poll) {
    return <h4>Poll not found</h4>;
  }

  if (!pollData?.isMine) {
    return <h4>Nice try</h4>;
  }

  return (
    <main className="md:flex w-full md:space-x-4 ">
      <div className="w-full space-y-2">
        <div className="flex justify-between">
          <h4>{pollData.poll.question}</h4>
          <h4>{getTotalVotes(pollVotes || [])} Votes</h4>
        </div>

        <VoteResultsBarController pollId={id} />
      </div>
      <div className="w-full md:w-96 mt-4 flex flex-col space-y-3">
        <DashboardEmbedsConnected pollId={id} />
        <Button
          className="w-full"
          onClick={() => copyUrlToClipboard(`/vote/${id}`)}
        >
          <FiCopy size={24} /> Copy Vote URL
        </Button>
        <Button
          className="w-full "
          onClick={() => copyUrlToClipboard(`/embed/${id}`)}
        >
          <FiCopy size={24} /> Copy Embed URL
        </Button>

        <div className="border-b border-zinc-700" />

        <Button
          className="w-full"
          color="secondary"
          onClick={() => copyUrlToClipboard(`/embed/${id}`)}
        >
          <ImStop size={24} className="mr-1" /> Stop Poll
        </Button>
      </div>
    </main>
  );
};

const PollDashboard: NextLayoutPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No poll id</div>;
  }

  return (
    <SupabaseProvider>
      <PollDashboardInner id={id} />
    </SupabaseProvider>
  );
};

PollDashboard.getLayout = (p) => <MainLayout>{p}</MainLayout>;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      session: await getAuthSession(ctx),
    },
  };
};

export default PollDashboard;
