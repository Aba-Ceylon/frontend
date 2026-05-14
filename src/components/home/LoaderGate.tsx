"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const SESSION_KEY = "aba-home-loader-seen";
const GATE_DELAY_MS = 2000;

const LoaderGateContext = createContext(false);

export function useLoaderGate() {
  return useContext(LoaderGateContext);
}

export function LoaderGateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });

  useEffect(() => {
    const delay =
      sessionStorage.getItem(SESSION_KEY) === "true" ? 0 : GATE_DELAY_MS;
    const id = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(id);
  }, [ready]);

  return (
    <LoaderGateContext.Provider value={ready}>
      {children}
    </LoaderGateContext.Provider>
  );
}
