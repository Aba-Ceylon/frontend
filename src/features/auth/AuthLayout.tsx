import type { ReactNode } from "react";
import Image from "next/image";

// Shared Clerk styling. `variables` drive Clerk's own theme tokens (which
// utility classes alone cannot override reliably); `elements` handle the rest.
export const authAppearance = {
  variables: {
    colorPrimary: "#182231",
    colorText: "#182231",
    colorTextSecondary: "#445062",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#182231",
    borderRadius: "0rem",
    fontFamily: 'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  elements: {
    rootBox: "w-full mx-auto flex justify-center",
    cardBox: "w-full mx-auto flex justify-center shadow-[0_30px_80px_rgba(5,8,14,0.45)]",
    card: "w-full max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto",
    headerTitle: "font-cinzel font-medium tracking-wide",
    formButtonPrimary:
      "!bg-[#182231] hover:!bg-[#243142] !shadow-none !bg-none uppercase tracking-[0.16em] text-xs",
    socialButtonsBlockButton: "border-[#182231]/15",
    formFieldInput: "border-[#182231]/20 focus:!border-[#bf9230] focus:!shadow-[0_0_0_3px_rgba(191,146,48,0.18)]",
    footerActionLink: "!text-[#8b6b1f] hover:!text-[#182231]",
    identityPreviewEditButton: "!text-[#8b6b1f]",
  },
};

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#182231] px-4 pb-16 pt-28 sm:pt-32">
      <Image
        src="/images/heritage/sigiriya-login.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,24,0.7)_0%,rgba(10,15,24,0.55)_50%,rgba(10,15,24,0.8)_100%)]" />

      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="mb-8 text-center text-white">
          <h1 className="font-cinzel text-4xl leading-[1.1] sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm uppercase tracking-[0.24em] text-white/75">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </main>
  );
}
