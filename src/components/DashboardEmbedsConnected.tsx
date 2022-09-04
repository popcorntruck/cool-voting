import React, { useMemo } from "react";
import { usePresence } from "../utils/supabase";
import { AutoAnimate } from "./AutoAnimate";

interface DashboardEmbedsConnectedProps {
  pollId: string;
}

export const DashboardEmbedsConnected: React.FC<
  React.PropsWithChildren<DashboardEmbedsConnectedProps>
> = ({ pollId }) => {
  const { presenceData } = usePresence(`poll-${pollId}`, false);

  return (
    <AutoAnimate>
      {presenceData && presenceData.length > 0 && (
        <div className="flex space-x-3 items-center bg-pink-600 rounded-md p-3">
          <div className="w-[10px] h-[10px] bg-white rounded-full animate-pulse" />
          <p className="text-sm bold">
            {presenceData.length} Embed{presenceData.length > 1 && "s"}{" "}
            Connected
          </p>
        </div>
      )}
    </AutoAnimate>
  );
};
