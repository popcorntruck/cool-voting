import { NextLayoutPage } from "next";
import { useRouter } from "next/router";
import { MetaTags } from "../../components/MetaTags";
import { VoteResultsBarController } from "../../components/VoteResultsBarController";
import dynamic from "next/dynamic";
import { SupabaseProvider } from "../../utils/supabase";
import { EmbedPresence } from "../../components/EmbedPresence";

export const EmbedPageInner: React.FC<
  React.PropsWithChildren<{ id: string }>
> = ({ id }) => {
  return (
    <SupabaseProvider>
      <VoteResultsBarController pollId={id} />
      <EmbedPresence pollId={id} />
    </SupabaseProvider>
  );
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
