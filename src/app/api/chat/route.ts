import { NextRequest, NextResponse } from "next/server";
import {
  buildRuleBasedReply,
  type ChatMessage,
} from "@/lib/chatbot/buildRuleBasedReply";

function isValidMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages)
      ? body.messages.filter(isValidMessage)
      : null;

    if (!messages?.length) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const reply = await buildRuleBasedReply(messages);
    return NextResponse.json(reply);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      message:
        "I’m having a little trouble right now. Please try again in a moment.",
      suggestions: ["Beaches", "Wildlife", "Hill country", "Heritage"],
    });
  }
}
