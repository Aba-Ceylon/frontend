"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const SESSION_KEY = "aba-home-loader-seen";
const GATE_DELAY_MS = 2000;

const LoaderGateContext = createContext(false);

export function useLoaderGate() {
  return useContext(LoaderGateContext);
}

export function LoaderGateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setReady(true);
      return;
    }
    const id = window.setTimeout(() => setReady(true), GATE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <LoaderGateContext.Provider value={ready}>
      {children}
    </LoaderGateContext.Provider>
  );
}
