import assert from "node:assert/strict";
import test from "node:test";
import * as brainImport from "./brain";
import * as nluImport from "./nlu";
import { activities } from "@/data/activities";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";
import { stays } from "@/data/stays";
import { fetchAllVehicles } from "@/services/fleetService";
import type { AbaReply } from "./types";
import type { KnowledgeBase } from "./knowledge";

// node --test + tsx can wrap ESM exports in `default`.
const brain = ((brainImport as { default?: typeof brainImport }).default ?? brainImport);
const nlu = ((nluImport as { default?: typeof nluImport }).default ?? nluImport);

// A Tuesday, 10:30am in Colombo, so the office is open.
const NOW = new Date("2026-11-10T05:00:00Z");

let kbPromise: Promise<KnowledgeBase> | null = null;
function kb() {
  kbPromise ??= fetchAllVehicles().then((vehicles) => ({ packages, stays, destinations, activities, vehicles }));
  return kbPromise;
}

async function chat(...messages: string[]) {
  const base = await kb();
  let state: unknown = undefined;
  let reply: AbaReply | undefined;
  for (const message of messages) {
    reply = brain.respond(message, state, { path: "/", hour: 10 }, base, NOW);
    state = reply.state;
  }
  return reply!;
}

const text = (reply: AbaReply) =>
  reply.bubbles
    .map((bubble) => (bubble.type === "text" ? bubble.text : bubble.type === "cards" ? bubble.cards.map((card) => card.title).join(" ") : bubble.label))
    .join("\n");

// ─── Understanding ───────────────────────────────────────────────────────────

test("reads trip lengths in words, weeks and ranges, and never mistakes 'and' for a day", () => {
  assert.equal(nlu.extractDays(nlu.normalize("two weeks in Sri Lanka")), 14);
  assert.equal(nlu.extractDays(nlu.normalize("3-4 days")), 4);
  assert.equal(nlu.extractDays(nlu.normalize("ten nights")), 10);
  assert.equal(nlu.extractDays(nlu.normalize("temples and tea")), null);
});

test("reads group sizes, including kids and couples", () => {
  assert.equal(nlu.extractGroup(nlu.normalize("we are a group of 12")).travellers, 12);
  const family = nlu.extractGroup(nlu.normalize("family with 2 kids"));
  assert.equal(family.travellers, 4);
  assert.equal(family.kids, 2);
  assert.equal(nlu.extractGroup(nlu.normalize("me and my wife")).travellers, 2);
});

test("handles negation without swallowing the next positive interest", () => {
  const result = nlu.extractInterests(nlu.normalize("I dont like beaches, love temples and tea").split(" "));
  assert.deepEqual(result.avoid, ["beach"]);
  assert.ok(result.interests.includes("heritage"));
  assert.ok(result.interests.includes("hills"));
});

test("does not fuzzy-match common words onto interests", () => {
  const result = nlu.extractInterests(nlu.normalize("i am looking for a booking while we reach colombo").split(" "));
  assert.deepEqual(result.interests, []);
});

test("only treats real introductions as names", () => {
  assert.equal(nlu.extractName("my name is sarah"), "Sarah");
  assert.equal(nlu.extractName("Hi, I'm Sarah and we love beaches"), "Sarah");
  assert.equal(nlu.extractName("this is useless"), null);
  assert.equal(nlu.extractName("I'm looking for a trip"), null);
});

// ─── Conversation ────────────────────────────────────────────────────────────

test("a greeting that carries trip details is planned, not just greeted", async () => {
  const reply = await chat("hello, we are 2 people for 10 days");
  assert.equal(reply.state.profile.travellers, 2);
  assert.equal(reply.state.profile.days, 10);
  assert.ok(reply.bubbles.some((bubble) => bubble.type === "cards"), "expected package cards");
});

test("a beach request recommends the coastal journey", async () => {
  const reply = await chat("I want a 4 day beach trip");
  assert.match(text(reply), /Wildlife & Coast Adventure/);
});

test("'show me another' never repeats a package already shown", async () => {
  const first = await chat("Beaches", "5 days", "A couple");
  const seen = new Set(first.state.shown.packages);
  const next = brain.respond("Show me another", first.state, {}, await kb(), NOW);
  const cards = next.bubbles.flatMap((bubble) => (bubble.type === "cards" ? bubble.cards : []));
  assert.ok(cards.length > 0);
  for (const card of cards) assert.ok(!seen.has(card.id), `${card.title} was already shown`);
});

test("a bare number answers the question Aba just asked", async () => {
  const reply = await chat("Wildlife", "6");
  assert.equal(reply.state.profile.days, 6);
});

test("respects 'no beaches' when recommending", async () => {
  const reply = await chat("no beaches please, we love ancient temples", "1 week");
  assert.deepEqual(reply.state.profile.avoid, ["beach"]);
  assert.doesNotMatch(text(reply), /Wildlife & Coast Adventure/);
});

test("matches a sensible vehicle to the group, not a 2-seat convertible by default", async () => {
  const couple = await chat("I need a car for 2 people");
  assert.doesNotMatch(text(couple), /Convertible/i);
  const group = await chat("we are 6 people and need transport");
  assert.match(text(group), /Van/i);
});

test("tells you about a destination and can add it to the trip", async () => {
  const about = await chat("tell me about kandy");
  assert.match(text(about), /Kandy/);
  const added = brain.respond("Add Kandy to my trip", about.state, {}, await kb(), NOW);
  assert.ok(added.state.profile.places.includes("kandy"));
});

test("is honest about being a virtual guide and offers a real person", async () => {
  const reply = await chat("are you a bot?");
  assert.match(text(reply), /not a human/);
  assert.ok(reply.bubbles.some((bubble) => bubble.type === "action" && bubble.style === "whatsapp"));
});

test("answers price questions honestly with a hand-off, never a made-up number", async () => {
  const reply = await chat("how much does it cost?");
  assert.doesNotMatch(text(reply), /\$\d/);
  assert.ok(reply.bubbles.some((bubble) => bubble.type === "action" && bubble.href.includes("wa.me")));
});

test("the WhatsApp hand-off carries the trip details", async () => {
  const reply = await chat("my name is Sarah", "family with 2 kids, 8 days, leopards and beach", "Talk to the team");
  const action = reply.bubbles.find((bubble) => bubble.type === "action");
  assert.ok(action && action.type === "action");
  const message = decodeURIComponent(action.href.split("text=")[1]);
  assert.match(message, /Sarah/);
  assert.match(message, /8 days/);
  assert.match(message, /4 travellers/);
});

test("knows Ella is pleasant mid-year", async () => {
  const reply = await chat("whats the weather in ella in july");
  assert.match(text(reply), /good time for \*\*Ella\*\*/);
});

test("a second 'hi' doesn't repeat the full introduction", async () => {
  const reply = await chat("Hi", "Hi");
  assert.doesNotMatch(text(reply), /I'm Aba/);
});

test("offers a human after repeated confusion", async () => {
  const once = await chat("asdkjasd");
  assert.ok(!once.bubbles.some((bubble) => bubble.type === "action"));
  const twice = await chat("asdkjasd", "qwrtzpl");
  assert.ok(twice.bubbles.some((bubble) => bubble.type === "action"));
});

test("start over clears the trip but keeps the traveller's name", async () => {
  const reply = await chat("my name is Sarah", "beaches for 5 days", "start over");
  assert.equal(reply.state.userName, "Sarah");
  assert.equal(reply.state.profile.days, null);
  assert.deepEqual(reply.state.profile.interests, []);
});

test("ignores tampered state from the client", async () => {
  const reply = brain.respond(
    "hi",
    { profile: { days: "lots", interests: ["<script>"], travellers: -4 }, userName: "<b>x</b>", turn: "9" },
    {},
    await kb(),
    NOW,
  );
  assert.equal(reply.state.profile.days, null);
  assert.deepEqual(reply.state.profile.interests, []);
  assert.equal(reply.state.userName, null);
});
