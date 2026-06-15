"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ensureHomeExperiencePreloaded,
  subscribeHomePreloadProgress,
} from "./homePreload";

const SESSION_KEY = "aba-home-loader-seen";

type LoaderGateState = {
  progress: number;
  ready: boolean;
};

const LoaderGateContext = createContext<LoaderGateState>({
  progress: 0,
  ready: false,
});

export function useLoaderGate() {
  return useContext(LoaderGateContext).ready;
}

export function useLoaderProgress() {
  return useContext(LoaderGateContext).progress;
}

const noopSubscribe = () => () => {};
const getSnapshot = () => sessionStorage.getItem(SESSION_KEY) === "true";
const getServerSnapshot = () => false;

export function LoaderGateProvider({ children }: { children: ReactNode }) {
  const alreadySeen = useSyncExternalStore(
    noopSubscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const [state, setState] = useState<LoaderGateState>({
    progress: alreadySeen ? 1 : 0,
    ready: alreadySeen,
  });

  useEffect(() => {
    if (alreadySeen) {
      return;
    }

    let cancelled = false;

    const unsubscribe = subscribeHomePreloadProgress((progress) => {
      if (cancelled) {
        return;
      }

      setState((previous) => ({
        ...previous,
        progress,
      }));
    });

    void ensureHomeExperiencePreloaded()
      .catch(() => undefined)
      .then(() => {
        if (cancelled) {
          return;
        }

        sessionStorage.setItem(SESSION_KEY, "true");
        setState({ progress: 1, ready: true });
      });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [alreadySeen]);

  const contextValue = alreadySeen
    ? { progress: 1, ready: true }
    : state;

  return (
    <LoaderGateContext.Provider value={contextValue}>
      {children}
    </LoaderGateContext.Provider>
  );
}
