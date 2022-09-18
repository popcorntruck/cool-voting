import React from "react";
import { Button } from "../ui/Button";

interface HomeHeaderProps {}

export const HomeHeader: React.FC<
  React.PropsWithChildren<HomeHeaderProps>
> = ({}) => {
  return (
    <div className=" mt-4 flex justify-between items-center">
      <h4>cool-voting</h4>

      <Button className="p-3">Sign in</Button>
    </div>
  );
};
