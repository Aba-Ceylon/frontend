import { NextRequest, NextResponse } from "next/server";
import { fetchChatContext } from "@/lib/chatbot/fetchChatContext";

const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

// Primary model with fallback chain
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

function buildSystemPrompt(liveContext: string): string {
  return `You are "Aba", a friendly Sri Lankan travel assistant for Aba Ceylon Tours.

Personality: Warm and friendly like a knowledgeable local friend. Not too formal, not too casual.

Conversation style:
- Keep the conversation flowing naturally — always end with a follow-up question or a nudge to keep things moving
- Build on what the user says. If they mention a place, ask how many days or who they're travelling with. If they mention a group size, suggest a matching vehicle. If they mention interests, recommend a matching package.
- Guide the conversation progressively: destination → duration → group size → package recommendation → vehicle suggestion → booking
- Never dump all information at once. Give one focused answer, then ask one question to move forward
- If the user seems ready, gently suggest they check out /packages or /fleet, or contact the team

Rules:
- Never use "Ayubowan" again after the first greeting — speak only in plain English from then on
- No Sinhala words, phrases, or translations at all
- Use simple clear English for international tourists
- Keep responses to 3–5 sentences max
- Use 1–2 emojis max per message
- When recommending packages or vehicles, use the REAL DATA below — actual titles, durations, routes, and vehicle names
- When asked about vehicles/transport, mention specific vehicles from the fleet with their capacity

General Knowledge: Sri Lanka destinations (Ella, Sigiriya, Kandy, Mirissa, Galle, Colombo, Nuwara Eliya, Trincomalee, Yala, Arugam Bay), travel routes, monsoon seasons (SW: May–Sep, NE: Oct–Jan), cultural etiquette, budget tips, local food.

If asked something outside travel/Sri Lanka, gently redirect back to travel topics.

${liveContext}`;
}

async function callGemini(
  model: string,
  apiKey: string,
  systemPrompt: string,
  contents: object[]
): Promise<string | null> {
  const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 512,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const status = errorData?.error?.status;
    if (status === "UNAVAILABLE" || status === "RESOURCE_EXHAUSTED") {
      console.warn(`Model ${model} unavailable (${status}), trying fallback...`);
      return null;
    }
    console.error(`Gemini API error (${model}):`, errorData);
    throw new Error(errorData?.error?.message || "Gemini API error");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Fetch live packages + fleet context (cached for 10 min)
    const liveContext = await fetchChatContext();
    const systemPrompt = buildSystemPrompt(liveContext);

    const contents = messages.map(
      (msg: { role: "user" | "assistant"; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    );

    // Try each model in order until one succeeds
    for (const model of MODELS) {
      const text = await callGemini(model, apiKey, systemPrompt, contents);
      if (text !== null) {
        return NextResponse.json({ message: text, model });
      }
      await new Promise((r) => setTimeout(r, 300));
    }

    return NextResponse.json({
      message:
        "Samāwenna! [Sorry!] All models are busy right now. Please try again in a moment 🙏",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      message:
        "Samāwenna! [Sorry!] Something went wrong on my end. Please try again 🙏",
    });
  }
}
