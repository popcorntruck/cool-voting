import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";
import { DashboardHeader } from "./Header";
import { MetaTags } from "./MetaTags";
import { SignInThing } from "./SignInThing";

export const DashLayout = ({ children }: React.PropsWithChildren) => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return (
      <main className="h-screen w-screen flex items-center justify-center">
        <SignInThing signInMsg="You must sign in" />
      </main>
    );
  }

  if (status === "loading") return null;

  return (
    <main className="p-4">
      <MetaTags />
      <DashboardHeader />

      {children}
    </main>
  );
};
