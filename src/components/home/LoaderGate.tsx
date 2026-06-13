"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  ReactNode,
} from "react";

const SESSION_KEY = "aba-home-loader-seen";
const GATE_DELAY_MS = 2000;

const LoaderGateContext = createContext(false);

export function useLoaderGate() {
  return useContext(LoaderGateContext);
}

// useSyncExternalStore snapshot helpers — React-official pattern for
// reading browser storage without setState-in-effect lint violations.
// subscribe: sessionStorage never changes externally so a no-op is fine.
const noopSubscribe = () => () => {};
const getSnapshot = () => sessionStorage.getItem(SESSION_KEY) === "true";
const getServerSnapshot = () => false; // SSR always returns false

export function LoaderGateProvider({ children }: { children: ReactNode }) {
  // alreadySeen is true on the client when sessionStorage flag is set,
  // false on server — no hydration mismatch, no setState in effect.
  const alreadySeen = useSyncExternalStore(
    noopSubscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const [ready, setReady] = useState(alreadySeen);

  useEffect(() => {
    if (ready) return;
    const id = window.setTimeout(() => setReady(true), GATE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [ready]);

  return (
    <LoaderGateContext.Provider value={ready}>
      {children}
    </LoaderGateContext.Provider>
  );
}
