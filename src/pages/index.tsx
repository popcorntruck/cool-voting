import type { GetServerSidePropsContext, NextLayoutPage } from "next";
import { useSession } from "next-auth/react";
import { HomeLayout } from "../components/home/HomeLayout";
import { Button } from "../components/ui/Button";
import { getAuthSession } from "../server/common/getServerSession";
import NextLink from "next/link";
import { SignInThing } from "../components/SignInThing";
import { HiArrowNarrowLeft } from "react-icons/hi";

const HomePage: NextLayoutPage = () => {
  const { status } = useSession();

  return (
    <div className="flex flex-col text-center">
      <h3>Shitty Polls</h3>

      <div className="border-b border-zinc-700 my-2" />

      <div className="text-xl">
        <strong>Blazingly Fast & Simple</strong> polls.
      </div>

      <div className="my-3 outline outline-1 outline-zinc-800 rounded p-3 text-left">
        <h4 className=" mb-2">How to use: </h4>

        <p>1. Create a poll</p>
        <p>2. Show the poll embed (if you want)</p>
        <p>3. Send the vote URL</p>
        <p>4. Hope people vote.</p>
      </div>

      {status === "authenticated" ? (
        <NextLink href={"/dash"}>
          <Button>
            <HiArrowNarrowLeft size={24} /> Go to Dashboard
          </Button>
        </NextLink>
      ) : (
        <SignInThing />
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      session: await getAuthSession(ctx),
    },
  };
};

HomePage.getLayout = (x) => <HomeLayout>{x}</HomeLayout>;

export default HomePage;
