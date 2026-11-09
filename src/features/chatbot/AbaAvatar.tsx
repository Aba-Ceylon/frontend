"use client";

import Image from "next/image";
import type { AbaMood } from "@/lib/chatbot/types";

/**
 * Aba's face. It "breathes" while idle, a gold ring turns while it thinks,
 * it bounces when excited, tilts when curious and dims when it's sorry.
 * All motion is CSS (see globals.css, aba-*) and stops for reduced motion.
 */
export default function AbaAvatar({
  size = 40,
  mood = "warm",
  thinking = false,
  online = false,
  className = "",
}: {
  size?: number;
  mood?: AbaMood;
  thinking?: boolean;
  online?: boolean;
  className?: string;
}) {
  const state = thinking ? "thinking" : mood;

  return (
    <span
      className={`aba-avatar relative inline-flex shrink-0 ${className}`}
      data-mood={state}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="aba-avatar-ring absolute -inset-[3px] rounded-full" />
      <span className="aba-avatar-face relative block h-full w-full overflow-hidden rounded-full bg-[#f3e9d6]">
        <Image
          src="/abaKing.png"
          alt=""
          width={size * 2}
          height={size * 2}
          loading="eager"
          className="h-full w-full scale-[1.9] object-cover object-[50%_22%]"
          style={{ transformOrigin: "50% 34%" }}
        />
      </span>
      {online ? (
        <span className="absolute bottom-0 right-0 h-[28%] max-h-3 w-[28%] max-w-3 rounded-full border-2 border-[#0d141e] bg-emerald-400" />
      ) : null}
    </span>
  );
}
