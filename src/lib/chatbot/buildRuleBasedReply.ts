import { fetchAllVehicles } from "@/services/fleetService";
import { fetchPackages } from "@/services/packageService";
import type { PackageItem } from "@/types/package";
import type { FleetVehicle } from "@/types/vehicle";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatReply {
  message: string;
  suggestions: string[];
}

interface TravelerProfile {
  days: number | null;
  groupSize: number | null;
  interests: string[];
}

const GREETING_PATTERN = /\b(hi|hello|hey|ayubowan|good morning|good evening)\b/i;
const THANKS_PATTERN = /\b(thanks|thank you|appreciate it)\b/i;
const CONTACT_PATTERN =
  /\b(book|booking|reserve|reservation|contact|whatsapp|call|email)\b/i;
const SEASON_PATTERN =
  /\b(weather|season|monsoon|rain|rainy|best time|when to visit)\b/i;
const BUDGET_PATTERN = /\b(budget|cheap|affordable|save money|low cost)\b/i;
const TRANSPORT_PATTERN =
  /\b(vehicle|vehicles|transport|car|van|suv|sedan|driver|chauffeur|fleet|airport transfer)\b/i;
const BEACH_PATTERN =
  /\b(beach|beaches|coast|coastal|mirissa|galle|unawatuna|bentota|trincomalee|arugam)\b/i;
const WILDLIFE_PATTERN =
  /\b(wildlife|safari|yala|leopard|elephant|whale|nature)\b/i;
const CULTURE_PATTERN =
  /\b(culture|cultural|heritage|history|historical|temple|ancient|sigiriya|anuradhapura|polonnaruwa|kandy)\b/i;
const HILL_PATTERN =
  /\b(hill|hills|hill country|mountain|mountains|tea|train|ella|nuwara eliya)\b/i;
const NORTH_PATTERN = /\b(north|northern|jaffna|mannar|vavuniya)\b/i;
const BEST_PLACES_PATTERN =
  /\b(best places|where should i go|where to go|top places|must visit)\b/i;
const PLAN_PATTERN =
  /\b(plan|planning|itinerary|trip|travel plan|vacation|holiday|package|route)\b/i;

const DEFAULT_SUGGESTIONS = [
  "Beaches",
  "Wildlife",
  "Hill country",
  "Heritage",
];

const SUGGESTION_CANONICAL_MAP: Record<string, string> = {
  "show package": "show me a package",
  "match me a package": "show me a package",
  "another package": "show me another package",
  "show another route": "show me another route",
  "luxury option": "luxury transport",
  "luxury transport": "luxury transport",
  "need help planning": "plan my trip",
  "i have exact dates": "best time travel dates",
  "december to april": "best time december to april",
  "may to september": "best time may to september",
  "west coast dec apr": "best time december to april",
  "east coast may sep": "best time may to september",
};

function reply(message: string, suggestions: string[]): ChatReply {
  return {
    message,
    suggestions: suggestions.slice(0, 4),
  };
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^\w\s]/g, " ");
}

function canonicalizeLatestMessage(text: string) {
  const normalized = normalize(text).replace(/\s+/g, " ").trim();
  return SUGGESTION_CANONICAL_MAP[normalized] ?? normalized;
}

function extractDays(text: string) {
  const normalized = normalize(text);
  const numericMatch = normalized.match(/(\d+)\s*(day|days|night|nights)\b/);

  if (numericMatch) {
    return Number(numericMatch[1]);
  }

  if (/\bone week\b/.test(normalized)) {
    return 7;
  }

  if (/\bweekend\b/.test(normalized)) {
    return 2;
  }

  return null;
}

function extractGroupSize(text: string) {
  const normalized = normalize(text);
  const numericMatch = normalized.match(
    /(\d+)\s*(people|persons|travellers|travelers|adults|guests|members|pax)\b/,
  );

  if (numericMatch) {
    return Number(numericMatch[1]);
  }

  if (/\bcouple\b/.test(normalized)) {
    return 2;
  }

  if (/\bfamily\b/.test(normalized)) {
    return 4;
  }

  if (/\bsolo\b/.test(normalized)) {
    return 1;
  }

  return null;
}

function isGreeting(text: string) {
  return GREETING_PATTERN.test(text);
}

function isThanks(text: string) {
  return THANKS_PATTERN.test(text);
}

function toSentenceList(items: string[]) {
  if (items.length === 0) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function detectInterests(text: string) {
  const interests: string[] = [];

  if (BEACH_PATTERN.test(text)) {
    interests.push("beaches");
  }

  if (WILDLIFE_PATTERN.test(text)) {
    interests.push("wildlife");
  }

  if (CULTURE_PATTERN.test(text)) {
    interests.push("heritage");
  }

  if (HILL_PATTERN.test(text)) {
    interests.push("hill country");
  }

  if (NORTH_PATTERN.test(text)) {
    interests.push("north");
  }

  return interests;
}

function buildTravelerProfile(userMessages: string[]): TravelerProfile {
  const fullText = userMessages.join(" ");
  return {
    days: extractDays(fullText),
    groupSize: extractGroupSize(fullText),
    interests: detectInterests(normalize(fullText)),
  };
}

function scorePackage(pkg: PackageItem, context: string, days: number | null) {
  const corpus = normalize(
    [
      pkg.title,
      pkg.summary,
      pkg.overview,
      pkg.duration,
      ...pkg.route,
      ...(pkg.includedServices ?? []),
    ].join(" "),
  );

  let score = 0;

  for (const word of context.split(/\s+/).filter(Boolean)) {
    if (word.length > 2 && corpus.includes(word)) {
      score += 2;
    }
  }

  if (BEACH_PATTERN.test(context) && /(mirissa|galle|matara|coast|beach)/.test(corpus)) {
    score += 7;
  }

  if (WILDLIFE_PATTERN.test(context) && /(yala|wildlife|safari|whale)/.test(corpus)) {
    score += 7;
  }

  if (CULTURE_PATTERN.test(context) && /(sigiriya|anuradhapura|polonnaruwa|cultural|ancient|temple)/.test(corpus)) {
    score += 7;
  }

  if (HILL_PATTERN.test(context) && /(kandy|nuwara eliya|ella|hill|tea|train)/.test(corpus)) {
    score += 7;
  }

  if (NORTH_PATTERN.test(context) && /(jaffna|mannar|vavuniya|north)/.test(corpus)) {
    score += 7;
  }

  if (days !== null) {
    const packageDays = extractDays(pkg.duration);
    if (packageDays !== null) {
      score += Math.max(0, 6 - Math.abs(packageDays - days) * 2);
    }
  }

  return score;
}

function pickPackages(packages: PackageItem[], context: string, days: number | null) {
  return [...packages]
    .map((pkg, index) => ({
      pkg,
      index,
      score: scorePackage(pkg, context, days),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.pkg);
}

function pickVehicle(vehicles: FleetVehicle[], groupSize: number | null) {
  const available = vehicles.filter((vehicle) =>
    vehicle.availabilityStatus.toLowerCase() !== "unavailable",
  );

  if (!available.length) {
    return null;
  }

  if (groupSize === null) {
    return [...available].sort(
      (a, b) => a.passengerCapacity - b.passengerCapacity,
    )[0];
  }

  const fittingVehicle = [...available]
    .filter((vehicle) => vehicle.passengerCapacity >= groupSize)
    .sort((a, b) => a.passengerCapacity - b.passengerCapacity)[0];

  if (fittingVehicle) {
    return fittingVehicle;
  }

  return [...available].sort(
    (a, b) => b.passengerCapacity - a.passengerCapacity,
  )[0];
}

function buildVehicleLine(vehicle: FleetVehicle) {
  return `${vehicle.brandName} ${vehicle.name} fits up to ${vehicle.passengerCapacity} passengers`;
}

function buildPackageLine(pkg: PackageItem) {
  return `${pkg.title} is a ${pkg.duration.toLowerCase()} route covering ${toSentenceList(pkg.route.slice(0, 3))}`;
}

function buildTransportSuggestions(profile: TravelerProfile) {
  if (profile.groupSize === null) {
    return ["Solo", "Couple", "Family of 4", "Group of 6"];
  }

  return ["Show package", "Airport transfer", "Luxury option", "Budget option"];
}

function buildFollowUpSuggestions(profile: TravelerProfile) {
  if (profile.days === null) {
    return ["3-4 days", "5 days", "7 days", "Need help planning"];
  }

  if (profile.interests.length === 0) {
    return DEFAULT_SUGGESTIONS;
  }

  if (profile.groupSize === null) {
    return ["Solo", "Couple", "Family of 4", "Group of 6"];
  }

  return ["Show another route", "Transport options", "Budget tips", "Booking help"];
}

function buildBestPlacesReply(profile: TravelerProfile) {
  return reply(
    "For a first Sri Lanka trip, Sigiriya works well for heritage, Kandy-Ella-Nuwara Eliya is strong for hill country scenery, and Yala-Mirissa-Galle is great if you want safari plus beaches. Pick the style that sounds closest to your trip.",
    profile.days === null ? DEFAULT_SUGGESTIONS : buildFollowUpSuggestions(profile),
  );
}

function buildSeasonReply() {
  return reply(
    "A simple rule is west and south coast trips work best from December to April, while the east coast is usually better from May to September. If you know your travel window, choose the closest option.",
    ["West coast Dec-Apr", "East coast May-Sep", "I have exact dates", "Best beaches"],
  );
}

function buildBudgetReply(
  packages: PackageItem[],
  vehicles: FleetVehicle[],
  profile: TravelerProfile,
) {
  const shorterTrips = [...packages]
    .filter((pkg) => {
      const days = extractDays(pkg.duration);
      return days !== null && days <= 4;
    })
    .slice(0, 2);
  const smallestVehicle = pickVehicle(vehicles, 2);
  const packageNames = shorterTrips.map((pkg) => pkg.title);
  const packageText =
    packageNames.length > 0
      ? toSentenceList(packageNames)
      : "our shorter Sri Lanka routes";
  const vehicleText = smallestVehicle
    ? ` For transport, ${buildVehicleLine(smallestVehicle)} and usually keeps costs lower for 1 to 3 guests.`
    : "";

  return reply(
    `For better value, shorter fixed routes like ${packageText} are a practical starting point.${vehicleText} Choose your group size and I’ll point you to the most efficient setup.`,
    buildTransportSuggestions(profile),
  );
}

function buildTransportReply(
  vehicles: FleetVehicle[],
  packages: PackageItem[],
  profile: TravelerProfile,
) {
  if (profile.groupSize !== null) {
    const vehicle = pickVehicle(vehicles, profile.groupSize);
    const matchingPackage = pickPackages(
      packages,
      normalize(profile.interests.join(" ")),
      profile.days,
    )[0];

    if (vehicle) {
      const packageText = matchingPackage
        ? ` It also works nicely with ${matchingPackage.title}.`
        : "";
      return reply(
        `For ${profile.groupSize} travellers, ${buildVehicleLine(vehicle)}.${packageText} What would you like to do next?`,
        ["Show package", "Airport transfer", "Luxury option", "Booking help"],
      );
    }
  }

  const options = [...vehicles]
    .sort((a, b) => a.passengerCapacity - b.passengerCapacity)
    .slice(0, 3)
    .map((vehicle) => `${vehicle.name} (${vehicle.passengerCapacity} seats)`);

  return reply(
    `We can match transport by group size, from ${toSentenceList(options)}. Pick the option closest to your group.`,
    buildTransportSuggestions(profile),
  );
}

function buildContactReply(profile: TravelerProfile) {
  return reply(
    "You can review the ready-made tours on /packages and transport options on /fleet, then contact Aba Ceylon to confirm dates and booking. If you want, choose one of these and I’ll narrow it first.",
    buildFollowUpSuggestions(profile),
  );
}

function buildPlanReply(
  packages: PackageItem[],
  vehicles: FleetVehicle[],
  context: string,
  profile: TravelerProfile,
) {
  if (profile.days !== null && profile.days >= 6) {
    const bestMatch = pickPackages(packages, context, 5)[0];
    const secondMatch = pickPackages(packages, `${context} beach hill`, 4).find(
      (pkg) => pkg.id !== bestMatch?.id,
    );
    const vehicle = pickVehicle(vehicles, profile.groupSize);
    const secondStop = secondMatch?.route.at(-1) ?? "the south coast";

    return reply(
      `For ${profile.days} days, a balanced Sri Lanka trip usually combines culture or hill country with a beach finish. A good starting point is ${bestMatch?.title ?? "Ancient Kingdoms Journey"} plus time around ${secondStop}${vehicle ? `, and ${buildVehicleLine(vehicle)}` : ""}. What part do you want to shape next?`,
      buildFollowUpSuggestions(profile),
    );
  }

  const recommendedPackage = pickPackages(packages, context, profile.days)[0];
  const vehicle =
    profile.groupSize !== null
      ? pickVehicle(vehicles, profile.groupSize)
      : vehicles.find(
          (item) =>
            recommendedPackage?.recommendedVehicle?.type &&
            normalize(`${item.brandName} ${item.name} ${item.type}`).includes(
              normalize(recommendedPackage.recommendedVehicle.type),
            ),
        ) ?? pickVehicle(vehicles, null);

  if (!recommendedPackage) {
    return reply(
      "I can help with destinations, packages, and vehicles across Sri Lanka. Start with the trip length or the style you want.",
      ["3-4 days", "5 days", "7 days", "Beaches"],
    );
  }

  const vehicleText = vehicle ? ` ${buildVehicleLine(vehicle)}.` : "";

  return reply(
    `${buildPackageLine(recommendedPackage)}.${vehicleText} Choose what you want to refine next.`,
    buildFollowUpSuggestions(profile),
  );
}

function buildFocusedPackageReply(
  packages: PackageItem[],
  vehicles: FleetVehicle[],
  context: string,
  profile: TravelerProfile,
) {
  const matches = pickPackages(packages, context, profile.days).slice(0, 2);
  const [first, second] = matches;

  if (!first) {
    return reply(
      "I can help with Sri Lanka routes, packages, and transport. Pick the kind of trip you want to start.",
      DEFAULT_SUGGESTIONS,
    );
  }

  const vehicle = pickVehicle(vehicles, profile.groupSize);
  const secondText = second ? ` Another good option is ${second.title}.` : "";
  const vehicleText = vehicle ? ` For transport, ${buildVehicleLine(vehicle)}.` : "";

  return reply(
    `${buildPackageLine(first)}.${secondText}${vehicleText} Choose the next step below.`,
    buildFollowUpSuggestions(profile),
  );
}

function buildFallbackReply(profile: TravelerProfile) {
  if (profile.interests.length === 0) {
    return reply(
      "I can help with Sri Lanka destinations, packages, and transport. Pick the kind of trip you want, and I’ll guide you step by step.",
      DEFAULT_SUGGESTIONS,
    );
  }

  return reply(
    "I can narrow this down better if you share your trip length or group size next.",
    buildFollowUpSuggestions(profile),
  );
}

export async function buildRuleBasedReply(messages: ChatMessage[]) {
  const userMessages = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.trim())
    .filter(Boolean);

  const latestMessage = userMessages.at(-1) ?? "";
  const latestNormalized = canonicalizeLatestMessage(latestMessage);
  const conversationNormalized = normalize(
    [...userMessages.slice(0, -1), latestNormalized].join(" "),
  );
  const profile = buildTravelerProfile(userMessages);

  if (!latestMessage) {
    return reply(
      "Tell me where you want to go in Sri Lanka, how many days you have, or how many people are travelling.",
      ["Beaches", "Wildlife", "Hill country", "Heritage"],
    );
  }

  if (isThanks(latestMessage)) {
    return reply(
      "You’re welcome. Choose the next thing you want help with.",
      buildFollowUpSuggestions(profile),
    );
  }

  if (isGreeting(latestMessage) && userMessages.length === 1) {
    return reply(
      "Hello! I can help with Sri Lanka routes, packages, and vehicles. Pick how you want to begin.",
      ["Beaches", "Wildlife", "Hill country", "Heritage"],
    );
  }

  const [packages, vehicles] = await Promise.all([
    fetchPackages(),
    fetchAllVehicles(),
  ]);

  if (CONTACT_PATTERN.test(latestNormalized)) {
    return buildContactReply(profile);
  }

  if (SEASON_PATTERN.test(latestNormalized)) {
    return buildSeasonReply();
  }

  if (BUDGET_PATTERN.test(latestNormalized)) {
    return buildBudgetReply(packages, vehicles, profile);
  }

  if (TRANSPORT_PATTERN.test(latestNormalized)) {
    return buildTransportReply(vehicles, packages, profile);
  }

  if (BEST_PLACES_PATTERN.test(latestNormalized)) {
    return buildBestPlacesReply(profile);
  }

  if (PLAN_PATTERN.test(latestNormalized) || profile.days !== null) {
    return buildPlanReply(packages, vehicles, conversationNormalized, profile);
  }

  if (
    BEACH_PATTERN.test(latestNormalized) ||
    WILDLIFE_PATTERN.test(latestNormalized) ||
    CULTURE_PATTERN.test(latestNormalized) ||
    HILL_PATTERN.test(latestNormalized) ||
    NORTH_PATTERN.test(latestNormalized)
  ) {
    return buildFocusedPackageReply(
      packages,
      vehicles,
      conversationNormalized,
      profile,
    );
  }

  if (profile.days === null || profile.groupSize === null) {
    return reply(
      "I can help with this, and the fastest way is to fill in one missing detail at a time.",
      buildFollowUpSuggestions(profile),
    );
  }

  return buildFallbackReply(profile);
}
