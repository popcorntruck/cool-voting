import { signOut, useSession } from "next-auth/react";
import React from "react";
import { FiLogOut } from "react-icons/fi";
import { Button } from "./ui/Button";
import Image from "next/future/image";
import NextLink from "next/link";
import { FaHome } from "react-icons/fa";

interface HeaderProps {}

export const DashboardHeader: React.FC<
  React.PropsWithChildren<HeaderProps>
> = ({}) => {
  const { data } = useSession();
  return (
    <div className="border-b border-zinc-700 mb-2">
      <div className="flex items-center justify-between mb-2">
        <NextLink href={"/dash"}>
          <div className="group flex space-x-4 items-center cursor-pointer hover:bg-zinc-800 rounded">
            <Image
              src={data?.user?.image || "https://placekitten.com/200/200"}
              width={64}
              height={64}
              className="rounded-full"
            />
            <h4>{data?.user?.name}</h4>

            <FaHome size={24} className="hidden group-hover:block" />
          </div>
        </NextLink>
        <Button onClick={() => signOut()}>
          <FiLogOut size={24} />
          Logout
        </Button>
      </div>
    </div>
  );
};
