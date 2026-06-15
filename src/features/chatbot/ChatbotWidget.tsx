"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Ayubowan! I’m Aba, your Sri Lanka travel guide. Tell me where you want to go, how many days you have, or how many people are travelling.",
  suggestions: ["Beaches", "Wildlife", "Hill country", "Heritage"],
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (rawMessage?: string) => {
    const trimmed = (rawMessage ?? input).trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: data.message,
        suggestions: Array.isArray(data.suggestions)
          ? data.suggestions.filter(
              (value: unknown): value is string =>
                typeof value === "string" && value.trim().length > 0,
            )
          : [],
      }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Samāwenna! [Sorry!] I'm having a little trouble connecting right now. Please try again in a moment 🙏",
          suggestions: ["Beaches", "Wildlife", "Hill country", "Heritage"],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const lastAssistantIndex = [...messages]
    .map((message, index) => ({ message, index }))
    .reverse()
    .find((entry) => entry.message.role === "assistant")?.index;

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 left-3 right-3 z-50 flex flex-col transition-all duration-300 ease-in-out sm:left-auto sm:right-6 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          width: "min(400px, calc(100vw - 1.5rem))",
          height: "min(560px, calc(100svh - 7.5rem))",
          borderRadius: "16px",
          background: "linear-gradient(160deg, #111111 0%, #1a1a1a 100%)",
          border: "1px solid rgba(201, 154, 43, 0.3)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,154,43,0.1), inset 0 1px 0 rgba(201,154,43,0.15)",
        }}
        aria-label="Aba travel guide chat"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(201,154,43,0.15) 0%, rgba(169,123,23,0.1) 100%)",
            borderBottom: "1px solid rgba(201,154,43,0.2)",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 overflow-hidden"
              style={{
                border: "2px solid rgba(201,154,43,0.6)",
                boxShadow: "0 0 12px rgba(201,154,43,0.4)",
              }}
            >
              <Image
                src="/abaceylon avatar.jpeg"
                alt="Aba"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p
                className="text-sm font-semibold leading-tight"
                style={{
                  fontFamily: "Cinzel, serif",
                  color: "#c99a2b",
                  letterSpacing: "0.05em",
                }}
              >
                Aba
              </p>
              <p
                className="text-xs leading-tight"
                style={{ color: "rgba(245,245,245,0.5)", fontFamily: "Switzer, system-ui" }}
              >
                Sri Lanka Travel Guide
              </p>
            </div>
          </div>

          {/* Online indicator + close */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#22c55e",
                  boxShadow: "0 0 6px #22c55e",
                }}
              />
              <span
                className="text-xs"
                style={{ color: "rgba(245,245,245,0.4)", fontFamily: "Switzer, system-ui" }}
              >
                Online
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-200"
              style={{ color: "rgba(245,245,245,0.5)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#c99a2b")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(245,245,245,0.5)")
              }
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#c99a2b #1a1a1a" }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div
                  className="flex items-end justify-center w-6 h-6 rounded-full shrink-0 mr-2 mb-0.5 overflow-hidden"
                  style={{
                    border: "1.5px solid rgba(201,154,43,0.5)",
                    minWidth: "24px",
                  }}
                >
                  <Image
                    src="/abaceylon avatar.jpeg"
                    alt="Aba"
                    width={24}
                    height={24}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div
                className="max-w-[78%] px-3 py-2 text-sm leading-relaxed"
                style={{
                  borderRadius:
                    msg.role === "user"
                      ? "14px 14px 4px 14px"
                      : "14px 14px 14px 4px",
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, #c99a2b 0%, #a97b17 100%)"
                      : "rgba(255,255,255,0.06)",
                  color: msg.role === "user" ? "#0a0a0a" : "#f5f5f5",
                  fontFamily: "Switzer, system-ui",
                  border:
                    msg.role === "assistant"
                      ? "1px solid rgba(201,154,43,0.15)"
                      : "none",
                  fontWeight: msg.role === "user" ? "500" : "400",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {lastAssistantIndex !== undefined &&
            !isLoading &&
            messages[lastAssistantIndex]?.suggestions?.length ? (
            <div className="pl-8 pr-2">
              <p
                className="mb-2 text-[11px] uppercase tracking-[0.16em]"
                style={{
                  color: "rgba(201,154,43,0.75)",
                  fontFamily: "Switzer, system-ui",
                }}
              >
                Quick choices
              </p>
              <div className="flex flex-wrap gap-2">
                {messages[lastAssistantIndex].suggestions?.map((suggestion) => (
                  <button
                    key={`${suggestion}-${messages.length}`}
                    onClick={() => sendMessage(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
                    style={{
                      background: "rgba(201,154,43,0.12)",
                      border: "1px solid rgba(201,154,43,0.35)",
                      color: "#f5deb0",
                      fontFamily: "Switzer, system-ui",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(201,154,43,0.22)";
                      e.currentTarget.style.borderColor = "rgba(201,154,43,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(201,154,43,0.12)";
                      e.currentTarget.style.borderColor = "rgba(201,154,43,0.35)";
                    }}
                    aria-label={`Choose ${suggestion}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div
                className="flex items-end justify-center w-6 h-6 rounded-full shrink-0 mr-2 mb-0.5 overflow-hidden"
                style={{
                  border: "1.5px solid rgba(201,154,43,0.5)",
                  minWidth: "24px",
                }}
              >
                <Image
                  src="/abaceylon avatar.jpeg"
                  alt="Aba"
                  width={24}
                  height={24}
                  className="object-cover w-full h-full"
                />
              </div>
              <div
                className="flex items-center gap-1 px-4 py-3"
                style={{
                  borderRadius: "14px 14px 14px 4px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(201,154,43,0.15)",
                }}
              >
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#c99a2b",
                      animation: `bounce 1.2s ease-in-out ${dot * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="px-3 py-3 shrink-0"
          style={{
            borderTop: "1px solid rgba(201,154,43,0.15)",
            borderRadius: "0 0 16px 16px",
          }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(201,154,43,0.2)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about routes, packages, or transport..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
              style={{
                color: "#f5f5f5",
                fontFamily: "Switzer, system-ui",
              }}
              aria-label="Type your message"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 shrink-0"
              style={{
                background:
                  input.trim() && !isLoading
                    ? "linear-gradient(135deg, #c99a2b 0%, #a97b17 100%)"
                    : "rgba(201,154,43,0.15)",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              }}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                  color={input.trim() ? "#0a0a0a" : "#c99a2b"}
                />
              ) : (
                <Send
                  size={14}
                  color={input.trim() ? "#0a0a0a" : "#c99a2b"}
                  strokeWidth={2.5}
                />
              )}
            </button>
          </div>
          <p
            className="text-center text-xs mt-2 opacity-30"
            style={{ fontFamily: "Switzer, system-ui", color: "#f5f5f5" }}
          >
            Powered by Aba Ceylon Tours
          </p>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full transition-all duration-300 sm:bottom-6 sm:right-6"
        style={{
          background: isOpen
            ? "linear-gradient(135deg, #a97b17 0%, #c99a2b 100%)"
            : "transparent",
          boxShadow: isOpen
            ? "0 4px 20px rgba(201,154,43,0.4)"
            : "0 4px 24px rgba(0,0,0,0.5), 0 0 0 2px rgba(201,154,43,0.5)",
          transform: isOpen ? "scale(0.95)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          if (!isOpen)
            e.currentTarget.style.boxShadow =
              "0 6px 28px rgba(0,0,0,0.6), 0 0 0 3px rgba(201,154,43,0.8)";
        }}
        onMouseLeave={(e) => {
          if (!isOpen)
            e.currentTarget.style.boxShadow =
              "0 4px 24px rgba(0,0,0,0.5), 0 0 0 2px rgba(201,154,43,0.5)";
        }}
        aria-label={isOpen ? "Close chat" : "Open Aba travel guide"}
        aria-expanded={isOpen}
      >
      {isOpen ? (
          <X size={22} color="#0a0a0a" strokeWidth={2.5} />
        ) : (
          <Image
            src="/abaceylon avatar.jpeg"
            alt="Aba Ceylon chat"
            width={56}
            height={56}
            className="w-full h-full rounded-full object-cover"
          />
        )}

        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "#ef4444",
              color: "#fff",
              fontSize: "9px",
              fontFamily: "Switzer, system-ui",
            }}
          >
            1
          </span>
        )}
      </button>

      {/* Bounce animation keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
