// The teardrop motif: Sri Lanka as "the Teardrop of the Indian Ocean".
// Shared by the hero, section labels and decorative watermarks.

export function TeardropMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 1.5C12 1.5 2.5 13.2 2.5 20.5a9.5 9.5 0 0 0 19 0C21.5 13.2 12 1.5 12 1.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path
        d="M12 9.5c0 0-4.6 6.1-4.6 10.2a4.6 4.6 0 0 0 9.2 0c0-4.1-4.6-10.2-4.6-10.2Z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

/** Large, faint teardrop outline used as a background flourish. */
export function TeardropWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 320"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <path
        d="M120 8C120 8 18 128 18 204a102 102 0 0 0 204 0C222 128 120 8 120 8Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M120 52C120 52 44 146 44 204a76 76 0 0 0 152 0C196 146 120 52 120 52Z"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.6"
      />
    </svg>
  );
}

type Tone = "light" | "dark";

/** Gold section label: thin rule, teardrop, uppercase Cinzel text. */
export function SectionKicker({
  children,
  tone = "light",
  align = "left",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  align?: "left" | "center";
  className?: string;
}) {
  const color = tone === "dark" ? "text-[#e2c27a]" : "text-[#9b7422]";

  return (
    <p
      className={`flex items-center gap-3 font-cinzel text-[11px] uppercase tracking-[0.3em] ${color} ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      {align === "center" ? <span className="h-px w-8 bg-current opacity-50" aria-hidden="true" /> : null}
      <TeardropMark className="h-4 w-3 shrink-0" />
      <span>{children}</span>
      <span className="h-px w-8 bg-current opacity-50" aria-hidden="true" />
    </p>
  );
}
