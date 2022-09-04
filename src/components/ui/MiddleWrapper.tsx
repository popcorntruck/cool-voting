import React from "react";

export const MiddleWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="h-screen w-screen flex items-center justify-center">
      {children}
    </main>
  );
};
