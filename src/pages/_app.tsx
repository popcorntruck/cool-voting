// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type {
  AppInitialProps,
  NextComponentType,
} from "next/dist/shared/lib/utils";
import { trpc } from "../utils/trpc";
import { AppContext, AppLayoutProps } from "next/app";
import { ReactNode } from "react";

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = (
  props: AppLayoutProps
) => {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <SessionProvider session={pageProps.session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
