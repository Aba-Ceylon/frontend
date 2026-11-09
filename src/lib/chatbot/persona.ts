// Aba's voice: a warm local guide who never says the same thing twice in a row.
//
// Aba is honest about being a virtual guide. The personality comes from how
// it talks (warmth, small Sinhala touches, remembering your name, noticing
// what you told it), never from pretending to be a person.

import type { AbaState } from "./types";

function hash(text: string) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

/**
 * Pick one phrasing for `key`. Deterministic for a given turn (so tests are
 * stable) but varied across turns, and it skips a phrasing used recently.
 */
export function say(state: AbaState, key: string, variants: string[]): string {
  if (variants.length === 1) return variants[0];
  const start = hash(`${key}:${state.turn}`) % variants.length;
  for (let offset = 0; offset < variants.length; offset += 1) {
    const index = (start + offset) % variants.length;
    const id = `${key}:${index}`;
    if (!state.recent.includes(id)) {
      remember(state, id);
      return variants[index];
    }
  }
  remember(state, `${key}:${start}`);
  return variants[start];
}

/** Track a phrase or event id in short-term memory. */
export function remember(state: AbaState, id: string) {
  state.recent = [...state.recent.filter((entry) => entry !== id), id].slice(-16);
}

export function hasSaid(state: AbaState, id: string) {
  return state.recent.includes(id);
}

export function timeGreeting(hour: number | undefined) {
  if (hour === undefined || Number.isNaN(hour)) return "Ayubowan";
  if (hour < 5) return "You're up late";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** ", Sarah" when Aba knows the traveller's name, otherwise nothing. */
export function nameTag(state: AbaState) {
  return state.userName ? `, ${state.userName}` : "";
}

export function joinList(items: string[], conjunction = "and") {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1]}`;
}

export function plural(count: number, one: string, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`;
}
