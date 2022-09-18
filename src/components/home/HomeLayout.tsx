import { MetaTags } from "../MetaTags";
import { HomeHeader } from "./HomeHeader";

export const HomeLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <MetaTags />

      {children}
    </main>
  );
};
