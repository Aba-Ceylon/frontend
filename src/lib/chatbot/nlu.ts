// Understanding layer: turns a raw message into intents and trip details.
// Pure functions, no I/O, so it is easy to test.

import type { Budget, Interest, Occasion } from "./types";

export type Intent =
  | "greet"
  | "thanks"
  | "bye"
  | "howAreYou"
  | "whoAreYou"
  | "isHuman"
  | "capabilities"
  | "recommend"
  | "more"
  | "placeInfo"
  | "season"
  | "price"
  | "safety"
  | "visa"
  | "practical"
  | "transport"
  | "airport"
  | "stays"
  | "activities"
  | "contact"
  | "reset"
  | "addToTrip"
  | "compliment"
  | "frustration"
  | "affirm"
  | "deny";

export interface PlaceName {
  slug: string;
  name: string;
}

export interface Understanding {
  raw: string;
  norm: string;
  tokens: string[];
  scores: Partial<Record<Intent, number>>;
  /** Best intent, or null when nothing scored. */
  intent: Intent | null;
  days: number | null;
  travellers: number | null;
  kids: number | null;
  month: number | null;
  interests: Interest[];
  avoid: Interest[];
  budget: Budget | null;
  occasion: Occasion | null;
  places: string[];
  name: string | null;
  /** The whole message is just a number ("5", "two"). */
  bareNumber: number | null;
  /** Mentions "this", "here", "it": refers to the page or last topic. */
  deictic: boolean;
  /** Mostly letters with no recognisable words. */
  gibberish: boolean;
}

// ─── Text helpers ────────────────────────────────────────────────────────────

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 3;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const temp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = temp;
    }
  }
  return row[b.length];
}

const SUFFIXES = ["s", "es", "ing", "ed", "er", "ers"];

const COMMON_WORDS = new Set([
  "looking", "booking", "cooking", "driving", "walking", "talking", "seating", "heating",
  "meeting", "getting", "setting", "staying", "planned", "planner", "another", "nothing",
]);

/**
 * Token matches a vocabulary word exactly, as a plural/verb form ("beaches",
 * "trekking"), or, for long words only, with a single typo ("wildlif").
 * Short words never fuzzy-match, so "reach" is not "beach".
 */
function fuzzyHas(tokens: string[], word: string) {
  return tokens.some((token) => {
    if (token === word) return true;
    if (word.length >= 4 && token.startsWith(word) && SUFFIXES.includes(token.slice(word.length))) return true;
    if (word.length >= 4 && word.endsWith("e") && token.startsWith(word.slice(0, -1)) && SUFFIXES.includes(token.slice(word.length - 1))) return true;
    // One-typo matching only for long words; shorter ones collide with common
    // English ("looking"/"cooking", "driving"/"diving", "reach"/"beach").
    return word.length >= 7 && token.length >= 7 && !COMMON_WORDS.has(token) && levenshtein(token, word) <= 1;
  });
}

const WORD_NUMBERS: Record<string, number> = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, couple: 2, few: 3, several: 4,
};

function toNumber(value: string | undefined) {
  if (!value) return null;
  if (/^\d+$/.test(value)) return Number(value);
  return WORD_NUMBERS[value] ?? null;
}

const NUM = "(\\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|couple|few|several)";

// ─── Entities ────────────────────────────────────────────────────────────────

export function extractDays(norm: string): number | null {
  const range = norm.match(/(\d+)\s*(?:-|to)\s*(\d+)\s*(day|days|night|nights)\b/);
  if (range) return Number(range[2]);

  // Word numbers need a space ("two weeks"), so "and" is never "an" + "d".
  const weeks =
    norm.match(/\b(\d+)\s*(?:-\s*)?(?:week|weeks|wk|wks)\b/) ??
    norm.match(new RegExp(`\\b${NUM}\\s+(?:week|weeks)\\b`));
  if (weeks) {
    const count = toNumber(weeks[1]);
    if (count) return count * 7;
  }
  if (/\bfortnight\b/.test(norm)) return 14;

  const days =
    norm.match(/\b(\d+)\s*(?:-\s*)?(?:day|days|night|nights|d)\b/) ??
    norm.match(new RegExp(`\\b${NUM}\\s+(?:day|days|night|nights)\\b`));
  if (days) {
    const count = toNumber(days[1]);
    if (count && count <= 60) return count;
  }
  if (/\blong weekend\b/.test(norm)) return 3;
  if (/\bweekend\b/.test(norm)) return 2;
  if (/\b(a|one) week\b/.test(norm)) return 7;
  return null;
}

export function extractGroup(norm: string): { travellers: number | null; kids: number | null; occasion: Occasion | null } {
  let adults: number | null = null;
  let kids: number | null = null;
  let occasion: Occasion | null = null;

  const kidMatch = norm.match(new RegExp(`\\b${NUM}\\s*(kids|kid|children|child|teens|teenagers|toddlers|babies)\\b`));
  if (kidMatch) kids = toNumber(kidMatch[1]);
  else if (/\b(with|and) (a|our|my) (kid|child|baby|son|daughter|toddler)\b/.test(norm)) kids = 1;

  const adultPatterns = [
    new RegExp(`\\b(?:group|party|team|family) of ${NUM}\\b`),
    new RegExp(`\\bwe are ${NUM}\\b`),
    new RegExp(`\\bwere ${NUM}\\b`),
    new RegExp(`\\b${NUM}\\s*(people|persons|person|pax|travellers|travelers|adults|guests|friends|of us|ppl|members)\\b`),
    new RegExp(`\\bfor ${NUM}\\s*(people|persons|pax|adults|guests|of us)\\b`),
  ];
  for (const pattern of adultPatterns) {
    const match = norm.match(pattern);
    if (match) {
      const value = toNumber(match[1]);
      if (value && value <= 60) {
        adults = value;
        break;
      }
    }
  }

  if (/\b(honeymoon|honey moon|anniversary|newlywed|newly wed)\b/.test(norm)) {
    occasion = "honeymoon";
    adults ??= 2;
  }
  if (/\b(me and my|my) (wife|husband|partner|girlfriend|boyfriend|fiance|fiancee)\b/.test(norm) || /\bcouple\b/.test(norm)) {
    adults ??= 2;
  }
  if (/\b(solo|alone|just me|by myself|on my own|myself only)\b/.test(norm)) {
    adults ??= 1;
    occasion = "solo";
  }
  if (/\b(family|families|kids|children)\b/.test(norm)) {
    occasion ??= "family";
  }
  if (/\b(friends|mates|buddies)\b/.test(norm) && occasion === null) occasion = "friends";

  // "family with 2 kids" → assume two adults when adults weren't stated.
  let travellers = adults;
  if (kids !== null) {
    travellers = (adults ?? 2) + kids;
  }

  return { travellers, kids, occasion };
}

const MONTHS: Array<[RegExp, number]> = [
  [/\b(january|jan)\b/, 0],
  [/\b(february|feb)\b/, 1],
  [/\b(march|mar)\b/, 2],
  [/\b(april|apr)\b/, 3],
  // "may" is also a verb, so it needs a calendar-ish neighbour.
  [/\b(in|during|this|next|early|late|mid|of|around|until|till|through|by)\s+may\b|\bmay\s+(\d{4}|holidays?|trip|to)\b|^may$/, 4],
  [/\b(june|jun)\b/, 5],
  [/\b(july|jul)\b/, 6],
  [/\b(august|aug)\b/, 7],
  [/\b(september|sept|sep)\b/, 8],
  [/\b(october|oct)\b/, 9],
  [/\b(november|nov)\b/, 10],
  [/\b(december|dec|christmas|xmas)\b/, 11],
];

export function extractMonth(norm: string): number | null {
  for (const [pattern, month] of MONTHS) {
    if (pattern.test(norm)) return month;
  }
  return null;
}

export const INTEREST_WORDS: Record<Interest, string[]> = {
  beach: ["beach", "beaches", "coast", "coastal", "sea", "ocean", "surf", "surfing", "snorkel", "snorkelling", "diving", "sand", "whale", "whales", "swim"],
  wildlife: ["wildlife", "safari", "safaris", "leopard", "leopards", "elephant", "elephants", "animals", "animal", "birds", "birding", "jeep", "nature"],
  heritage: ["heritage", "culture", "cultural", "history", "historic", "historical", "temple", "temples", "ancient", "ruins", "unesco", "buddhist", "buddha", "fort", "colonial", "kingdom"],
  hills: ["hill", "hills", "mountain", "mountains", "tea", "train", "highlands", "hiking", "hike", "trek", "trekking", "waterfall", "waterfalls", "misty", "plantation", "plantations"],
  north: ["north", "northern", "tamil"],
  adventure: ["adventure", "rafting", "kitesurf", "kitesurfing", "zipline", "climbing", "kayak", "kayaking", "canyoning", "thrill", "active"],
  wellness: ["relax", "relaxing", "relaxation", "ayurveda", "spa", "wellness", "yoga", "retreat", "unwind", "chill", "peaceful", "calm"],
  food: ["food", "foodie", "cuisine", "cooking", "curry", "eating", "village", "market", "markets"],
};

/**
 * Place names that hint at a trip style. Used only to rank packages and stays,
 * never to tell the traveller what they like ("stays near Kandy" is not
 * "I love tea country").
 */
export const INTEREST_PLACE_HINTS: Record<Interest, string[]> = {
  beach: ["mirissa", "unawatuna", "bentota", "hikkaduwa", "arugam", "trincomalee", "pasikudah", "nilaveli", "tangalle"],
  wildlife: ["yala", "udawalawe", "wilpattu", "minneriya"],
  heritage: ["sigiriya", "anuradhapura", "polonnaruwa", "dambulla"],
  hills: ["ella", "kandy", "nuwara", "eliya", "haputale"],
  north: ["jaffna", "mannar", "vavuniya", "delft"],
  adventure: [],
  wellness: [],
  food: [],
};

const NEGATORS = new Set(["not", "no", "dont", "don", "hate", "avoid", "skip", "without", "except", "never", "dislike", "nothing", "isnt", "arent", "neither", "nor", "against", "less", "tired", "minus"]);

// Words that start a new, positive thought: "no beaches, love temples".
const POSITIVE_RESET = new Set(["but", "love", "loves", "prefer", "want", "enjoy", "rather", "instead", "however", "though", "although", "yet"]);

function isInterestWord(token: string) {
  return Object.values(INTEREST_WORDS).some((words) => words.some((word) => fuzzyHas([token], word)));
}

export function extractInterests(tokens: string[]): { interests: Interest[]; avoid: Interest[] } {
  const interests = new Set<Interest>();
  const avoid = new Set<Interest>();

  tokens.forEach((token, index) => {
    for (const [interest, words] of Object.entries(INTEREST_WORDS) as Array<[Interest, string[]]>) {
      if (!words.some((word) => fuzzyHas([token], word))) continue;
      // A negator only covers its own phrase: "no beaches, love temples" negates
      // beaches but not temples. Another interest word or a positive verb
      // between the negator and this word ends the negation…
      const window = tokens.slice(Math.max(0, index - 4), index);
      const negatorAt = window.findLastIndex((word) => NEGATORS.has(word));
      const between = negatorAt >= 0 ? window.slice(negatorAt + 1) : [];
      // …except lists joined by "or"/"nor": "not beaches or temples".
      const listContinues = between.some((word) => word === "or" || word === "nor");
      const negated =
        negatorAt >= 0 &&
        !between.some((word) => POSITIVE_RESET.has(word)) &&
        (listContinues || !between.some(isInterestWord));
      if (negated) {
        avoid.add(interest);
        interests.delete(interest);
      } else if (!avoid.has(interest)) {
        interests.add(interest);
      }
    }
  });

  return { interests: [...interests], avoid: [...avoid] };
}

export function extractBudget(norm: string): Budget | null {
  if (/\b(luxury|luxurious|premium|five star|5 star|5-star|high end|upscale|splurge|boutique)\b/.test(norm)) return "luxury";
  if (/\b(budget|cheap|cheaper|affordable|low cost|inexpensive|backpack|backpacking|save money|value)\b/.test(norm)) return "value";
  if (/\b(mid range|midrange|comfortable|moderate|mid-range)\b/.test(norm)) return "comfort";
  return null;
}

const NAME_STOPWORDS = new Set([
  "a", "an", "the", "looking", "interested", "planning", "travelling", "traveling", "going",
  "from", "here", "in", "on", "not", "just", "so", "very", "also", "thinking", "trying",
  "fine", "good", "ok", "okay", "great", "well", "back", "coming", "visiting", "staying",
  "new", "first", "alone", "solo", "with", "married", "sure", "glad", "happy", "sorry",
]);

export function extractName(raw: string): string | null {
  const explicit = raw.match(/\b(?:my name is|my name['’]s|call me|name is)\s+([A-Za-z][A-Za-z-]{1,20})/i);
  const casual = raw.match(/^\s*(?:[Hh]i|[Hh]ello|[Hh]ey)?[\s,!.]*(?:[Ii]['’]?m|[Ii] am)\s+([A-Z][a-zA-Z-]{1,20})\s*(?:[,.!]|\band\b|$)/);
  const candidate = explicit?.[1] ?? casual?.[1] ?? null;
  if (!candidate) return null;
  if (NAME_STOPWORDS.has(candidate.toLowerCase())) return null;
  return candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
}

export function extractPlaces(norm: string, tokens: string[], places: PlaceName[]): string[] {
  const found: string[] = [];
  for (const place of places) {
    const name = normalize(place.name);
    if (!name) continue;
    const words = name.split(" ");
    // Multi-word names must appear in full; single words may have one typo.
    const hit =
      norm.includes(name) ||
      (words.length === 1 && name.length >= 5 && fuzzyHas(tokens, name)) ||
      (words.length > 1 && words[0].length >= 6 && tokens.includes(words[0]) && !["temple", "national", "ancient"].includes(words[0]));
    if (hit && !found.includes(place.slug)) found.push(place.slug);
  }
  return found.slice(0, 4);
}

// ─── Intents ─────────────────────────────────────────────────────────────────

type Rule = { intent: Intent; pattern: RegExp; weight: number } | { intent: Intent; words: string[]; weight: number };

const RULES: Rule[] = [
  { intent: "greet", pattern: /^(hi+|hello+|hey+|hiya|yo|ayubowan|ayubovan|good (morning|afternoon|evening|day)|greetings|howdy|namaste|vanakkam)\b/, weight: 3 },
  { intent: "thanks", pattern: /\b(thanks|thank you|thank u|thx|ty|cheers|appreciate|istuti|sthuthi|stuti)\b/, weight: 4 },
  { intent: "bye", pattern: /\b(bye|goodbye|good bye|see you|see ya|later|good night|gotta go|that s all|thats all)\b/, weight: 4 },
  { intent: "howAreYou", pattern: /\b(how are you|how r u|how are u|hows it going|how is it going|how do you do|whats up|sup|how have you been)\b/, weight: 4 },
  { intent: "whoAreYou", pattern: /\b(who are you|what are you|your name|who is aba|whats aba|what is aba|introduce yourself|tell me about yourself)\b/, weight: 4 },
  { intent: "isHuman", pattern: /\b(are you (a )?(human|real|person|bot|robot|ai|machine)|is this (a )?(bot|human|real person)|real person|talking to a bot)\b/, weight: 5 },
  { intent: "capabilities", pattern: /\b(what can you do|how can you help|can you help|what do you do|what do you know|menu)\b/, weight: 4 },
  { intent: "capabilities", pattern: /^(help|help me|options)$/, weight: 4 },
  { intent: "recommend", pattern: /\b(plan|planning|itinerary|itenerary|trip|tour|tours|holiday|vacation|package|packages|journey|route|recommend|suggest|ideas|where should|where to go|what to do|must see|must visit|best places|top places|show me)\b/, weight: 2 },
  { intent: "more", pattern: /\b(another|other|more|else|different|next one|something else|alternative|alternatives|show more|any other)\b/, weight: 3 },
  { intent: "placeInfo", pattern: /\b(tell me about|tell me more|what about|whats in|what is in|info on|information about|know about|describe|is it worth|worth visiting|what to see in|things to do in|whats there|what is there)\b/, weight: 2 },
  { intent: "season", pattern: /\b(weather|season|seasons|monsoon|rain|rainy|raining|climate|best time|when to (go|visit|travel)|when should|temperature|hot|sunny|dry season)\b/, weight: 4 },
  { intent: "price", pattern: /\b(price|prices|pricing|cost|costs|how much|rate|rates|quote|expensive|fee|fees|charge|charges|usd|dollars|euro|lkr|per day|per person|tariff)\b/, weight: 4 },
  { intent: "safety", pattern: /\b(safe|safety|dangerous|danger|risk|risky|secure|crime|scam|scams)\b/, weight: 4 },
  { intent: "visa", pattern: /\b(visa|eta|entry|passport|immigration|permit)\b/, weight: 5 },
  { intent: "practical", pattern: /\b(currency|money|cash|atm|card|cards|plug|plugs|adapter|sim|internet|wifi|tip|tipping|time zone|timezone|language|dress code|what to wear|pack|packing|vaccine|vaccines|insurance)\b/, weight: 4 },
  { intent: "transport", pattern: /\b(vehicle|vehicles|car|cars|van|vans|suv|bus|coach|sedan|driver|drivers|chauffeur|transport|transportation|fleet|ride|pickup|get around|getting around|tuk tuk|tuktuk)\b/, weight: 3 },
  { intent: "airport", pattern: /\b(airport|cmb|bandaranaike|katunayake|arrival|arrive|landing|land at|flight)\b/, weight: 4 },
  { intent: "stays", pattern: /\b(stay|stays|hotel|hotels|accommodation|accomodation|resort|resorts|villa|villas|lodge|lodges|room|rooms|where to sleep|homestay|guesthouse|boutique)\b/, weight: 3 },
  { intent: "activities", pattern: /\b(activity|activities|experience|experiences|things to do|excursion|excursions|day trip|what can we do)\b/, weight: 3 },
  { intent: "contact", pattern: /\b(book|booking|reserve|reservation|contact|whatsapp|call|phone|email|e-mail|human|agent|real person|someone|speak to|talk to|team|representative|confirm)\b/, weight: 3 },
  { intent: "reset", pattern: /\b(start over|restart|reset|clear|begin again|new trip|from scratch|forget (it|that|everything))\b/, weight: 6 },
  { intent: "addToTrip", pattern: /\b(add (it|this|that|\w+) to (my|the) (trip|route|plan|journey)|add to my (trip|route|plan|journey)|include (it|this|that))\b/, weight: 6 },
  { intent: "compliment", pattern: /\b(awesome|amazing|great job|you are great|youre great|love it|love this|perfect|brilliant|wonderful|nice one|cool|helpful|good bot)\b/, weight: 2 },
  { intent: "frustration", pattern: /\b(useless|stupid|dumb|not helpful|doesnt help|not working|wrong|you dont understand|makes no sense|annoying|terrible|rubbish|nonsense|confusing|already told you|i said)\b/, weight: 5 },
  { intent: "affirm", pattern: /^(yes|yeah|yep|yup|sure|ok|okay|okey|alright|sounds good|please|go ahead|do it|of course|definitely|absolutely|why not|ya|ow|hari)\b/, weight: 3 },
  { intent: "deny", pattern: /^(no|nope|nah|not really|no thanks|not now|maybe later|never mind|nevermind|epa|na)\b/, weight: 3 },
];

const KNOWN_WORDS = new Set(
  [
    ...Object.values(INTEREST_WORDS).flat(),
    ...Object.keys(WORD_NUMBERS),
    "i", "we", "you", "me", "my", "our", "the", "and", "or", "to", "in", "for", "with", "is", "are",
    "what", "how", "when", "where", "why", "can", "do", "want", "like", "need", "go", "see", "trip",
    "days", "day", "week", "people", "sri", "lanka", "it", "this", "that", "of", "on", "at", "be",
  ],
);

export function understand(raw: string, places: PlaceName[] = []): Understanding {
  const trimmed = raw.trim().slice(0, 500);
  const norm = normalize(trimmed);
  const tokens = norm.split(" ").filter(Boolean);

  const scores: Partial<Record<Intent, number>> = {};
  for (const rule of RULES) {
    const hit = "pattern" in rule ? rule.pattern.test(norm) : rule.words.some((word) => fuzzyHas(tokens, word));
    if (hit) scores[rule.intent] = (scores[rule.intent] ?? 0) + rule.weight;
  }

  // Typo-tolerant backups for the most common topics.
  const fuzzyBackups: Array<[Intent, string[]]> = [
    ["recommend", ["itinerary", "holiday", "package", "vacation", "recommend"]],
    ["stays", ["accommodation", "hotel", "resort"]],
    ["transport", ["vehicle", "chauffeur", "transport"]],
    ["season", ["weather", "monsoon", "season"]],
    ["price", ["price", "expensive"]],
  ];
  for (const [intent, words] of fuzzyBackups) {
    if (!scores[intent] && words.some((word) => fuzzyHas(tokens, word))) scores[intent] = 2;
  }

  const { interests, avoid } = extractInterests(tokens);
  const group = extractGroup(norm);
  const placeSlugs = extractPlaces(norm, tokens, places);
  const days = extractDays(norm);
  const month = extractMonth(norm);

  // A single word that is only a number word ("two", "5").
  const bareNumber = tokens.length === 1 ? toNumber(tokens[0]) : null;

  if (placeSlugs.length && !scores.recommend && !scores.stays && !scores.transport) {
    scores.placeInfo = (scores.placeInfo ?? 0) + 2;
  }
  // Greetings that carry real content shouldn't stop at "hello".
  if (scores.greet && tokens.length > 3) scores.greet = 1;

  let intent: Intent | null = null;
  let best = 0;
  for (const [key, value] of Object.entries(scores) as Array<[Intent, number]>) {
    if (value > best) {
      best = value;
      intent = key;
    }
  }

  const letters = norm.replace(/[^a-z]/g, "");
  const knownCount = tokens.filter((token) => KNOWN_WORDS.has(token) || token.length <= 2).length;
  const gibberish =
    intent === null &&
    !days && !group.travellers && !interests.length && !avoid.length && !placeSlugs.length && month === null && bareNumber === null &&
    letters.length >= 4 &&
    (knownCount === 0 || /[bcdfghjklmnpqrstvwxz]{5,}/.test(letters));

  return {
    raw: trimmed,
    norm,
    tokens,
    scores,
    intent,
    days,
    travellers: group.travellers,
    kids: group.kids,
    month,
    interests,
    avoid,
    budget: extractBudget(norm),
    occasion: group.occasion,
    places: placeSlugs,
    name: extractName(trimmed),
    bareNumber,
    deictic: /\b(this|here|it|that one|this one|this place|this package|this stay|this car)\b/.test(norm),
    gibberish,
  };
}
