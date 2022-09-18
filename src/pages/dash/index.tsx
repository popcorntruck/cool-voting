import type { GetServerSidePropsContext, NextLayoutPage, NextPage } from "next";
import { useSession } from "next-auth/react";
import { DashboardHeader } from "../../components/Header";
import { MetaTags } from "../../components/MetaTags";
import { PollHomeView } from "../../components/PollHomeView";
import { SignInThing } from "../../components/SignInThing";
import { getAuthSession } from "../../server/common/getServerSession";

const DashboardHome: NextLayoutPage = () => {
  const { data } = useSession();

  if (!data) {
    return (
      <main className="h-screen w-screen flex items-center justify-center">
        <SignInThing signInMsg="You musi stin in" />
      </main>
    );
  }

  return (
    <main className="p-4">
      <DashboardHeader />
      <PollHomeView />
    </main>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      session: await getAuthSession(ctx),
    },
  };
};

DashboardHome.getLayout = (x) => <MetaTags>{x}</MetaTags>;

export default DashboardHome;
