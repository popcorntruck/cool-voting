import { NextLayoutPage } from "next";
import { useRouter } from "next/router";
import { MetaTags } from "../../components/MetaTags";
import { VoteResultsBarController } from "../../components/VoteResultsBarController";
import dynamic from "next/dynamic";
import { SupabaseProvider, useChannelEvent } from "../../utils/supabase";
import { EmbedPresence } from "../../components/EmbedPresence";
import { trpc } from "../../utils/trpc";

export const EmbedPageInner: React.FC<
  React.PropsWithChildren<{ id: string }>
> = ({ id }) => {
  return (
    <SupabaseProvider>
      <EmbedRealtimeMessageListener id={id} />
      <VoteResultsBarController pollId={id} isEmbed />
      <EmbedPresence pollId={id} />
    </SupabaseProvider>
  );
};

export const EmbedRealtimeMessageListener = ({ id }: { id: string }) => {
  const tCtx = trpc.proxy.useContext();
  useChannelEvent(`poll:${id}`, "refetch", () => {
    tCtx.poll.getById.refetch();
  });
  return null;
};

const LazyEmbedPageInner = dynamic(Promise.resolve(EmbedPageInner), {
  ssr: false,
});

const EmbedPage: NextLayoutPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return null;
  }

  return <LazyEmbedPageInner id={id} />;
};

EmbedPage.getLayout = (v) => <>{v}</>;

export default EmbedPage;
