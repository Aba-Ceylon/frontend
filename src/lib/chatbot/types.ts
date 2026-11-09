// Shared shapes for Aba, the Aba Ceylon travel companion.
// Used by the reply engine (server) and the chat window (client).

export type Interest =
  | "beach"
  | "wildlife"
  | "heritage"
  | "hills"
  | "north"
  | "adventure"
  | "wellness"
  | "food";

export type Budget = "value" | "comfort" | "luxury";
export type Occasion = "honeymoon" | "family" | "solo" | "friends";

/** Everything Aba has learned about the trip so far. */
export interface TripProfile {
  days: number | null;
  travellers: number | null;
  kids: number | null;
  /** 0 = January … 11 = December */
  month: number | null;
  interests: Interest[];
  avoid: Interest[];
  budget: Budget | null;
  occasion: Occasion | null;
  /** Destination slugs the traveller mentioned or added. */
  places: string[];
}

/** A detail Aba asked for and is waiting on. */
export type Slot = "interests" | "days" | "travellers" | "month";

/** What the conversation is currently about, for "show me another". */
export type Topic = "packages" | "stays" | "vehicles" | "destinations" | "activities";

/** Conversation memory. The client keeps it and sends it back each turn. */
export interface AbaState {
  v: 1;
  profile: TripProfile;
  userName: string | null;
  shown: Record<Topic, string[]>;
  topic: Topic | null;
  pendingSlot: Slot | null;
  /** Destination slug the conversation is focused on. */
  focusPlace: string | null;
  turn: number;
  /** Consecutive turns Aba could not understand. */
  confusion: number;
  /** Recently used phrase ids, so Aba doesn't repeat itself word for word. */
  recent: string[];
}

export interface AbaCard {
  kind: "package" | "stay" | "vehicle" | "destination" | "activity";
  id: string;
  title: string;
  subtitle: string;
  meta?: string;
  image: string;
  href: string;
}

export type AbaBubble =
  | { type: "text"; text: string }
  | { type: "cards"; cards: AbaCard[] }
  | {
      type: "action";
      label: string;
      href: string;
      style: "whatsapp" | "primary";
      external?: boolean;
    };

/** Drives the avatar's expression in the chat window. */
export type AbaMood = "warm" | "thinking" | "excited" | "sorry" | "curious";

export interface AbaReply {
  bubbles: AbaBubble[];
  suggestions: string[];
  state: AbaState;
  mood: AbaMood;
}

export interface AbaContext {
  /** Current page, so "this package" or "here" can be resolved. */
  path?: string;
  /** Traveller's local hour (0-23), for a natural greeting. */
  hour?: number;
}

export interface AbaRequest {
  text: string;
  state?: unknown;
  context?: AbaContext;
}

export const MAX_MESSAGE_LENGTH = 500;

export function createInitialState(): AbaState {
  return {
    v: 1,
    profile: {
      days: null,
      travellers: null,
      kids: null,
      month: null,
      interests: [],
      avoid: [],
      budget: null,
      occasion: null,
      places: [],
    },
    userName: null,
    shown: { packages: [], stays: [], vehicles: [], destinations: [], activities: [] },
    topic: null,
    pendingSlot: null,
    focusPlace: null,
    turn: 0,
    confusion: 0,
    recent: [],
  };
}
