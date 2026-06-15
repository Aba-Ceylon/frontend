"use client";

import { ReactNode } from "react";

export default function GatedShell({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {navbar}
      <main>{children}</main>
      {footer}
    </>
  );
}
