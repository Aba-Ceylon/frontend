"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, RotateCcw, X } from "lucide-react";
import AbaAvatar from "./AbaAvatar";
import { AbaBubbleView } from "./ChatParts";
import {
  MAX_MESSAGE_LENGTH,
  type AbaBubble,
  type AbaMood,
  type AbaReply,
  type AbaState,
  type Interest,
} from "@/lib/chatbot/types";

type ChatItem =
  | { id: string; from: "user"; text: string }
  | { id: string; from: "aba"; bubble: AbaBubble };

const STORAGE_KEY = "aba-chat-v2";
const TEASER_KEY = "aba-teaser-seen";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const INTEREST_CHIP: Record<Interest, string> = {
  beach: "Beaches",
  wildlife: "Wildlife",
  heritage: "Ancient cities",
  hills: "Tea country",
  north: "The north",
  adventure: "Adventure",
  wellness: "Slow days",
  food: "Food",
};

let idCounter = 0;
const nextId = () => `m${Date.now().toString(36)}${(idCounter += 1)}`;

function readStorage<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or storage full: the chat still works, it just won't persist.
  }
}

/** How long Aba "types" before a bubble appears: longer messages take longer. */
function typingDelay(bubble: AbaBubble, reduced: boolean) {
  if (reduced) return 120;
  if (bubble.type === "text") return Math.min(1500, 380 + bubble.text.length * 9);
  return 450;
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function teaserFor(path: string) {
  if (path.startsWith("/destinations/")) return "Curious about this place? Ask me when to go 🌴";
  if (path.startsWith("/packages")) return "Not sure which journey fits? I can help you choose.";
  if (path.startsWith("/stays")) return "Looking for the right stay? Tell me where you're heading.";
  if (path.startsWith("/fleet")) return "How many of you are travelling? I'll match a vehicle.";
  return "Ayubowan! 🙏 Planning a Sri Lanka trip? I can help.";
}

/** Small chips showing what Aba remembers; tap × to forget a detail. */
function TripMemory({ state, onForget }: { state: AbaState; onForget: (key: string) => void }) {
  const p = state.profile;
  const chips: Array<{ key: string; label: string; muted?: boolean }> = [];
  if (p.days) chips.push({ key: "days", label: `${p.days} day${p.days === 1 ? "" : "s"}` });
  if (p.travellers) chips.push({ key: "travellers", label: `${p.travellers} traveller${p.travellers === 1 ? "" : "s"}` });
  if (p.month !== null) chips.push({ key: "month", label: MONTHS[p.month] });
  for (const interest of p.interests) chips.push({ key: `interest:${interest}`, label: INTEREST_CHIP[interest] });
  for (const interest of p.avoid) chips.push({ key: `avoid:${interest}`, label: `No ${INTEREST_CHIP[interest].toLowerCase()}`, muted: true });
  if (p.budget) chips.push({ key: "budget", label: p.budget === "luxury" ? "Luxury" : p.budget === "value" ? "Good value" : "Comfort" });
  if (!chips.length) return null;

  return (
    <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-2">
      <span className="shrink-0 font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#e2c27a]/80">Your trip</span>
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((chip) => (
          <span
            key={chip.key}
            className={`inline-flex shrink-0 items-center gap-1 rounded-full border py-0.5 pl-2.5 pr-1 text-[11px] ${
              chip.muted ? "border-white/10 text-white/50 line-through decoration-white/30" : "border-[#e2c27a]/30 text-white/85"
            }`}
          >
            {chip.label}
            <button
              type="button"
              onClick={() => onForget(chip.key)}
              className="flex h-4 w-4 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label={`Forget ${chip.label}`}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ChatbotWidget() {
  const pathname = usePathname() || "/";
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ChatItem[]>([]);
  const [abaState, setAbaState] = useState<AbaState | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [mood, setMood] = useState<AbaMood>("warm");
  const [isTyping, setIsTyping] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [input, setInput] = useState("");
  const [failedText, setFailedText] = useState<string | null>(null);
  const [teaser, setTeaser] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useRef(false);
  // Latest memory for send(), without re-creating callbacks every turn.
  const stateRef = useRef<AbaState | null>(null);
  useEffect(() => {
    stateRef.current = abaState;
  }, [abaState]);

  // Restore this tab's conversation.
  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saved = readStorage<{ items: ChatItem[]; state: AbaState | null; suggestions: string[] }>(STORAGE_KEY);
    if (saved?.items?.length) {
      setItems(saved.items);
      setAbaState(saved.state);
      setSuggestions(saved.suggestions ?? []);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(STORAGE_KEY, { items: items.slice(-80), state: abaState, suggestions });
  }, [abaState, hydrated, items, suggestions]);

  // A gentle, one-time nudge after a while on the page.
  useEffect(() => {
    if (!hydrated || isOpen || items.length || readStorage<boolean>(TEASER_KEY)) return;
    const timer = window.setTimeout(() => setTeaser(teaserFor(pathname)), 9000);
    return () => window.clearTimeout(timer);
  }, [hydrated, isOpen, items.length, pathname]);

  const dismissTeaser = useCallback(() => {
    setTeaser(null);
    writeStorage(TEASER_KEY, true);
  }, []);

  // Keep the newest message in view.
  useLayoutEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: reducedMotion.current ? "auto" : "smooth" });
  }, [items, isTyping, suggestions, isOpen]);

  /** Reveal Aba's bubbles one at a time, with a typing pause before each. */
  const playReply = useCallback(async (reply: AbaReply) => {
    setSuggestions([]);
    for (const bubble of reply.bubbles) {
      setIsTyping(true);
      await wait(typingDelay(bubble, reducedMotion.current));
      setIsTyping(false);
      setItems((previous) => [...previous, { id: nextId(), from: "aba", bubble }]);
      await wait(reducedMotion.current ? 0 : 90);
    }
    setMood(reply.mood);
    setAbaState(reply.state);
    setSuggestions(reply.suggestions);
  }, []);

  const request = useCallback(async (payload: Record<string, unknown>) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        context: { path: window.location.pathname, hour: new Date().getHours() },
      }),
    });
    if (!response.ok) throw new Error(`Chat failed: ${response.status}`);
    return (await response.json()) as AbaReply;
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!text || isBusy) return;
      setInput("");
      setFailedText(null);
      setSuggestions([]);
      setItems((previous) => [...previous, { id: nextId(), from: "user", text }]);
      setIsBusy(true);
      setIsTyping(true);
      setMood("thinking");
      try {
        const reply = await request({ text, state: stateRef.current });
        await playReply(reply);
      } catch {
        setIsTyping(false);
        setMood("sorry");
        setFailedText(text);
      } finally {
        setIsTyping(false);
        setIsBusy(false);
      }
    },
    [isBusy, playReply, request],
  );

  const open = useCallback(async () => {
    dismissTeaser();
    setIsOpen(true);
    if (items.length || isBusy) return;
    setIsBusy(true);
    setIsTyping(true);
    try {
      await playReply(await request({ welcome: true }));
    } catch {
      setItems([
        {
          id: nextId(),
          from: "aba",
          bubble: { type: "text", text: "Ayubowan 🙏 I'm Aba, your Sri Lanka travel companion. What kind of trip are you dreaming of?" },
        },
      ]);
      setSuggestions(["Plan my trip", "Beaches", "Wildlife", "Tea country"]);
    } finally {
      setIsTyping(false);
      setIsBusy(false);
    }
  }, [dismissTeaser, isBusy, items.length, playReply, request]);

  const close = useCallback(() => {
    setIsOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  }, []);

  const restart = useCallback(async () => {
    if (isBusy) return;
    setItems([]);
    setAbaState(null);
    setSuggestions([]);
    setFailedText(null);
    setMood("warm");
    setIsBusy(true);
    setIsTyping(true);
    try {
      await playReply(await request({ welcome: true }));
    } catch {
      setSuggestions(["Plan my trip"]);
    } finally {
      setIsTyping(false);
      setIsBusy(false);
    }
  }, [isBusy, playReply, request]);

  const forget = useCallback((key: string) => {
    setAbaState((current) => {
      if (!current) return current;
      const profile = { ...current.profile };
      if (key === "days") profile.days = null;
      else if (key === "travellers") {
        profile.travellers = null;
        profile.kids = null;
      } else if (key === "month") profile.month = null;
      else if (key === "budget") profile.budget = null;
      else if (key.startsWith("interest:")) profile.interests = profile.interests.filter((item) => `interest:${item}` !== key);
      else if (key.startsWith("avoid:")) profile.avoid = profile.avoid.filter((item) => `avoid:${item}` !== key);
      return { ...current, profile };
    });
  }, []);

  // Focus the input on open; Escape closes.
  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [close, isOpen]);

  // Lock page scroll behind the full-screen chat on phones.
  useEffect(() => {
    if (!isOpen || !window.matchMedia("(max-width: 639px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Auto-grow the textarea up to four lines.
  useLayoutEffect(() => {
    const field = inputRef.current;
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${Math.min(field.scrollHeight, 112)}px`;
  }, [input, isOpen]);

  const onNavigate = useCallback(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setIsOpen(false);
  }, []);

  const statusText = isTyping ? "typing…" : isBusy ? "thinking…" : "Online · replies instantly";
  const remaining = MAX_MESSAGE_LENGTH - input.length;

  return (
    <>
      {isOpen ? (
        <section
          role="dialog"
          aria-label="Chat with Aba, your Sri Lanka travel companion"
          className="aba-panel fixed inset-0 z-[70] flex flex-col overflow-hidden bg-[#0d141e] text-white sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[min(660px,calc(100svh-8rem))] sm:w-[400px] sm:rounded-3xl sm:border sm:border-[#e2c27a]/20 sm:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)]"
        >
          {/* Header */}
          <header className="flex shrink-0 items-center gap-3 border-b border-white/8 bg-[#182231] px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <AbaAvatar size={44} mood={mood} thinking={isBusy} online />
            <div className="min-w-0 flex-1">
              <p className="font-cinzel text-base leading-tight tracking-[0.06em] text-[#e2c27a]">Aba</p>
              <p className="truncate text-xs text-white/55" aria-live="polite">
                {statusText}
              </p>
            </div>
            <button
              type="button"
              onClick={restart}
              disabled={isBusy}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
              aria-label="Start a new conversation"
              title="Start over"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={close}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {abaState ? <TripMemory state={abaState} onForget={forget} /> : null}

          {/* Conversation */}
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-color:rgba(226,194,122,0.3)_transparent] [scrollbar-width:thin]"
          >
            {items.map((item, index) => {
              if (item.from === "user") {
                return (
                  <div key={item.id} className="flex justify-end pt-1">
                    <div className="aba-pop max-w-[82%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-[#e2c27a] px-4 py-2.5 text-[14px] leading-6 text-[#0d141e]">
                      {item.text}
                    </div>
                  </div>
                );
              }
              const previous = items[index - 1];
              const startsGroup = !previous || previous.from === "user";
              return (
                <div key={item.id} className={`flex items-end gap-2 ${startsGroup ? "pt-1" : ""}`}>
                  <span className="w-7 shrink-0">{startsGroup ? <AbaAvatar size={28} mood={mood} /> : null}</span>
                  <div className="flex min-w-0 flex-1 flex-col items-start">
                    <AbaBubbleView bubble={item.bubble} onNavigate={onNavigate} />
                  </div>
                </div>
              );
            })}

            {isTyping ? (
              <div className="flex items-end gap-2" aria-label="Aba is typing">
                <span className="w-7 shrink-0">
                  {items.at(-1)?.from !== "aba" ? <AbaAvatar size={28} thinking /> : null}
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/8 bg-white/[0.07] px-4 py-3.5">
                  {[0, 1, 2].map((dot) => (
                    <span key={dot} className="aba-typing-dot h-1.5 w-1.5 rounded-full bg-[#e2c27a]" style={{ animationDelay: `${dot * 0.16}s` }} />
                  ))}
                </div>
              </div>
            ) : null}

            {failedText ? (
              <div className="ml-9 flex flex-wrap items-center gap-2 text-xs text-white/60">
                <span>Couldn&rsquo;t reach Aba just now.</span>
                <button
                  type="button"
                  onClick={() => {
                    const retry = failedText;
                    setItems((previous) => (previous.at(-1)?.from === "user" ? previous.slice(0, -1) : previous));
                    void send(retry);
                  }}
                  className="rounded-full border border-[#e2c27a]/40 px-3 py-1 text-[#e2c27a] transition hover:bg-[#e2c27a]/10"
                >
                  Try again
                </button>
              </div>
            ) : null}
          </div>

          {/* Quick replies */}
          {suggestions.length && !isBusy ? (
            <div className="flex shrink-0 gap-2 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Quick replies">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void send(suggestion)}
                  className="aba-pop shrink-0 rounded-full border border-[#e2c27a]/35 bg-[#e2c27a]/[0.08] px-3.5 py-1.5 text-[13px] text-[#f3dca4] transition hover:border-[#e2c27a] hover:bg-[#e2c27a]/20 active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}

          {/* Composer */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
            className="shrink-0 border-t border-white/8 bg-[#0d141e] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-white/12 bg-white/[0.05] py-1.5 pl-4 pr-1.5 transition focus-within:border-[#e2c27a]/60">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_MESSAGE_LENGTH}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    void send(input);
                  }
                }}
                placeholder={abaState?.userName ? `Message Aba, ${abaState.userName}…` : "Ask Aba anything about Sri Lanka…"}
                className="max-h-28 min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-5 text-white outline-none placeholder:text-white/35"
                aria-label="Message Aba"
              />
              <button
                type="submit"
                disabled={!input.trim() || isBusy}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e2c27a] text-[#0d141e] transition hover:bg-white active:scale-95 disabled:bg-white/10 disabled:text-white/30"
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
            <p className="mt-2 flex justify-between px-1 text-[10px] text-white/30">
              <span>Aba is a virtual guide. Our team confirms every plan.</span>
              {remaining < 80 ? <span className={remaining < 20 ? "text-[#e2c27a]" : ""}>{remaining}</span> : null}
            </p>
          </form>
        </section>
      ) : null}

      {/* Teaser bubble */}
      {teaser && !isOpen ? (
        <div className="aba-teaser fixed bottom-24 right-4 z-[60] flex max-w-[260px] items-start gap-2 rounded-2xl rounded-br-md border border-[#e2c27a]/25 bg-[#0d141e] py-3 pl-4 pr-2 text-sm leading-5 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] sm:right-6">
          <button type="button" onClick={() => void open()} className="text-left">
            {teaser}
          </button>
          <button
            type="button"
            onClick={dismissTeaser}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss message from Aba"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (isOpen ? close() : void open())}
        className={`aba-launcher fixed bottom-5 right-4 z-[60] h-14 w-14 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6 ${
          isOpen ? "max-sm:hidden" : ""
        }`}
        aria-label={isOpen ? "Close chat with Aba" : "Chat with Aba, your travel companion"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-[#e2c27a] text-[#0d141e] shadow-[0_10px_30px_-8px_rgba(226,194,122,0.6)]">
            <X className="h-6 w-6" strokeWidth={2.4} />
          </span>
        ) : (
          <AbaAvatar size={56} mood={teaser ? "excited" : "warm"} online />
        )}
      </button>
    </>
  );
}
