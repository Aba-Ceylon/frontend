"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { AbaBubble, AbaCard } from "@/lib/chatbot/types";

const LINKABLE = /(\*\*[^*]+\*\*|[\w.+-]+@[\w-]+\.[\w.]+|\b(?:[a-z0-9-]+\.)+(?:gov\.lk|lk|com)\b|\+94[\d\s]{9,12}\d)/gi;

/** Plain text with **bold**, plus clickable emails, phone numbers and sites. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(LINKABLE).filter((part) => part !== "");
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-[#f3dca4]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
          return (
            <a key={index} href={`mailto:${part}`} className="underline decoration-[#e2c27a]/60 underline-offset-2 hover:text-[#e2c27a]">
              {part}
            </a>
          );
        }
        if (/^\+94[\d\s]+$/.test(part)) {
          return (
            <a key={index} href={`tel:${part.replace(/\s/g, "")}`} className="underline decoration-[#e2c27a]/60 underline-offset-2 hover:text-[#e2c27a]">
              {part}
            </a>
          );
        }
        if (/^(?:[a-z0-9-]+\.)+(?:gov\.lk|lk|com)$/i.test(part)) {
          return (
            <a key={index} href={`https://${part}`} target="_blank" rel="noopener noreferrer" className="underline decoration-[#e2c27a]/60 underline-offset-2 hover:text-[#e2c27a]">
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function ResultCard({ card, onNavigate }: { card: AbaCard; onNavigate: () => void }) {
  return (
    <Link
      href={card.href}
      onClick={onNavigate}
      className="group block w-[210px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white text-[#182231] shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#e2c27a]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#182231]">
        <Image
          src={card.image}
          alt=""
          fill
          sizes="210px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {card.meta ? (
          <span className="absolute left-2 top-2 rounded-full bg-[#0d141e]/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white backdrop-blur">
            {card.meta}
          </span>
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate font-cinzel text-[13px] leading-snug">{card.title}</p>
          <p className="mt-0.5 truncate text-xs text-[#182231]/60">{card.subtitle}</p>
        </div>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#9b7422] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </Link>
  );
}

export function AbaBubbleView({
  bubble,
  onNavigate,
}: {
  bubble: AbaBubble;
  onNavigate: () => void;
}) {
  if (bubble.type === "text") {
    return (
      <div className="aba-pop max-w-[88%] rounded-2xl rounded-bl-md border border-white/8 bg-white/[0.07] px-4 py-2.5 text-[14px] leading-6 text-white/90">
        <RichText text={bubble.text} />
      </div>
    );
  }

  if (bubble.type === "cards") {
    return (
      <div
        className="aba-pop -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Suggestions from Aba"
      >
        {bubble.cards.map((card) => (
          <div role="listitem" key={`${card.kind}-${card.id}`} className="shrink-0">
            <ResultCard card={card} onNavigate={onNavigate} />
          </div>
        ))}
      </div>
    );
  }

  const whatsapp = bubble.style === "whatsapp";
  const className = `aba-pop inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition active:scale-[0.98] ${
    whatsapp ? "bg-[#25d366] text-[#06210f] hover:bg-[#3be07a]" : "bg-[#e2c27a] text-[#0d141e] hover:bg-white"
  }`;
  const content = (
    <>
      {whatsapp ? <MessageCircle className="h-4 w-4" aria-hidden="true" /> : null}
      {bubble.label}
      {!whatsapp ? <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> : null}
    </>
  );

  return bubble.external ? (
    <a href={bubble.href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={bubble.href} onClick={onNavigate} className={className}>
      {content}
    </Link>
  );
}
