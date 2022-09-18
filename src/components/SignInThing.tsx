import { signIn } from "next-auth/react";
import React from "react";
import { FaDiscord } from "react-icons/fa";

interface SignInThingProps {
  signInMsg?: string;
}

export const SignInThing: React.FC<
  React.PropsWithChildren<SignInThingProps>
> = ({ signInMsg }) => {
  return (
    <div className="flex-col text-center">
      <p>{signInMsg}</p>
      <button
        onClick={() => signIn("discord", { callbackUrl: "/dash" })}
        className="flex gap-2 rounded bg-gray-200 p-4 font-bold text-gray-800 hover:bg-gray-100"
      >
        <FaDiscord size={24} />
        Sign in with Discord
      </button>
    </div>
  );
};
