import React from "react";
import { usePresence } from "../utils/supabase";

interface EmbedPresenceProps {
  pollId: string;
}

export const EmbedPresence: React.FC<
  React.PropsWithChildren<EmbedPresenceProps>
> = ({ pollId }) => {
  const { presenceData } = usePresence(`poll-${pollId}`, true, {
    embed: true,
  });
  return <></>;
};
