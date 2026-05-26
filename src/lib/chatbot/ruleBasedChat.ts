import type { Destination } from "@/types/destination";
import type { PackageItem } from "@/types/package";
import type { FleetVehicle } from "@/types/vehicle";
import { fetchChatKnowledge } from "./fetchChatKnowledge";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type BudgetLevel = "budget" | "midrange" | "luxury";
type ChatIntent =
  | "greeting"
  | "best-places"
  | "beaches"
  | "budget"
  | "season"
  | "destination"
  | "vehicle"
  | "booking"
  | "trip-planning"
  | "fallback";

type Interest =
  | "beach"
  | "wildlife"
  | "culture"
  | "nature"
  | "mountains"
  | "city"
  | "adventure"
  | "luxury"
  | "family";

interface TravelerProfile {
  allUserText: string;
  latestUserText: string;
  dayCount: number | null;
  groupSize: number | null;
  budget: BudgetLevel | null;
  interests: Interest[];
  destinations: Destination[];
}

const WORD_NUMBERS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
};

const INTEREST_KEYWORDS: Array<{ interest: Interest; keywords: string[] }> = [
  { interest: "beach", keywords: ["beach", "beaches", "coast", "coastal", "island", "sea", "swim"] },
  { interest: "wildlife", keywords: ["wildlife", "safari", "leopard", "elephant", "park", "nature reserve"] },
  { interest: "culture", keywords: ["culture", "cultural", "history", "heritage", "ancient", "temple", "ruins"] },
  { interest: "nature", keywords: ["forest", "waterfall", "scenery", "views", "greenery", "tea estate"] },
  { interest: "mountains", keywords: ["mountain", "mountains", "hill", "hills", "train", "ella", "nuwara eliya"] },
  { interest: "city", keywords: ["city", "shopping", "food", "market", "colombo", "nightlife"] },
  { interest: "adventure", keywords: ["adventure", "surf", "hike", "trek", "climb", "rafting", "kitesurfing"] },
  { interest: "luxury", keywords: ["luxury", "premium", "honeymoon", "romantic", "boutique"] },
  { interest: "family", keywords: ["family", "kids", "children", "child friendly"] },
];

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(normalizeText(keyword)));
}

function uniqByName(destinations: Destination[]): Destination[] {
  const seen = new Set<string>();

  return destinations.filter((destination) => {
    const key = destination.name.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function readNumberToken(token: string): number | null {
  if (/^\d+$/.test(token)) {
    return Number(token);
  }

  return WORD_NUMBERS[token] ?? null;
}

function extractLastDuration(messages: string[]): number | null {
  const durationPattern =
    /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(day|days|night|nights|week|weeks)\b/g;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const normalized = normalizeText(messages[index]);
    const matches = Array.from(normalized.matchAll(durationPattern));

    if (!matches.length) {
      if (normalized.includes("weekend")) {
        return 3;
      }
      continue;
    }

    const lastMatch = matches[matches.length - 1];
    const count = readNumberToken(lastMatch[1]);
    const unit = lastMatch[2];

    if (!count) {
      continue;
    }

    if (unit.startsWith("week")) {
      return count * 7;
    }

    if (unit.startsWith("night")) {
      return count + 1;
    }

    return count;
  }

  return null;
}

function extractLastGroupSize(messages: string[]): number | null {
  const groupPattern =
    /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(people|person|traveler|travelers|traveller|travellers|adult|adults|guest|guests|pax)\b/g;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const normalized = normalizeText(messages[index]);
    const matches = Array.from(normalized.matchAll(groupPattern));

    if (matches.length) {
      const count = readNumberToken(matches[matches.length - 1][1]);
      if (count) {
        return count;
      }
    }

    const familyMatch = normalized.match(/\bfamily of (\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b/);
    if (familyMatch) {
      const count = readNumberToken(familyMatch[1]);
      if (count) {
        return count;
      }
    }

    if (normalized.includes("solo")) {
      return 1;
    }

    if (normalized.includes("couple") || normalized.includes("honeymoon")) {
      return 2;
    }
  }

  return null;
}

function extractLastBudget(messages: string[]): BudgetLevel | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const normalized = normalizeText(messages[index]);

    if (containsAny(normalized, ["luxury", "premium", "high end", "honeymoon", "boutique"])) {
      return "luxury";
    }

    if (containsAny(normalized, ["budget", "cheap", "affordable", "low cost", "backpacker"])) {
      return "budget";
    }

    if (containsAny(normalized, ["mid range", "midrange", "moderate"])) {
      return "midrange";
    }
  }

  return null;
}

function extractInterests(allUserText: string): Interest[] {
  const normalized = normalizeText(allUserText);

  return INTEREST_KEYWORDS.filter(({ keywords }) => containsAny(normalized, keywords)).map(
    ({ interest }) => interest,
  );
}

function extractDestinations(allUserText: string, destinations: Destination[]): Destination[] {
  const normalized = normalizeText(allUserText);
  const matches = destinations.filter((destination) =>
    normalized.includes(normalizeText(destination.name)),
  );

  return uniqByName(matches);
}

function buildTravelerProfile(messages: ChatMessage[], destinations: Destination[]): TravelerProfile {
  const userMessages = messages.filter((message) => message.role === "user").map((message) => message.content);
  const latestUserText = userMessages[userMessages.length - 1]?.trim() ?? "";
  const allUserText = userMessages.join(" ");

  return {
    allUserText,
    latestUserText,
    dayCount: extractLastDuration(userMessages),
    groupSize: extractLastGroupSize(userMessages),
    budget: extractLastBudget(userMessages),
    interests: extractInterests(allUserText),
    destinations: extractDestinations(allUserText, destinations),
  };
}

function detectIntent(profile: TravelerProfile): ChatIntent {
  const latest = normalizeText(profile.latestUserText);

  if (!latest) {
    return "greeting";
  }

  if (containsAny(latest, ["book", "booking", "reserve", "reservation", "contact", "whatsapp", "email", "phone number"])) {
    return "booking";
  }

  if (containsAny(latest, ["vehicle", "car", "van", "suv", "sedan", "driver", "chauffeur", "transport", "transfer", "fleet"])) {
    return "vehicle";
  }

  if (containsAny(latest, ["weather", "season", "monsoon", "best time", "when should i visit"])) {
    return "season";
  }

  if (containsAny(latest, ["best beach", "best beaches", "beach"])) {
    return "beaches";
  }

  if (containsAny(latest, ["budget", "affordable", "cheap", "save money", "cost"])) {
    return "budget";
  }

  if (
    containsAny(latest, ["best places", "where should i go", "top places", "must visit"]) ||
    (containsAny(latest, ["place", "places"]) && profile.destinations.length === 0)
  ) {
    return "best-places";
  }

  if (profile.destinations.length > 0 && containsAny(latest, ["tell me about", "about", "visit", "go to", "know about"])) {
    return "destination";
  }

  if (
    containsAny(latest, ["trip", "itinerary", "plan", "package", "tour"]) ||
    profile.dayCount !== null ||
    profile.groupSize !== null ||
    profile.interests.length > 0 ||
    profile.destinations.length > 0
  ) {
    return "trip-planning";
  }

  if (containsAny(latest, ["hi", "hello", "hey", "good morning", "good evening"])) {
    return "greeting";
  }

  return "fallback";
}

function formatDestinationList(destinations: Destination[]): string {
  return destinations.map((destination) => destination.name).join(", ");
}

function getNamedDestinations(allDestinations: Destination[], names: string[]): Destination[] {
  return names
    .map((name) => allDestinations.find((destination) => destination.name === name))
    .filter((destination): destination is Destination => Boolean(destination));
}

function bestPlacesByInterest(profile: TravelerProfile, allDestinations: Destination[]): Destination[] {
  if (profile.interests.includes("beach")) {
    return getNamedDestinations(allDestinations, ["Mirissa", "Unawatuna", "Nilaveli", "Arugam Bay"]);
  }

  if (profile.interests.includes("wildlife")) {
    return getNamedDestinations(allDestinations, ["Yala Safari", "Wilpattu National Park", "Udawalawe National Park", "Kalpitiya"]);
  }

  if (profile.interests.includes("culture")) {
    return getNamedDestinations(allDestinations, ["Sigiriya", "Anuradhapura", "Polonnaruwa", "Kandy"]);
  }

  if (profile.interests.includes("mountains") || profile.interests.includes("nature")) {
    return getNamedDestinations(allDestinations, ["Kandy", "Nuwara Eliya", "Ella", "Horton Plains"]);
  }

  return getNamedDestinations(allDestinations, ["Sigiriya", "Kandy", "Ella", "Galle"]);
}

function buildBestPlacesResponse(profile: TravelerProfile, allDestinations: Destination[]): string {
  const picks = bestPlacesByInterest(profile, allDestinations).slice(0, 4);
  const opener =
    profile.interests.length > 0
      ? `Based on what you like, I’d shortlist ${formatDestinationList(picks)}.`
      : `If you want a well-rounded Sri Lanka trip, I’d start with ${formatDestinationList(picks)}.`;

  const detail = picks
    .slice(0, 2)
    .map((destination) => `${destination.name} is great for ${destination.summary.toLowerCase()}.`)
    .join(" ");

  return `${opener} ${detail} Share how many days you have, and I’ll help turn that into a route that flows nicely.`;
}

function buildBeachesResponse(allDestinations: Destination[]): string {
  const beaches = getNamedDestinations(allDestinations, [
    "Mirissa",
    "Unawatuna",
    "Nilaveli",
    "Arugam Bay",
  ]);

  return `For beaches, I’d start with ${formatDestinationList(beaches)}. Mirissa and Unawatuna are lovely for an easy south-coast stay, Nilaveli is great if you want calmer east-coast water, and Arugam Bay is the best fit for surf. Tell me how many days you have and whether you want a relaxed beach break, surfing, or a beach plus safari mix.`;
}

function buildBudgetResponse(profile: TravelerProfile): string {
  const transportTip =
    profile.groupSize && profile.groupSize <= 3
      ? "For your group size, a sedan is usually the most cost-friendly private option."
      : "Smaller groups usually save most with a sedan, while larger groups often get better value from one van instead of multiple cars.";

  return `If you want to keep costs down, it usually helps to stay focused on one region, avoid too many one-night stops, and travel in shoulder season when you can. ${transportTip} If you share your days, group size, and whether you prefer beach, culture, or wildlife, I can suggest a more budget-friendly route.`;
}

function buildSeasonResponse(profile: TravelerProfile): string {
  if (profile.destinations.some((destination) => ["Mirissa", "Unawatuna", "Bentota", "Galle"].includes(destination.name))) {
    return `For the south and west coast, the most reliable beach season is usually December to April. If you are open to the east coast instead, places like Nilaveli and Arugam Bay are usually better from May to September. Tell me which coast you prefer and I’ll help narrow it down.`;
  }

  if (profile.destinations.some((destination) => ["Arugam Bay", "Nilaveli", "Trincomalee"].includes(destination.name))) {
    return `For the east coast, the best beach window is usually May to September. The south and west coast are usually better from December to April. If you tell me your month and trip style, I can point you to the best side of the island.`;
  }

  return `A simple Sri Lanka rule is south and west coast from December to April, and east coast from May to September. The cultural triangle works well through much of the year, while safari timing depends more on the park and rainfall. Tell me when you want to travel and I’ll match the route to the season.`;
}

function buildDestinationResponse(profile: TravelerProfile): string {
  const destination = profile.destinations[profile.destinations.length - 1];

  if (!destination) {
    return "Tell me the destination you have in mind, and I’ll share the best time to visit, the highlights, and how it fits into a route.";
  }

  const highlights = destination.highlights.slice(0, 3).join(", ");
  return `${destination.name} is ${destination.summary.toLowerCase()}. Some of the main highlights are ${highlights}, and the best time to visit is ${destination.bestTimeToVisit}. If you want, I can also suggest a route or package that includes ${destination.name}.`;
}

function parsePackageDays(pkg: PackageItem): number {
  const match = pkg.duration.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function scorePackage(pkg: PackageItem, profile: TravelerProfile): number {
  let score = 0;
  const text = normalizeText(`${pkg.title} ${pkg.summary} ${pkg.overview} ${pkg.route.join(" ")}`);

  if (profile.dayCount !== null) {
    const difference = Math.abs(parsePackageDays(pkg) - profile.dayCount);
    score += Math.max(0, 6 - difference * 2);
  }

  for (const destination of profile.destinations) {
    if (text.includes(normalizeText(destination.name))) {
      score += 5;
    }
  }

  if (profile.interests.includes("beach") && containsAny(text, ["beach", "coast", "mirissa", "galle"])) {
    score += 4;
  }
  if (profile.interests.includes("wildlife") && containsAny(text, ["wildlife", "safari", "yala"])) {
    score += 4;
  }
  if (profile.interests.includes("culture") && containsAny(text, ["heritage", "ancient", "sigiriya", "anuradhapura", "polonnaruwa"])) {
    score += 4;
  }
  if ((profile.interests.includes("mountains") || profile.interests.includes("nature")) && containsAny(text, ["ella", "kandy", "nuwara eliya", "hill country", "tea"])) {
    score += 4;
  }
  if (profile.budget === "luxury" && containsAny(text, ["boutique", "private"])) {
    score += 1;
  }

  return score;
}

function pickTopPackages(packages: PackageItem[], profile: TravelerProfile): PackageItem[] {
  const ranked = [...packages]
    .map((pkg) => ({ pkg, score: scorePackage(pkg, profile) }))
    .sort((left, right) => right.score - left.score)
    .map(({ pkg }) => pkg);

  return ranked.slice(0, 2);
}

function buildSevenDayRoute(profile: TravelerProfile, allDestinations: Destination[]): string {
  const cultureRoute = getNamedDestinations(allDestinations, [
    "Sigiriya",
    "Anuradhapura",
    "Polonnaruwa",
    "Kandy",
    "Nuwara Eliya",
    "Ella",
    "Galle",
  ]);
  const coastRoute = getNamedDestinations(allDestinations, [
    "Negombo",
    "Yala Safari",
    "Mirissa",
    "Unawatuna",
    "Galle",
    "Bentota",
    "Colombo",
  ]);
  const hillRoute = getNamedDestinations(allDestinations, [
    "Kandy",
    "Nuwara Eliya",
    "Ella",
    "Horton Plains",
    "Galle",
    "Bentota",
    "Colombo",
  ]);

  const chosenRoute = profile.interests.includes("culture")
    ? cultureRoute
    : profile.interests.includes("beach") || profile.interests.includes("wildlife")
      ? coastRoute
      : hillRoute;

  return chosenRoute.map((destination) => destination.name).join(" -> ");
}

function chooseVehicle(vehicles: FleetVehicle[], groupSize: number | null): FleetVehicle | null {
  const availableVehicles = vehicles.filter(
    (vehicle) => !normalizeText(vehicle.availabilityStatus).includes("unavailable"),
  );

  const source = availableVehicles.length ? availableVehicles : vehicles;

  if (!source.length) {
    return null;
  }

  if (groupSize === null) {
    return [...source].sort((left, right) => left.passengerCapacity - right.passengerCapacity)[0];
  }

  const directMatch = [...source]
    .filter((vehicle) => vehicle.passengerCapacity >= groupSize)
    .sort((left, right) => left.passengerCapacity - right.passengerCapacity)[0];

  if (directMatch) {
    return directMatch;
  }

  return [...source].sort((left, right) => right.passengerCapacity - left.passengerCapacity)[0];
}

function buildVehicleResponse(profile: TravelerProfile, vehicles: FleetVehicle[]): string {
  if (profile.groupSize === null) {
    return "I can help match the right vehicle. Just tell me how many people are travelling and whether you prefer something like a sedan, SUV, or van.";
  }

  const vehicle = chooseVehicle(vehicles, profile.groupSize);

  if (!vehicle) {
    return "I could not find a clear vehicle match right now. If you share your group size and route with the team through the contact page, they can confirm the best transport option for you.";
  }

  const routeHint = profile.destinations.length
    ? ` For a route around ${formatDestinationList(profile.destinations.slice(0, 3))}, that size is a sensible fit.`
    : "";

  return `For ${profile.groupSize} travellers, I’d start with the ${vehicle.name}. It seats up to ${vehicle.passengerCapacity} passengers and is a nice fit for ${vehicle.shortDescription.toLowerCase()}${routeHint} If you want, I can also suggest a package that pairs well with it.`;
}

function buildTripPlanningResponse(
  profile: TravelerProfile,
  packages: PackageItem[],
  vehicles: FleetVehicle[],
  allDestinations: Destination[],
): string {
  const topPackages = pickTopPackages(packages, profile);
  const vehicle = chooseVehicle(vehicles, profile.groupSize);

  if (profile.dayCount === 7) {
    const route = buildSevenDayRoute(profile, allDestinations);
    const packageHint = topPackages[0]
      ? ` A ready-made package that fits nicely is ${topPackages[0].title}.`
      : "";
    const vehicleHint =
      vehicle && profile.groupSize !== null
        ? ` For ${profile.groupSize} travellers, I’d pair that with the ${vehicle.name}.`
        : "";

    return `A lovely 7-day route would be ${route}.${packageHint}${vehicleHint} If you want, I can shape it more toward culture, beaches, wildlife, or the hill country.`;
  }

  const packageLine = topPackages.length
    ? `A strong package option is ${topPackages[0].title} (${topPackages[0].duration}), and another good match is ${topPackages[1]?.title ?? topPackages[0].title}.`
    : "I can help shape a custom route, but I need one starting point like your destination, number of days, or trip style.";

  const routeLine =
    profile.destinations.length > 0
      ? ` Right now, your route is pointing toward ${formatDestinationList(profile.destinations.slice(0, 3))}.`
      : "";

  const vehicleLine =
    vehicle && profile.groupSize !== null
      ? ` For ${profile.groupSize} travellers, I’d pair that with the ${vehicle.name}.`
      : profile.groupSize === null
        ? " If you tell me your group size, I can also add the right vehicle."
        : "";

  return `${packageLine}${routeLine}${vehicleLine} If you want me to narrow it down properly, send your exact days and whether you prefer beach, wildlife, culture, or hills.`;
}

function buildBookingResponse(profile: TravelerProfile): string {
  const summaryParts = [
    profile.dayCount ? `${profile.dayCount} days` : null,
    profile.groupSize ? `${profile.groupSize} travellers` : null,
    profile.destinations.length ? formatDestinationList(profile.destinations.slice(0, 3)) : null,
  ].filter(Boolean);

  const summary = summaryParts.length
    ? `So far I’ve got ${summaryParts.join(", ")}. `
    : "";

  return `${summary}The next step is to send your enquiry through the contact page, or through the package and fleet pages if you already know what you want. If you like, share your route, trip length, and group size first and I’ll help tighten the package and vehicle recommendation before you book.`;
}

function buildGreetingResponse(): string {
  return "I’d be happy to help with Sri Lanka trip ideas, routes, packages, beaches, vehicles, budget tips, and booking guidance. Tell me where you want to go, how many days you have, or the kind of trip you’re in the mood for.";
}

function buildFallbackResponse(): string {
  return "I can help you plan a Sri Lanka trip with destination ideas, beach picks, route suggestions, packages, vehicle options, budget tips, and booking guidance. Tell me the kind of trip you want, or share your days and group size, and I’ll suggest what fits best.";
}

export async function buildRuleBasedChatResponse(messages: ChatMessage[]): Promise<string> {
  const knowledge = await fetchChatKnowledge();
  const profile = buildTravelerProfile(messages, knowledge.destinations);
  const intent = detectIntent(profile);

  switch (intent) {
    case "greeting":
      return buildGreetingResponse();
    case "best-places":
      return buildBestPlacesResponse(profile, knowledge.destinations);
    case "beaches":
      return buildBeachesResponse(knowledge.destinations);
    case "budget":
      return buildBudgetResponse(profile);
    case "season":
      return buildSeasonResponse(profile);
    case "destination":
      return buildDestinationResponse(profile);
    case "vehicle":
      return buildVehicleResponse(profile, knowledge.vehicles);
    case "booking":
      return buildBookingResponse(profile);
    case "trip-planning":
      return buildTripPlanningResponse(
        profile,
        knowledge.packages,
        knowledge.vehicles,
        knowledge.destinations,
      );
    default:
      return buildFallbackResponse();
  }
}
