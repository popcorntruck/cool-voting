import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "../env/client.mjs";
import createStore from "zustand/vanilla";
import create, { useStore } from "zustand";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { PollVote } from "@prisma/client";
import { useEffectOnce } from "./useEffectOnce";

interface SupabaseStoreType {
  client: SupabaseClient;
}

const createSupabaseStore = () => {
  const client = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return createStore<SupabaseStoreType>(() => ({
    client,
  }));
};

const SupabaseContext = createContext<ReturnType<
  typeof createSupabaseStore
> | null>(null);

export const SupabaseProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [store, updateStore] =
    useState<ReturnType<typeof createSupabaseStore>>();

  useEffect(() => {
    const newStore = createSupabaseStore();
    updateStore(newStore);

    return () => {
      console.log("disconnecting and destroying store");
      console.log(
        "(Expect a warning in terminal after this, React Dev Mode and all)"
      );
      newStore.destroy();
    };
  }, []);

  if (!store) return null;

  return (
    <SupabaseContext.Provider value={store}>
      {children}
    </SupabaseContext.Provider>
  );
};

export function useSupabaseStore() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error("useSupabaseStore used outside of context");
  }

  const store = useStore(context);

  return store;
}

type DatabaseTableMap = {
  PollVote: PollVote;
};

export function useDatabaseChange<TTable extends keyof DatabaseTableMap>(
  options: {
    event: "INSERT" | "UPDATE" | "DELETE" | "*";
    schema: "public";
    table?: TTable;
    filter?: `${string}=${string}`;
  },
  callback: (data: any) => void
) {
  const { client } = useSupabaseStore();
  const stableCallback = useRef(callback);

  useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  useEffectOnce(() => {
    const sub = client
      .channel("db-changes")
      .on("postgres_changes", options, (payload: any) => {
        stableCallback.current(payload);
      })
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  });
}

type PresenceData = {
  embed: boolean;
};

export function usePresence(
  channelId: string,
  publishPresence: boolean,
  initialPresence?: PresenceData
) {
  const { client } = useSupabaseStore();
  const [presenceData, setPresenceData] =
    useState<Array<PresenceData & { presence_ref: string }>>();

  useEffectOnce(() => {
    const channel = client.channel(channelId);

    const presenceUpdateHandler = () => {
      setPresenceData(Object.values(channel.presenceState()) as any);
    };

    channel
      .on("presence", { event: "sync" }, presenceUpdateHandler)
      .subscribe(async (status: string) => {
        if (publishPresence && initialPresence && status === "SUBSCRIBED") {
          const presence = await channel.track(initialPresence);
        }
      });

    return () => {
      channel.untrack();
      channel.off("presence", presenceUpdateHandler);
    };
  });

  return { presenceData };
}
