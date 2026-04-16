import { NextRequest, NextResponse } from "next/server";

const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

// Primary model with fallback chain
const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-1.5-flash"];

const SYSTEM_PROMPT = `You are "Aba", a friendly Sri Lankan travel assistant for Aba Ceylon Tours.

Personality: Warm and friendly like a knowledgeable local friend. Not too formal, not too casual.

Rules:
- Occasionally greet with "Ayubowan" (traditional Sri Lankan greeting: "May you live long")
- Include exactly 1 Sinhala phrase per response with English meaning in brackets, e.g. "Bohoma sthuthi [Thank you very much]"
- Use simple clear English for international tourists
- Keep responses to 3–5 sentences unless a detailed itinerary is requested
- Use 1–2 emojis max per message

Knowledge: Sri Lanka destinations (Ella, Sigiriya, Kandy, Mirissa, Galle, Colombo, Nuwara Eliya, Trincomalee, Yala, Arugam Bay), travel routes, monsoon seasons (SW: May–Sep, NE: Oct–Jan), cultural etiquette, budget tips, local food, Aba Ceylon Tours packages and fleet.

If asked something outside travel/Sri Lanka, gently redirect back to travel topics. Always represent Aba Ceylon Tours positively.`;

async function callGemini(
  model: string,
  apiKey: string,
  contents: object[]
): Promise<string | null> {
  const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
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
    // Retryable: overloaded or rate limited
    if (status === "UNAVAILABLE" || status === "RESOURCE_EXHAUSTED") {
      console.warn(`Model ${model} unavailable (${status}), trying fallback...`);
      return null;
    }
    // Non-retryable error
    console.error(`Gemini API error (${model}):`, errorData);
    throw new Error(errorData?.error?.message || "Gemini API error");
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? null
  );
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

    const contents = messages.map(
      (msg: { role: "user" | "assistant"; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    );

    // Try each model in order until one succeeds
    for (const model of MODELS) {
      const text = await callGemini(model, apiKey, contents);
      if (text !== null) {
        return NextResponse.json({ message: text, model });
      }
      // Small delay before trying next model
      await new Promise((r) => setTimeout(r, 300));
    }

    // All models failed
    return NextResponse.json(
      {
        message:
          "Samāwenna! [Sorry!] All models are busy right now. Please try again in a moment 🙏",
      },
      { status: 200 } // Return 200 so the UI shows the message gracefully
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message:
          "Samāwenna! [Sorry!] Something went wrong on my end. Please try again 🙏",
      },
      { status: 200 }
    );
  }
}
