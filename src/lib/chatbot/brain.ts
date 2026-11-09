// Aba's dialogue manager.
//
// Each turn:  understand → remember → decide → respond.
//  1. understand  the message (nlu.ts): intents, trip details, places, name.
//  2. remember    merge what was learned into the trip profile; answer the
//                 question Aba asked last turn if the reply was just "5".
//  3. decide      which skill handles the turn (small talk, planning, place
//                 guide, seasons, stays, transport, prices, hand-off…).
//  4. respond     acknowledge what's new like a person would, answer, then
//                 ask at most one natural follow-up and offer quick replies.

import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";
import { routes } from "@/constants/routes";
import type { Destination } from "@/types/destination";
import type { PackageItem } from "@/types/package";
import type { Stay } from "@/types/stay";
import type { FleetVehicle } from "@/types/vehicle";
import {
  COMPANY,
  MONTH_EXTRAS,
  MONTH_NAMES,
  REGION_CLIMATE,
  TRAVEL_FACTS,
  sriLankaNow,
  type KnowledgeBase,
} from "./knowledge";
import { INTEREST_PLACE_HINTS, INTEREST_WORDS, extractDays, normalize, understand, type Understanding } from "./nlu";
import { hasSaid, joinList, nameTag, plural, remember, say, timeGreeting } from "./persona";
import {
  createInitialState,
  type AbaBubble,
  type AbaCard,
  type AbaContext,
  type AbaMood,
  type AbaReply,
  type AbaState,
  type Interest,
  type Slot,
  type Topic,
  type TripProfile,
} from "./types";

const FALLBACK_IMAGE = "/images/heritage/sl-image.webp";

const INTEREST_LABEL: Record<Interest, string> = {
  beach: "beaches",
  wildlife: "wildlife",
  heritage: "ancient cities",
  hills: "tea country and hills",
  north: "the north",
  adventure: "adventure",
  wellness: "slow, relaxing days",
  food: "food and village life",
};

const SLOT_CHIPS: Record<Slot, string[]> = {
  interests: ["Beaches", "Wildlife", "Ancient cities", "Tea country"],
  days: ["5 days", "1 week", "10 days", "2 weeks"],
  travellers: ["Just me", "A couple", "Family of 4", "Group of 6"],
  month: ["December", "March", "July", "Not sure yet"],
};

const START_CHIPS = ["Plan my trip", "Beaches", "Wildlife", "Tea country"];

// Hill-country spots in the eastern rain shadow, dry while the west is wet.
const EASTERN_HILLS = ["ella", "nine-arch-bridge", "haputale", "badulla"];

// ─── Reply builder ───────────────────────────────────────────────────────────

class Turn {
  bubbles: AbaBubble[] = [];
  chips: string[] = [];
  mood: AbaMood = "warm";

  text(...parts: Array<string | false | null | undefined>) {
    const text = parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    if (text) this.bubbles.push({ type: "text", text });
    return this;
  }
  cards(cards: AbaCard[]) {
    if (cards.length) this.bubbles.push({ type: "cards", cards });
    return this;
  }
  action(label: string, href: string, style: "whatsapp" | "primary" = "primary") {
    this.bubbles.push({ type: "action", label, href, style, external: /^https?:/.test(href) });
    return this;
  }
  suggest(...chips: string[]) {
    for (const chip of chips) if (chip && !this.chips.includes(chip)) this.chips.push(chip);
    return this;
  }
}

// ─── State safety ────────────────────────────────────────────────────────────

const INTERESTS = Object.keys(INTEREST_LABEL) as Interest[];
const TOPICS: Topic[] = ["packages", "stays", "vehicles", "destinations", "activities"];
const SLOTS: Slot[] = ["interests", "days", "travellers", "month"];

function num(value: unknown, min: number, max: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max ? Math.round(value) : null;
}

function strings(value: unknown, limit: number, allowed?: readonly string[]) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.length <= 80 && (!allowed || allowed.includes(item)))
    .slice(0, limit);
}

/** The client sends state back each turn; never trust its shape. */
export function sanitizeState(raw: unknown): AbaState {
  const base = createInitialState();
  if (!raw || typeof raw !== "object") return base;
  const input = raw as Record<string, unknown>;
  const profile = (input.profile && typeof input.profile === "object" ? input.profile : {}) as Record<string, unknown>;
  const shown = (input.shown && typeof input.shown === "object" ? input.shown : {}) as Record<string, unknown>;

  return {
    v: 1,
    profile: {
      days: num(profile.days, 1, 60),
      travellers: num(profile.travellers, 1, 60),
      kids: num(profile.kids, 0, 30),
      month: num(profile.month, 0, 11),
      interests: strings(profile.interests, 8, INTERESTS) as Interest[],
      avoid: strings(profile.avoid, 8, INTERESTS) as Interest[],
      budget: ["value", "comfort", "luxury"].includes(profile.budget as string) ? (profile.budget as TripProfile["budget"]) : null,
      occasion: ["honeymoon", "family", "solo", "friends"].includes(profile.occasion as string) ? (profile.occasion as TripProfile["occasion"]) : null,
      places: strings(profile.places, 8),
    },
    userName: typeof input.userName === "string" && /^[A-Za-z-]{2,20}$/.test(input.userName) ? input.userName : null,
    shown: Object.fromEntries(TOPICS.map((topic) => [topic, strings(shown[topic], 40)])) as Record<Topic, string[]>,
    topic: TOPICS.includes(input.topic as Topic) ? (input.topic as Topic) : null,
    pendingSlot: SLOTS.includes(input.pendingSlot as Slot) ? (input.pendingSlot as Slot) : null,
    focusPlace: typeof input.focusPlace === "string" && input.focusPlace.length <= 80 ? input.focusPlace : null,
    turn: num(input.turn, 0, 10000) ?? 0,
    confusion: num(input.confusion, 0, 20) ?? 0,
    recent: strings(input.recent, 16),
  };
}

// ─── Memory ──────────────────────────────────────────────────────────────────

function mergeProfile(profile: TripProfile, u: Understanding) {
  if (u.days) profile.days = u.days;
  if (u.travellers) profile.travellers = u.travellers;
  if (u.kids !== null) profile.kids = u.kids;
  if (u.month !== null) profile.month = u.month;
  if (u.budget) profile.budget = u.budget;
  if (u.occasion) profile.occasion = u.occasion;
  for (const interest of u.interests) {
    if (!profile.interests.includes(interest)) profile.interests.push(interest);
    profile.avoid = profile.avoid.filter((item) => item !== interest);
  }
  for (const interest of u.avoid) {
    if (!profile.avoid.includes(interest)) profile.avoid.push(interest);
    profile.interests = profile.interests.filter((item) => item !== interest);
  }
}

/** A bare "5" or "two of us" answers whatever Aba asked last. */
function answerPendingSlot(state: AbaState, u: Understanding) {
  const slot = state.pendingSlot;
  if (!slot) return;
  if (slot === "days" && !u.days && u.bareNumber && u.bareNumber <= 60) u.days = u.bareNumber;
  if (slot === "travellers" && !u.travellers) {
    if (u.bareNumber && u.bareNumber <= 60) u.travellers = u.bareNumber;
    else if (/\bof us\b/.test(u.norm)) {
      const match = u.norm.match(/(\d+)/);
      if (match) u.travellers = Number(match[1]);
    }
  }
  if (slot === "month" && /\b(not sure|dont know|do not know|flexible|any ?time|undecided|unsure|no idea)\b/.test(u.norm)) {
    remember(state, "skip:month");
  }
}

/** Short human summary of what changed, e.g. "10 days, 2 of you, in March". */
function describeLearned(before: TripProfile, after: TripProfile) {
  const bits: string[] = [];
  if (after.days && after.days !== before.days) {
    bits.push(after.days % 7 === 0 && after.days >= 7 ? plural(after.days / 7, "week") : plural(after.days, "day"));
  }
  if (after.travellers && after.travellers !== before.travellers) {
    if (after.travellers === 1) bits.push("just you");
    else if (after.kids && after.kids !== before.kids) bits.push(`${after.travellers} of you, including ${plural(after.kids, "little one")}`);
    else bits.push(`${after.travellers} of you`);
  }
  if (after.month !== null && after.month !== before.month) bits.push(`in ${MONTH_NAMES[after.month]}`);
  const newInterests = after.interests.filter((item) => !before.interests.includes(item));
  if (newInterests.length) bits.push(joinList(newInterests.map((item) => INTEREST_LABEL[item])));
  const newAvoid = after.avoid.filter((item) => !before.avoid.includes(item));
  if (newAvoid.length) bits.push(`no ${joinList(newAvoid.map((item) => INTEREST_LABEL[item]), "or")}`);
  if (after.budget && after.budget !== before.budget) {
    bits.push(after.budget === "luxury" ? "a touch of luxury" : after.budget === "value" ? "good value" : "comfortable but sensible");
  }
  return bits;
}

function acknowledge(state: AbaState, before: TripProfile, turn: Turn) {
  const bits = describeLearned(before, state.profile);
  const profile = state.profile;
  const lines: string[] = [];

  if (profile.occasion === "honeymoon" && before.occasion !== "honeymoon") {
    lines.push(say(state, "ack:honeymoon", ["A honeymoon! Congratulations 🎉", "Oh, a honeymoon, how lovely! Congratulations.", "Congratulations, you two! 🥂"]));
  } else if (profile.kids && !before.kids) {
    lines.push(say(state, "ack:kids", ["Travelling with little ones, lovely. I'll keep drives short and days gentle.", "Kids along too! Sri Lanka is wonderful for families."]));
  }

  if (bits.length) {
    lines.push(
      say(state, "ack:learned", [
        `Got it: ${joinList(bits)}.`,
        `Noted: ${joinList(bits)}.`,
        `Lovely, ${joinList(bits)}.`,
        `Perfect, ${joinList(bits)}.`,
      ]),
    );
  }

  if (profile.days && profile.days !== before.days && !hasSaid(state, "remark:days")) {
    remember(state, "remark:days");
    if (profile.days <= 4) lines.push("That's a short, sweet escape, so I'll keep the route compact.");
    else if (profile.days >= 12) lines.push("That's enough time to see most of the island at an easy pace.");
  }

  if (lines.length) turn.text(...lines);
}

function nextMissingSlot(state: AbaState): Slot | null {
  const profile = state.profile;
  if (!profile.interests.length && !profile.places.length) return "interests";
  if (!profile.days) return "days";
  if (!profile.travellers) return "travellers";
  if (profile.month === null && !hasSaid(state, "skip:month") && !hasSaid(state, "ask:month")) return "month";
  return null;
}

function askFor(state: AbaState, slot: Slot, turn: Turn) {
  state.pendingSlot = slot;
  remember(state, `ask:${slot}`);
  turn.mood = "curious";
  const question: Record<Slot, string[]> = {
    interests: [
      "What kind of trip are you dreaming of: beaches, wildlife, ancient cities or misty tea country?",
      "Tell me what makes a great holiday for you. Lazy beaches, safaris, temples and ruins, or cool green hills?",
    ],
    days: ["How many days will you have on the island?", "Roughly how long is your trip?"],
    travellers: [
      "And who's coming along: just you, a couple, family or a group of friends?",
      "How many of you are travelling?",
    ],
    month: [
      "Do you know roughly when you're coming? The two coasts have different seasons, so it helps me pick the right side.",
      "Which month are you thinking of? Sri Lanka has two monsoons, so timing changes the best route.",
    ],
  };
  turn.text(say(state, `ask:${slot}:q`, question[slot]));
  turn.suggest(...SLOT_CHIPS[slot]);
}

// ─── Lookups and scoring ─────────────────────────────────────────────────────

function findDestination(kb: KnowledgeBase, slug: string | null | undefined) {
  return slug ? kb.destinations.find((item) => item.slug === slug) ?? null : null;
}

function packageDays(pkg: PackageItem) {
  return extractDays(normalize(pkg.duration));
}

function scorePackage(pkg: PackageItem, profile: TripProfile, kb: KnowledgeBase) {
  const corpus = normalize(
    [pkg.title, pkg.summary, pkg.overview, pkg.route.join(" "), ...pkg.itinerary.map((day) => `${day.title} ${day.description}`)].join(" "),
  );
  const words = new Set(corpus.split(" "));
  const vocabulary = (interest: Interest) => [...INTEREST_WORDS[interest], ...INTEREST_PLACE_HINTS[interest]];
  const hits = (interest: Interest) => vocabulary(interest).filter((word) => words.has(word)).length;

  let score = 0;
  for (const interest of profile.interests) score += Math.min(hits(interest), 3) * 4;
  for (const interest of profile.avoid) score -= Math.min(hits(interest), 3) * 5;
  for (const slug of profile.places) {
    const place = findDestination(kb, slug);
    if (place && corpus.includes(normalize(place.name))) score += 9;
  }
  const length = packageDays(pkg);
  if (profile.days && length) {
    score += Math.max(0, 8 - Math.abs(length - profile.days) * 1.5);
    if (length > profile.days + 1) score -= 6;
  }
  return score;
}

function rankPackages(kb: KnowledgeBase, profile: TripProfile, exclude: string[]) {
  return kb.packages
    .map((pkg, index) => ({ pkg, index, score: scorePackage(pkg, profile, kb) }))
    .filter((entry) => !exclude.includes(entry.pkg.id))
    .sort((a, b) => b.score - a.score || a.index - b.index);
}

function pickVehicle(kb: KnowledgeBase, travellers: number | null, budget: TripProfile["budget"]) {
  const usable = kb.vehicles.filter((vehicle) => vehicle.availabilityStatus?.toLowerCase() !== "unavailable");
  if (!usable.length || !travellers) return null;
  const fits = usable
    .filter((vehicle) => vehicle.passengerCapacity >= travellers)
    .sort((a, b) => {
      // Convertibles and luxury SUVs are a choice, not a default.
      const showy = (vehicle: FleetVehicle) => (/luxury|cabriolet|convertible|limousine/i.test(`${vehicle.type} ${vehicle.name}`) ? 1 : 0);
      const styleGap = budget === "luxury" ? showy(b) - showy(a) : showy(a) - showy(b);
      return styleGap || a.passengerCapacity - b.passengerCapacity;
    });
  return fits[0] ?? [...usable].sort((a, b) => b.passengerCapacity - a.passengerCapacity)[0];
}

function scoreStay(stay: Stay, profile: TripProfile, kb: KnowledgeBase, place: Destination | null) {
  const corpus = normalize(`${stay.name} ${stay.location} ${stay.category} ${stay.description}`);
  let score = 0;
  const targets = place ? [place] : profile.places.map((slug) => findDestination(kb, slug)).filter(Boolean) as Destination[];
  for (const target of targets) {
    if (corpus.includes(normalize(target.name))) score += 10;
    else if (target.district && corpus.includes(normalize(target.district))) score += 6;
  }
  for (const interest of profile.interests) {
    if ([...INTEREST_WORDS[interest], ...INTEREST_PLACE_HINTS[interest]].some((word) => corpus.includes(word))) score += 3;
  }
  if (profile.budget === "luxury" && /luxury|resort|boutique|villa/.test(corpus)) score += 3;
  if (profile.budget === "value" && /eco|guest|homestay|lodge/.test(corpus)) score += 3;
  if (profile.occasion === "honeymoon" && /boutique|villa|luxury|resort/.test(corpus)) score += 2;
  return score;
}

// ─── Cards and links ─────────────────────────────────────────────────────────

const packageCard = (pkg: PackageItem): AbaCard => ({
  kind: "package",
  id: pkg.id,
  title: pkg.title,
  subtitle: pkg.route.slice(0, 3).join(" · "),
  meta: [pkg.duration, pkg.km ? `${pkg.km} km` : ""].filter(Boolean).join(" · "),
  image: pkg.image || FALLBACK_IMAGE,
  href: `${routes.packages}/${pkg.id}`,
});

const stayCard = (stay: Stay): AbaCard => ({
  kind: "stay",
  id: stay.id,
  title: stay.name,
  subtitle: stay.location,
  meta: stay.category,
  image: stay.image || FALLBACK_IMAGE,
  href: `${routes.stays}/${stay.id}`,
});

const vehicleCard = (vehicle: FleetVehicle): AbaCard => ({
  kind: "vehicle",
  id: vehicle.id,
  title: vehicle.name,
  subtitle: [vehicle.brandName, vehicle.type].filter(Boolean).join(" · "),
  meta: `${plural(vehicle.passengerCapacity, "seat")} · ${plural(vehicle.luggageCapacity, "bag")}`,
  image: vehicle.imageUrl || FALLBACK_IMAGE,
  href: `${routes.fleet}/${vehicle.id}`,
});

const destinationCard = (place: Destination): AbaCard => ({
  kind: "destination",
  id: place.slug,
  title: place.name,
  subtitle: place.region,
  meta: place.category,
  image: place.images?.[0] || FALLBACK_IMAGE,
  href: `${routes.destinations}/${place.slug}`,
});

function tripSummaryLines(state: AbaState, kb: KnowledgeBase) {
  const p = state.profile;
  const lines: string[] = [];
  const basics = [
    p.days ? plural(p.days, "day") : "",
    p.travellers ? `${plural(p.travellers, "traveller")}${p.kids ? ` (${plural(p.kids, "child", "children")})` : ""}` : "",
    p.month !== null ? MONTH_NAMES[p.month] : "",
  ].filter(Boolean);
  if (basics.length) lines.push(`Trip: ${basics.join(", ")}`);
  if (p.interests.length) lines.push(`Interests: ${p.interests.map((item) => INTEREST_LABEL[item]).join(", ")}`);
  if (p.avoid.length) lines.push(`Not keen on: ${p.avoid.map((item) => INTEREST_LABEL[item]).join(", ")}`);
  const placeNames = p.places.map((slug) => findDestination(kb, slug)?.name).filter(Boolean);
  if (placeNames.length) lines.push(`Places: ${placeNames.join(", ")}`);
  if (p.budget) lines.push(`Style: ${p.budget}`);
  if (p.occasion) lines.push(`Occasion: ${p.occasion}`);
  const liked = state.shown.packages
    .slice(-2)
    .map((id) => kb.packages.find((pkg) => pkg.id === id)?.title)
    .filter(Boolean);
  if (liked.length) lines.push(`Packages I looked at: ${liked.join(", ")}`);
  return lines;
}

function handoffLink(state: AbaState, kb: KnowledgeBase) {
  const number = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || COMPANY.phone;
  const intro = state.userName ? `Hello Aba Ceylon, this is ${state.userName}!` : "Hello Aba Ceylon!";
  const lines = tripSummaryLines(state, kb);
  const message = [
    intro,
    "I've been chatting with Aba on your website.",
    ...(lines.length ? ["", ...lines] : []),
    "",
    "Could you help me plan this trip?",
  ].join("\n");
  return generateWhatsAppLink(number, message);
}

function offerHandoff(state: AbaState, kb: KnowledgeBase, turn: Turn, lead?: string) {
  turn.text(
    lead ??
      say(state, "handoff:offer", [
        "When you're ready, I can pass everything we've talked about to our planners on WhatsApp, so you won't need to repeat yourself.",
        "Shall I send this to our team? They'll reply on WhatsApp with a proper plan and quote. No payment until you've seen it.",
      ]),
  );
  turn.action("Send my trip to the team", handoffLink(state, kb), "whatsapp");
}

// ─── Skills ──────────────────────────────────────────────────────────────────

/** [11, 0, 1, 2, 3] → ["from December to April"]; keeps wrap-around ranges together. */
function compressMonths(months: number[]) {
  if (!months.length) return [];
  const sorted = [...months].sort((a, b) => a - b);
  const ranges: Array<[number, number]> = [];
  for (const month of sorted) {
    const last = ranges.at(-1);
    if (last && month === last[1] + 1) last[1] = month;
    else ranges.push([month, month]);
  }
  // December joins up with January.
  if (ranges.length > 1 && ranges[0][0] === 0 && ranges.at(-1)![1] === 11) {
    const tail = ranges.pop()!;
    ranges[0][0] = tail[0];
  }
  return ranges.map(([from, to]) => (from === to ? `in ${MONTH_NAMES[from]}` : `from ${MONTH_NAMES[from]} to ${MONTH_NAMES[to]}`));
}

/** Suggest an extension the traveller would actually want. */
function extensionIdea(profile: TripProfile) {
  const extras: Array<[Interest, string]> = [
    ["beach", "a few beach days on the south coast"],
    ["heritage", "the ancient cities of the Cultural Triangle"],
    ["hills", "the tea country around Ella"],
    ["wildlife", "a safari in Yala or Udawalawe"],
    ["wellness", "a few slow days to unwind"],
  ];
  const liked = extras.find(([interest]) => profile.interests.includes(interest) && !profile.avoid.includes(interest));
  const neutral = extras.find(([interest]) => !profile.avoid.includes(interest));
  return (liked ?? neutral)?.[1] ?? "another region";
}

function recommend(state: AbaState, kb: KnowledgeBase, turn: Turn, { more = false } = {}) {
  const profile = state.profile;
  const missing = nextMissingSlot(state);

  // Nothing to go on yet: ask what kind of trip, warmly.
  if (missing === "interests" && !profile.days) {
    askFor(state, "interests", turn);
    return;
  }

  // New details re-rank everything; "show me another" skips what's been seen.
  const lastShown = state.shown.packages.slice(-2);
  const ranked = rankPackages(kb, profile, more ? state.shown.packages : []);
  const picks = ranked.slice(0, 2).map((entry) => entry.pkg);
  const samePicks = !more && picks.length > 0 && picks.every((pkg) => lastShown.includes(pkg.id));

  if (!picks.length) {
    turn.mood = "thinking";
    turn.text(
      more
        ? say(state, "rec:exhausted", [
            "That's every ready-made journey I have that fits. The good news: our planners build fully custom routes too.",
            "I've shown you all the packages that suit you. Want me to have the team draw up a custom route instead?",
          ])
        : "I don't have a ready-made journey for that right now, but our team builds custom routes all the time.",
    );
    turn.action("Design a custom route", routes.customizeJourneys);
    offerHandoff(state, kb, turn, "Or I can send your details to the team on WhatsApp.");
    turn.suggest("Where to stay", "Best time to go", "Start over");
    return;
  }

  state.topic = "packages";
  state.shown.packages = [...state.shown.packages.filter((id) => !picks.some((pkg) => pkg.id === id)), ...picks.map((pkg) => pkg.id)].slice(-40);
  turn.mood = "excited";

  const first = picks[0];
  const firstDays = packageDays(first);
  const fitNote =
    profile.days && firstDays && firstDays < profile.days - 2
      ? ` It's ${plural(firstDays, "day")}, so there's room to add ${extensionIdea(profile)}.`
      : "";

  if (samePicks) {
    turn.text(
      fitNote ? `**${first.title}** is still my top pick.${fitNote}` : say(state, "rec:same", [
        `**${picks[0].title}** is still my top pick for you.`,
        "Those two journeys are still the best fit.",
        `That still points to **${picks[0].title}**.`,
      ]),
    );
  } else {


  turn.text(
    more
      ? say(state, "rec:more", ["Here are a couple more that could work.", "Of course, how about these?", "Sure, a few other directions:"])
      : say(state, "rec:intro", [
          `Here's what I'd suggest${nameTag(state)}.`,
          "I think you'll love these.",
          "These two fit you nicely.",
        ]),
    `**${first.title}** takes in ${joinList(first.route.slice(0, 3))}.${fitNote}`,
  );
  turn.cards(picks.map(packageCard));
  }

  const vehicle = pickVehicle(kb, profile.travellers, profile.budget);
  if (vehicle && !hasSaid(state, `veh:${vehicle.id}`)) {
    remember(state, `veh:${vehicle.id}`);
    const tooBig = profile.travellers && profile.travellers > vehicle.passengerCapacity;
    turn.text(
      tooBig
        ? `For ${profile.travellers} travellers our largest vehicle is the **${vehicle.name}** (${plural(vehicle.passengerCapacity, "seat")}); the team can arrange a second vehicle.`
        : `For ${profile.travellers === 1 ? "you" : `${profile.travellers} of you`}, the **${vehicle.name}** (${plural(vehicle.passengerCapacity, "seat")}) with your own chauffeur would be just right.`,
    );
  }

  if (missing && missing !== "interests") {
    askFor(state, missing, turn);
  } else {
    state.pendingSlot = null;
    if (!hasSaid(state, "handoff:offered")) {
      remember(state, "handoff:offered");
      offerHandoff(state, kb, turn);
    }
    turn.suggest("Show me another", "Where to stay", "Best time to go", "Talk to the team");
  }
}

function placeGuide(state: AbaState, kb: KnowledgeBase, place: Destination, turn: Turn) {
  state.focusPlace = place.slug;
  state.topic = "destinations";
  if (!state.shown.destinations.includes(place.slug)) state.shown.destinations.push(place.slug);
  turn.mood = "excited";

  const highlights = place.highlights.slice(0, 3);
  turn.text(
    say(state, "place:intro", [`Ah, **${place.name}**!`, `**${place.name}**, good choice.`, `Let me tell you about **${place.name}**.`]),
    place.summary || place.description.slice(0, 220),
  );
  const details: string[] = [];
  if (highlights.length) details.push(`Don't miss: ${joinList(highlights)}.`);
  if (place.bestTimeToVisit) details.push(`Best time: ${place.bestTimeToVisit}.`);
  if (details.length) turn.text(...details);
  turn.cards([destinationCard(place)]);

  const inTrip = state.profile.places.includes(place.slug);
  turn.suggest(
    inTrip ? "Plan my trip" : `Add ${place.name} to my trip`,
    `Stays near ${place.name}`,
    "Best time to go",
    "Another place",
  );
}

function addToTrip(state: AbaState, kb: KnowledgeBase, u: Understanding, pagePlace: Destination | null, turn: Turn) {
  const place = findDestination(kb, u.places[0]) ?? findDestination(kb, state.focusPlace) ?? pagePlace;
  if (!place) {
    turn.text("Which place would you like me to add? Tell me its name and I'll pop it on your list.");
    turn.suggest("Sigiriya", "Ella", "Mirissa", "Kandy");
    return;
  }
  if (!state.profile.places.includes(place.slug)) state.profile.places.push(place.slug);
  const category = normalize(`${place.category} ${place.region}`);
  const implied: Interest | null =
    /beach|coast/.test(category) ? "beach" : /wildlife/.test(category) ? "wildlife" : /heritage|cultural/.test(category) ? "heritage" : /hill|nature/.test(category) ? "hills" : /north/.test(category) ? "north" : null;
  if (implied && !state.profile.interests.includes(implied) && !state.profile.avoid.includes(implied)) {
    state.profile.interests.push(implied);
  }
  const names = state.profile.places.map((slug) => findDestination(kb, slug)?.name).filter(Boolean) as string[];
  turn.mood = "excited";
  turn.text(
    say(state, "add:done", [`Added **${place.name}** ✓`, `**${place.name}** is on your list ✓`, `Done, **${place.name}** is in ✓`]),
    names.length > 1 ? `Your list so far: ${joinList(names)}.` : "",
  );
  recommend(state, kb, turn);
}

function seasonAdvice(state: AbaState, kb: KnowledgeBase, u: Understanding, pagePlace: Destination | null, turn: Turn) {
  const month = u.month ?? state.profile.month;
  const place = findDestination(kb, u.places[0]) ?? (u.deictic ? pagePlace : null) ?? findDestination(kb, state.focusPlace);
  turn.mood = "thinking";

  if (month === null && place) {
    const climate = REGION_CLIMATE[place.region];
    const driest = climate ? joinList(compressMonths(climate.best)) : "";
    turn.text(
      place.bestTimeToVisit
        ? `The best time for **${place.name}** is ${place.bestTimeToVisit}.`
        : `**${place.name}** is in ${climate?.label ?? place.region}.`,
      climate && driest ? `Weather-wise, ${climate.label.split(" (")[0]} is usually driest ${driest}.` : "",
      climate?.note ?? "",
    );
    state.pendingSlot = "month";
    remember(state, "ask:month");
    remember(state, "ask:seasonMonth");
    turn.text("Which month are you thinking of? I'll tell you what to expect.");
    turn.suggest(...SLOT_CHIPS.month);
    return;
  }

  if (month === null) {
    turn.text(
      "Sri Lanka has two monsoons, so there's always a sunny side. **December to April** is best for the west and south coasts and the hill country; **April to September** is best for the east coast, Trincomalee and Arugam Bay. The Cultural Triangle is good for most of the year.",
    );
    askFor(state, "month", turn);
    remember(state, "ask:seasonMonth");
    return;
  }

  const monthName = MONTH_NAMES[month];
  const good = Object.values(REGION_CLIMATE).filter((region) => region.best.includes(month));
  const extras = MONTH_EXTRAS.filter((extra) => extra.months.includes(month)).map((extra) => extra.text);

  if (place) {
    const climate = REGION_CLIMATE[place.region];
    const easternHills = EASTERN_HILLS.includes(place.slug) && month >= 4 && month <= 8;
    const verdict = easternHills
      ? `${monthName} is a good time for **${place.name}**. It sits on the drier eastern side of the hills, so it's usually pleasant while the west gets the monsoon.`
      : climate
      ? climate.best.includes(month)
        ? `${monthName} is a lovely time for **${place.name}**, usually dry and sunny.`
        : `${monthName} can be wetter around **${place.name}**, with showers more likely, though it's still very visitable.`
      : `In ${monthName}, conditions around **${place.name}** vary.`;
    turn.text(verdict, !easternHills && climate?.note && !climate.best.includes(month) ? climate.note : "", place.bestTimeToVisit ? `Its best window is ${place.bestTimeToVisit}.` : "");
  } else {
    turn.text(
      `In **${monthName}**, the best weather is usually in ${joinList(good.map((region) => region.label))}.`,
      extras.length ? `Bonus: ${joinList(extras)}.` : "",
    );
    const hills = REGION_CLIMATE["Hill Country"];
    if (!hills.best.includes(month) && hills.note) turn.text(hills.note);
  }

  state.profile.month = month;
  state.pendingSlot = null;
  turn.suggest("Plan my trip", "Where to stay", "Talk to the team");
}

function staysSkill(state: AbaState, kb: KnowledgeBase, u: Understanding, pagePlace: Destination | null, turn: Turn, more = false) {
  const place = findDestination(kb, u.places[0]) ?? (u.deictic ? pagePlace : null) ?? (more ? null : findDestination(kb, state.focusPlace));
  const ranked = kb.stays
    .filter((stay) => !state.shown.stays.includes(stay.id))
    .map((stay, index) => ({ stay, index, score: scoreStay(stay, state.profile, kb, place) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 2)
    .map((entry) => entry.stay);

  state.topic = "stays";
  if (!ranked.length) {
    turn.text("That's all the stays on my list for now. Our team knows many more and can match one to your route.");
    turn.action("Browse all stays", routes.stays);
    turn.suggest("Talk to the team", "Plan my trip");
    return;
  }
  state.shown.stays = [...state.shown.stays, ...ranked.map((stay) => stay.id)].slice(-40);
  turn.mood = "excited";
  const nearMatch = place && ranked.some((stay) => normalize(`${stay.location} ${stay.name}`).includes(normalize(place.name)));
  turn.text(
    place && !nearMatch
      ? `I don't have a stay right in ${place.name} on my list, but these are favourites our travellers love.`
      : say(state, "stays:intro", ["Here are a couple of places with real character.", "You might like these.", "Two stays I'd happily recommend:"]),
  );
  turn.cards(ranked.map(stayCard));
  turn.suggest("More stays", "Plan my trip", "Talk to the team");
}

function transportSkill(state: AbaState, kb: KnowledgeBase, turn: Turn, airport = false) {
  const profile = state.profile;
  state.topic = "vehicles";
  if (airport) {
    turn.text(
      "We can arrange a private pickup from Bandaranaike International Airport (CMB). Your chauffeur takes you straight to your first stop. Colombo is roughly an hour away, and Negombo is closer.",
    );
  }
  if (!profile.travellers) {
    turn.text(airport ? "To match the right vehicle, how many of you are travelling?" : "Every trip comes with your own air-conditioned vehicle and English-speaking chauffeur. How many of you are travelling, so I can match the right one?");
    state.pendingSlot = "travellers";
    turn.mood = "curious";
    turn.suggest(...SLOT_CHIPS.travellers);
    return;
  }
  const vehicle = pickVehicle(kb, profile.travellers, profile.budget);
  const others = kb.vehicles
    .filter((item) => item.id !== vehicle?.id && item.passengerCapacity >= (profile.travellers ?? 1))
    .slice(0, 1);
  if (!vehicle) {
    turn.text("I couldn't load the fleet just now, but the team will match a vehicle to your group.");
    offerHandoff(state, kb, turn);
    return;
  }
  turn.mood = "excited";
  turn.text(`For ${profile.travellers === 1 ? "you" : `${profile.travellers} of you`}, I'd suggest the **${vehicle.name}**, with room for ${plural(vehicle.passengerCapacity, "passenger")} and ${plural(vehicle.luggageCapacity, "bag")}.`);
  turn.cards([vehicle, ...others].map(vehicleCard));
  state.shown.vehicles = [...state.shown.vehicles, vehicle.id, ...others.map((item) => item.id)].slice(-40);
  turn.suggest("Plan my trip", "Airport pickup", "Talk to the team");
}

function activitiesSkill(state: AbaState, kb: KnowledgeBase, turn: Turn) {
  const typeFor: Record<string, Interest> = { culture: "heritage", wildlife: "wildlife", scenic: "hills", coastal: "beach", leisure: "wellness", "local life": "food" };
  const ranked = kb.activities
    .filter((activity) => !state.shown.activities.includes(activity.id))
    .map((activity, index) => {
      const interest = typeFor[normalize(activity.type)];
      let score = 0;
      if (interest && state.profile.interests.includes(interest)) score += 5;
      if (interest && state.profile.avoid.includes(interest)) score -= 5;
      return { activity, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 2)
    .map((entry) => entry.activity);
  state.topic = "activities";
  if (!ranked.length) {
    turn.text("Those are all the experiences on my list. Our team can add almost anything else to your route.");
    turn.suggest("Talk to the team", "Plan my trip");
    return;
  }
  state.shown.activities = [...state.shown.activities, ...ranked.map((item) => item.id)];
  turn.mood = "excited";
  turn.text(say(state, "act:intro", ["A few experiences I'd add to your trip:", "These are always a highlight:"]));
  turn.cards(
    ranked.map((activity) => ({
      kind: "activity" as const,
      id: activity.id,
      title: activity.name,
      subtitle: activity.region,
      meta: activity.type,
      image: activity.image || FALLBACK_IMAGE,
      href: routes.activities,
    })),
  );
  turn.suggest("More experiences", "Plan my trip", "Where to stay");
}

function priceSkill(state: AbaState, kb: KnowledgeBase, turn: Turn) {
  turn.mood = "thinking";
  turn.text(
    "Honest answer: every trip is private, so the price depends on your dates, group size, the stays you pick and the vehicle. I'd rather not guess a number that turns out wrong.",
    "Our team sends a clear quote for your exact plan, and there's no payment until you've reviewed it.",
  );
  offerHandoff(state, kb, turn, state.profile.days ? "I can send them what we've discussed so far:" : "Tell me a little about the trip, or ask the team directly:");
  if (!state.profile.days) turn.suggest("Plan my trip", "Talk to the team");
  else turn.suggest("Show me another", "Where to stay");
}

function contactSkill(state: AbaState, kb: KnowledgeBase, turn: Turn, now: Date) {
  const { open, clock } = sriLankaNow(now);
  turn.mood = "warm";
  turn.text(
    say(state, "contact:intro", [
      `Of course${nameTag(state)}! Our planners are real people in Colombo, and they'll take it from here.`,
      "Happy to connect you with the team. They're lovely, and they know every road on the island.",
    ]),
    open
      ? "They're in the office right now, so you should hear back quickly."
      : `It's ${clock} in Sri Lanka, so the office is closed, but they'll reply as soon as they're back (${COMPANY.hours}).`,
  );
  turn.action("Chat with the team on WhatsApp", handoffLink(state, kb), "whatsapp");
  turn.text(`You can also call ${COMPANY.phoneDisplay} or email ${COMPANY.email}.`);
  turn.suggest("Plan my trip", "Contact page");
}

function practicalSkill(state: AbaState, u: Understanding, turn: Turn) {
  const n = u.norm;
  const facts: string[] = [];
  if (/\b(currency|money|cash|atm|card|cards|rupee)\b/.test(n)) facts.push(TRAVEL_FACTS.currency);
  if (/\b(plug|plugs|adapter|socket|voltage)\b/.test(n)) facts.push(TRAVEL_FACTS.plugs);
  if (/\b(sim|internet|wifi|data|phone)\b/.test(n)) facts.push(TRAVEL_FACTS.sim);
  if (/\b(tip|tipping|tips)\b/.test(n)) facts.push(TRAVEL_FACTS.tipping);
  if (/\b(language|languages|english|speak)\b/.test(n)) facts.push(TRAVEL_FACTS.language);
  if (/\b(wear|dress|clothes|clothing)\b/.test(n)) facts.push(TRAVEL_FACTS.dress);
  if (/\b(time zone|timezone|time difference)\b/.test(n)) facts.push(TRAVEL_FACTS.timezone);
  if (/\b(pack|packing|bring)\b/.test(n)) facts.push(TRAVEL_FACTS.packing);
  if (/\b(vaccine|vaccines|vaccination|health|insurance|medical)\b/.test(n)) facts.push(TRAVEL_FACTS.health);
  if (!facts.length) facts.push(TRAVEL_FACTS.currency, TRAVEL_FACTS.plugs);
  turn.mood = "warm";
  turn.text(say(state, "practical:intro", ["Good question.", "Handy to know before you go:", "Here's the practical bit:"]));
  for (const fact of facts.slice(0, 3)) turn.text(fact);
  turn.suggest("Visa", "Best time to go", "Plan my trip");
}

function placeFromPath(kb: KnowledgeBase, path: string | undefined) {
  const match = path?.match(/^\/destinations\/([^/?#]+)/);
  return match ? findDestination(kb, decodeURIComponent(match[1])) : null;
}

function packageFromPath(kb: KnowledgeBase, path: string | undefined) {
  const match = path?.match(/^\/packages\/([^/?#]+)/);
  return match ? kb.packages.find((pkg) => pkg.id === decodeURIComponent(match[1])) ?? null : null;
}

// ─── Main entry ──────────────────────────────────────────────────────────────

export function respond(
  text: string,
  rawState: unknown,
  context: AbaContext,
  kb: KnowledgeBase,
  now: Date = new Date(),
): AbaReply {
  let state = sanitizeState(rawState);
  state.turn += 1;
  const turn = new Turn();

  const u = understand(text, kb.destinations.map((place) => ({ slug: place.slug, name: place.name })));
  const pagePlace = placeFromPath(kb, context.path);
  const pagePackage = packageFromPath(kb, context.path);

  if (u.name && u.name !== state.userName) {
    state.userName = u.name;
    turn.text(say(state, "name", [`Lovely to meet you, ${u.name}!`, `Nice to meet you, ${u.name} 🙏`, `${u.name}, what a lovely name.`]));
  }

  const before: TripProfile = JSON.parse(JSON.stringify(state.profile));
  answerPendingSlot(state, u);
  mergeProfile(state.profile, u);
  for (const slug of u.places) if (!state.profile.places.includes(slug) && (u.intent === "recommend" || u.intent === "addToTrip")) state.profile.places.push(slug);
  if (u.places.length) state.focusPlace = u.places[0];
  const learnedSomething = describeLearned(before, state.profile).length > 0 || state.profile.occasion !== before.occasion;

  let intent = u.intent;
  // "yes"/"no" with real details attached is really an answer, not a yes/no.
  if ((intent === "affirm" || intent === "deny") && learnedSomething) intent = null;
  // "tell me about…" with no recognised place falls back to the page or to planning.
  if (intent === "placeInfo" && !u.places.length && !(u.deictic && (pagePlace || pagePackage))) intent = learnedSomething ? "recommend" : null;

  // A month given in reply to "which month?" in the seasons talk stays on seasons.
  if (intent === null && u.month !== null && state.pendingSlot === "month" && hasSaid(state, "ask:seasonMonth")) {
    state.recent = state.recent.filter((id) => id !== "ask:seasonMonth");
    intent = "season";
  }

  if (intent !== null || learnedSomething) state.confusion = 0;

  switch (intent) {
    case "reset": {
      const userName = state.userName;
      state = createInitialState();
      state.userName = userName;
      state.turn = 1;
      turn.bubbles = [];
      turn.text(say(state, "reset", ["Fresh start! ✨", "Clean slate, let's begin again."]));
      askFor(state, "interests", turn);
      return finish(state, turn);
    }
    case "frustration": {
      turn.mood = "sorry";
      turn.text(
        say(state, "sorry", [
          `I'm sorry${nameTag(state)}, I didn't get that right.`,
          "Ah, I'm sorry about that. I'm still learning.",
        ]),
      );
      const summary = tripSummaryLines(state, kb);
      if (summary.length) turn.text(`Here's what I have so far: ${summary.join("; ")}. Tell me what to change.`);
      offerHandoff(state, kb, turn, "If you'd rather talk to a person, our team is one tap away:");
      turn.suggest("Start over", "Plan my trip");
      return finish(state, turn);
    }
    case "isHuman":
      turn.text(
        "I'm Aba, Aba Ceylon's virtual travel companion, so not a human, but I know the island's roads, seasons and stays well. Whenever you'd like a real person, our Colombo team is one tap away.",
      );
      turn.action("Talk to a real person", handoffLink(state, kb), "whatsapp");
      turn.suggest("Plan my trip", "Best time to go");
      return finish(state, turn);
    case "whoAreYou":
      turn.text(
        "I'm **Aba**, the travel companion at Aba Ceylon Tours & Travels. I help you shape a Sri Lanka trip: where to go, when to go, where to stay and how to get around. Then I hand everything to our local planners.",
      );
      turn.suggest("Plan my trip", "What can you do?");
      return finish(state, turn);
    case "howAreYou":
      turn.text(
        say(state, "howAreYou", [
          "I'm wonderful, thank you for asking! Always happy when someone's dreaming of Sri Lanka. How about you?",
          "Doing great, thanks! Ready to help you plan something special. What's on your mind?",
        ]),
      );
      turn.suggest(...START_CHIPS);
      return finish(state, turn);
    case "capabilities":
      turn.text(
        "Here's how I can help:",
        "🗺️ suggest a route for your days and interests ·",
        "🏛️ tell you about any destination ·",
        "🌦️ explain the best time to go ·",
        "🏨 match stays and 🚐 vehicles ·",
        "💬 send your plan to our team on WhatsApp.",
      );
      turn.suggest("Plan my trip", "Best time to go", "Where to stay", "Talk to the team");
      return finish(state, turn);
    case "thanks":
      turn.text(
        say(state, "thanks", [
          `Istuti, my pleasure${nameTag(state)}! 🙏`,
          "Kamak naha, no trouble at all!",
          "You're very welcome. Anything else I can help with?",
        ]),
      );
      turn.suggest("Plan my trip", "Talk to the team");
      return finish(state, turn);
    case "bye":
      turn.text(
        say(state, "bye", [
          `Suba gaman${nameTag(state)}! (That's Sinhala for "have a good journey".) I'm here whenever you need me.`,
          "Bye for now! Come back any time, and I'll remember where we left off.",
        ]),
      );
      return finish(state, turn);
    case "compliment":
      turn.text(say(state, "compliment", ["Aww, thank you! 😊", "That made my day, thank you!"]));
      if (!learnedSomething) {
        turn.suggest("Plan my trip", "Talk to the team");
        return finish(state, turn);
      }
      break;
    case "greet":
      if (!learnedSomething) {
        const known = state.profile.interests.length || state.profile.days || state.profile.places.length;
        const greetedBefore = hasSaid(state, "greeted");
        remember(state, "greeted");
        turn.text(
          known
            ? `Welcome back${nameTag(state)}! Shall we pick up where we left off?`
            : greetedBefore
            ? say(state, "greet:again", [`Hello again${nameTag(state)}! 😊`, "Hi there, still here!"])
            : `${timeGreeting(context.hour)}${nameTag(state)}! Ayubowan 🙏 I'm Aba, your Sri Lanka travel companion.`,
        );
        if (known) turn.suggest("Show me another", "Talk to the team", "Start over");
        else askFor(state, "interests", turn);
        return finish(state, turn);
      }
      // One warm line instead of separate "nice to meet you" and "hello" lines.
      turn.bubbles = [];
      turn.text(`${timeGreeting(context.hour)}${nameTag(state)}! Ayubowan 🙏${u.name ? " Lovely to meet you." : ""}`);
      break;
    case "visa":
      turn.mood = "thinking";
      turn.text(TRAVEL_FACTS.visa);
      turn.suggest("Is it safe?", "Best time to go", "Plan my trip");
      return finish(state, turn);
    case "safety":
      turn.text(TRAVEL_FACTS.safety);
      turn.suggest("Visa", "Best time to go", "Plan my trip");
      return finish(state, turn);
    case "practical":
      practicalSkill(state, u, turn);
      return finish(state, turn);
    case "price":
      acknowledge(state, before, turn);
      priceSkill(state, kb, turn);
      return finish(state, turn);
    case "season":
      seasonAdvice(state, kb, u, pagePlace, turn);
      return finish(state, turn);
    case "contact":
      if (/\bcontact page\b/.test(u.norm)) {
        turn.text("Here you go.");
        turn.action("Open the contact page", routes.contact);
        return finish(state, turn);
      }
      acknowledge(state, before, turn);
      contactSkill(state, kb, turn, now);
      return finish(state, turn);
    case "airport":
      acknowledge(state, before, turn);
      transportSkill(state, kb, turn, true);
      return finish(state, turn);
    case "transport":
      acknowledge(state, before, turn);
      transportSkill(state, kb, turn);
      return finish(state, turn);
    case "stays":
      acknowledge(state, before, turn);
      staysSkill(state, kb, u, pagePlace, turn, /\b(more|another|other)\b/.test(u.norm));
      return finish(state, turn);
    case "activities":
      activitiesSkill(state, kb, turn);
      return finish(state, turn);
    case "addToTrip":
      addToTrip(state, kb, u, pagePlace, turn);
      return finish(state, turn);
    case "placeInfo": {
      const place = findDestination(kb, u.places[0]) ?? pagePlace;
      if (place) {
        placeGuide(state, kb, place, turn);
      } else if (pagePackage) {
        turn.text(`**${pagePackage.title}**: ${pagePackage.summary}`, `It covers ${joinList(pagePackage.route)} over ${pagePackage.duration.toLowerCase()}.`);
        turn.cards([packageCard(pagePackage)]);
        turn.suggest("Show me another", "Talk to the team");
      }
      return finish(state, turn);
    }
    case "more":
      if (state.topic === "stays") staysSkill(state, kb, u, pagePlace, turn, true);
      else if (state.topic === "activities") activitiesSkill(state, kb, turn);
      else if (state.topic === "destinations" || /\bplace\b/.test(u.norm)) {
        const next = kb.destinations.find(
          (place) =>
            !state.shown.destinations.includes(place.slug) &&
            (state.profile.interests.length === 0 ||
              state.profile.interests.some((interest) => INTEREST_WORDS[interest].some((word) => normalize(`${place.category} ${place.region} ${place.name}`).includes(word)))),
        );
        if (next) placeGuide(state, kb, next, turn);
        else recommend(state, kb, turn, { more: true });
      } else {
        acknowledge(state, before, turn);
        recommend(state, kb, turn, { more: true });
      }
      return finish(state, turn);
    case "deny":
      state.pendingSlot = null;
      turn.text(say(state, "deny", ["No problem at all.", "That's fine!", "Sure, no worries."]), "What would you like to do instead?");
      turn.suggest("Plan my trip", "Best time to go", "Talk to the team");
      return finish(state, turn);
    case "affirm":
      recommend(state, kb, turn);
      return finish(state, turn);
    default:
      break;
  }

  // Just introduced themselves: carry on naturally.
  if (intent === null && u.name && !learnedSomething) {
    if (nextMissingSlot(state) === "interests") askFor(state, "interests", turn);
    else recommend(state, kb, turn);
    return finish(state, turn);
  }

  // Planning: the traveller told us something about the trip.
  if (intent === "recommend" || learnedSomething || (intent === null && u.places.length)) {
    acknowledge(state, before, turn);
    if (u.places.length && intent !== "recommend" && !learnedSomething) {
      const place = findDestination(kb, u.places[0]);
      if (place) placeGuide(state, kb, place, turn);
    } else {
      recommend(state, kb, turn);
    }
    return finish(state, turn);
  }

  // Couldn't understand. Be honest and helpful, and offer a human sooner the second time.
  state.confusion += 1;
  turn.mood = "sorry";
  turn.text(
    u.gibberish
      ? say(state, "confused:gibberish", ["Hmm, I think that one got a little scrambled 🙂", "Oops, I couldn't read that one."])
      : say(state, "confused", [
          `Hmm, I'm not sure I understood that${nameTag(state)}.`,
          "I didn't quite catch that, sorry.",
          "That one's beyond me, I'm afraid.",
        ]),
    "I'm best with trip ideas, places, seasons, stays, transport and prices.",
  );
  if (state.confusion >= 2) {
    offerHandoff(state, kb, turn, "Or ask our team directly. They can answer anything:");
  }
  turn.suggest("Plan my trip", "Best time to go", "Where to stay", "Talk to the team");
  return finish(state, turn);
}

function finish(state: AbaState, turn: Turn): AbaReply {
  if (!turn.bubbles.length) {
    turn.text("Tell me a little about your trip and I'll take it from there.");
    turn.suggest(...START_CHIPS);
  }
  if (!turn.chips.length) turn.suggest(...START_CHIPS);
  // Keep replies digestible, but never drop the hand-off button.
  const bubbles = turn.bubbles.length > 9
    ? [...turn.bubbles.filter((bubble) => bubble.type !== "action").slice(0, 8), ...turn.bubbles.filter((bubble) => bubble.type === "action").slice(0, 1)]
    : turn.bubbles;
  return { bubbles, suggestions: turn.chips.slice(0, 4), state, mood: turn.mood };
}

/** First message when the chat opens, tuned to the page you're on. */
export function welcome(context: AbaContext, kb?: KnowledgeBase): AbaReply {
  const state = createInitialState();
  const turn = new Turn();
  turn.text(`${timeGreeting(context.hour)}! Ayubowan 🙏 I'm **Aba**, your Sri Lanka travel companion.`);
  const path = context.path ?? "/";
  const place = kb ? placeFromPath(kb, path) : null;
  if (place) {
    state.focusPlace = place.slug;
    turn.text(`I see you're looking at **${place.name}**. Want the best time to go, or shall I add it to your trip?`);
    turn.suggest(`Add ${place.name} to my trip`, "Best time to go", `Stays near ${place.name}`, "Plan my trip");
  } else if (path.startsWith(routes.packages)) {
    turn.text("Tell me your days and interests and I'll point you to the journey that fits best.");
    turn.suggest("Plan my trip", "1 week", "Beaches", "Wildlife");
  } else if (path.startsWith(routes.stays)) {
    turn.text("Looking for somewhere special to stay? Tell me where you're heading.");
    turn.suggest("Where to stay", "Luxury stays", "Plan my trip");
  } else if (path.startsWith(routes.fleet)) {
    turn.text("Need a vehicle? Tell me how many of you are travelling and I'll match one.");
    turn.suggest(...SLOT_CHIPS.travellers);
    state.pendingSlot = "travellers";
  } else {
    turn.text("Tell me what kind of trip you're dreaming of, and I'll help you shape it.");
    turn.suggest(...START_CHIPS);
  }
  return { bubbles: turn.bubbles, suggestions: turn.chips, state, mood: "warm" };
}
