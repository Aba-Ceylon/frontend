import { NextRequest, NextResponse } from "next/server";
import {
  buildRuleBasedChatResponse,
  type ChatMessage,
} from "@/lib/chatbot/ruleBasedChat";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const reply = await buildRuleBasedChatResponse(messages as ChatMessage[]);

    return NextResponse.json({
      message: reply,
      mode: "rule-based",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      message:
        "I hit a problem while building the rule-based reply. Please try again in a moment.",
    });
  }
}
