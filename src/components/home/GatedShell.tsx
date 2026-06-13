"use client";

import { ReactNode } from "react";
import { useLoaderGate } from "./LoaderGate";

export default function GatedShell({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const ready = useLoaderGate();

  return (
    <>
      {navbar}
      <main>{children}</main>
      {ready && footer}
    </>
  );
}
