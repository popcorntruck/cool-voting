import { signOut, useSession } from "next-auth/react";
import React from "react";
import { FiLogOut } from "react-icons/fi";
import { Button } from "./ui/Button";
import Image from "next/future/image";

interface HeaderProps {}

export const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({}) => {
  const { data } = useSession();
  return (
    <div className="border-b border-zinc-700 mb-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex space-x-4 items-center">
          <Image
            src={data?.user?.image || "https://placekitten.com/200/200"}
            width={64}
            height={64}
            className="rounded-full"
          />
          <h4>{data?.user?.name}</h4>
        </div>
        <Button onClick={() => signOut()}>
          <FiLogOut size={24} />
          Logout
        </Button>
      </div>
    </div>
  );
};
