import { GetServerSidePropsContext, NextLayoutPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { ImStop } from "react-icons/im";
import { AutoAnimate } from "../../components/AutoAnimate";
import { ConfirmPollEndModal } from "../../components/ConfirmPollEndModal";
import { DashboardEmbedsConnected } from "../../components/DashboardEmbedsConnected";
import { DashLayout } from "../../components/MainLayout";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { VoteResultsBarController } from "../../components/VoteResultsBarController";
import { getAuthSession } from "../../server/common/getServerSession";
import {
  SupabaseProvider,
  useChannelEvent,
  useSupabaseStore,
} from "../../utils/supabase";
import { trpc } from "../../utils/trpc";

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

  const tctx = trpc.proxy.useContext();
  const { mutate: mutateEndPoll, isLoading: loadingEndPoll } =
    trpc.proxy.poll.endPoll.useMutation({
      onSuccess: () => {
        tctx.poll.getById.setData(
          (o) => ({
            ...o!,
            poll: {
              ...o!.poll,
              ended: true,
            },
          }),
          {
            id,
          }
        );
        setShowEndConfirmModal(false);
      },
    });
  const [showEndConfirmModal, setShowEndConfirmModal] = useState(false);

  const { send: sendPollChannelMessage } = useChannelEvent(
    `poll:${id}`,
    "refetch",
    () => {}
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
    <main className="md:flex w-full md:space-x-4">
      <div className="w-full space-y-2">
        <div className="flex justify-between">
          <h4>{pollData.poll.question}</h4>
          <h4>
            {pollData.poll.ended && "FINAL RESULTS - "}
            {getTotalVotes(pollVotes || [])} Votes
          </h4>
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

        <AutoAnimate>
          {pollData.poll.ended ? (
            <div className="p-4 bg-red-500 rounded-lg text-white">
              This poll has ended
            </div>
          ) : (
            <Button
              className="w-full"
              color="secondary"
              onClick={() => setShowEndConfirmModal(true)}
            >
              <ImStop size={24} className="mr-1" /> Stop Poll
            </Button>
          )}
        </AutoAnimate>
      </div>

      <ConfirmPollEndModal
        isOpen={showEndConfirmModal}
        requestClose={() => setShowEndConfirmModal(false)}
        onClickConfirm={() => {
          mutateEndPoll({
            pollId: pollData.poll.id,
          });
          sendPollChannelMessage({});
        }}
        confirmButtonLoading={loadingEndPoll}
      />
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

PollDashboard.getLayout = (p) => <DashLayout>{p}</DashLayout>;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      session: await getAuthSession(ctx),
    },
  };
};

export default PollDashboard;
