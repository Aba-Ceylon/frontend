import { NextRequest, NextResponse } from "next/server";
import { respond, welcome } from "@/lib/chatbot/brain";
import type { KnowledgeBase } from "@/lib/chatbot/knowledge";
import { MAX_MESSAGE_LENGTH, type AbaContext } from "@/lib/chatbot/types";
import { normalize } from "@/lib/chatbot/nlu";
import { activities } from "@/data/activities";
import { destinations as fallbackDestinations } from "@/data/destinations";
import { packages as fallbackPackages } from "@/data/packages";
import { stays as fallbackStays } from "@/data/stays";
import { fetchDestinations } from "@/services/destinationService";
import { fetchAllVehicles } from "@/services/fleetService";
import { fetchPackages } from "@/services/packageService";
import { fetchStays } from "@/services/stayService";

// Site data changes rarely; reuse it across messages instead of hitting
// Supabase four times per chat turn.
const KB_TTL_MS = 5 * 60 * 1000;
let cachedKb: { kb: KnowledgeBase; at: number } | null = null;

async function settle<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    const value = await promise;
    return Array.isArray(value) && value.length === 0 ? fallback : value;
  } catch {
    return fallback;
  }
}

async function getKnowledgeBase(): Promise<KnowledgeBase> {
  if (cachedKb && Date.now() - cachedKb.at < KB_TTL_MS) return cachedKb.kb;
  const [packages, vehicles, stays, destinations] = await Promise.all([
    settle(fetchPackages(), fallbackPackages),
    settle(fetchAllVehicles(), []),
    settle(fetchStays(), fallbackStays),
    settle(fetchDestinations(), fallbackDestinations),
  ]);
  // The site also serves local destination pages that aren't in the database,
  // so Aba should know those too (database entries win on duplicates).
  const known = new Set(destinations.flatMap((place) => [place.slug, normalize(place.name)]));
  const allDestinations = [
    ...destinations,
    ...fallbackDestinations.filter((place) => !known.has(place.slug) && !known.has(normalize(place.name))),
  ];
  const kb = { packages, vehicles, stays, destinations: allDestinations, activities };
  cachedKb = { kb, at: Date.now() };
  return kb;
}

function readContext(value: unknown): AbaContext {
  if (!value || typeof value !== "object") return {};
  const input = value as Record<string, unknown>;
  return {
    path: typeof input.path === "string" && input.path.startsWith("/") ? input.path.slice(0, 200) : undefined,
    hour: typeof input.hour === "number" && input.hour >= 0 && input.hour <= 23 ? Math.floor(input.hour) : undefined,
  };
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const context = readContext(body?.context);

  try {
    const kb = await getKnowledgeBase();

    // Opening message, tuned to the page the traveller is on.
    if (body?.welcome === true) {
      return NextResponse.json(welcome(context, kb));
    }

    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) {
      return NextResponse.json({ error: "Message is empty" }, { status: 400 });
    }
    if (text.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message is too long" }, { status: 413 });
    }

    return NextResponse.json(respond(text, body.state, context, kb));
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Aba is unavailable right now" }, { status: 500 });
  }
}
