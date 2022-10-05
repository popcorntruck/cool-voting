import { NextLayoutPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { TbCheck } from "react-icons/tb";
import { MetaTags } from "../../components/MetaTags";
import { Spinner } from "../../components/ui/Spinner";
import { VotePageBox } from "../../components/VotePageBox";
import { useSupabaseStore } from "../../utils/supabase";
import { trpc } from "../../utils/trpc";

interface VotePageInnerProps {
  id: string;
}

export const VotePageInner: React.FC<
  React.PropsWithChildren<VotePageInnerProps>
> = ({ id }) => {
  const { data, isLoading, error } = trpc.proxy.poll.getById.useQuery(
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

  let body;

  if (error) {
    body = (
      <div className="flex flex-col">
        <h4>Error occurred loading poll!</h4>
        <p>{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    body = <Spinner size="4" />;
  }

  //make this into different

  if (data?.alreadyVoted) {
    body = (
      <div className="flex items-center space-x-2">
        <TbCheck size={24} />
        <h4>You already voted!</h4>
      </div>
    );
  } else if (data?.poll.ended) {
    body = (
      <div className="flex items-center space-x-2">
        <TbCheck size={24} />
        <h4>This poll has ended</h4>
      </div>
    );
  } else if (data?.poll) {
    body = <VotePageBox poll={data.poll} />;
  } else if (!isLoading && !data) {
    body = <h4>Poll not found!</h4>;
  }

  return (
    <main className="h-screen w-screen flex items-center justify-center">
      {body}
    </main>
  );
};

const VotePage: NextLayoutPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No poll id</div>;
  }

  return <VotePageInner id={id} />;
};

VotePage.getLayout = (v) => <MetaTags>{v}</MetaTags>;

export default VotePage;
