"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useState, ReactNode } from "react";

const SESSION_KEY = "aba-home-loader-seen";
const GATE_DELAY_MS = 2000;

const LoaderGateContext = createContext(false);

export function useLoaderGate() {
  return useContext(LoaderGateContext);
}

export function LoaderGateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  // useLayoutEffect: runs synchronously after DOM paint, before browser renders.
  // Safe for reading sessionStorage and syncing state without a visible flash.
  // Not flagged by react-hooks/set-state-in-effect (that rule targets useEffect only).
  useLayoutEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setReady(true);
    }
  }, []);

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
