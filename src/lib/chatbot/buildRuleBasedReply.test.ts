import assert from "node:assert/strict";
import test from "node:test";
import * as chatbotModuleImport from "./buildRuleBasedReply";

const chatbotModule = (
  chatbotModuleImport as typeof chatbotModuleImport & {
    default?: typeof chatbotModuleImport;
  }
).default ?? chatbotModuleImport;

const { buildRuleBasedReply } = chatbotModule;

test("buildRuleBasedReply matches a beach request to the coastal wildlife package", async () => {
  const reply = await buildRuleBasedReply([
    { role: "user", content: "I want a 4 day beach trip in Sri Lanka" },
  ]);

  assert.match(reply.message, /Wildlife & Coast Adventure/i);
  assert.ok(
    reply.suggestions.includes("Group of 6"),
    "expected follow-up suggestions for traveller count",
  );
});

test("buildRuleBasedReply recommends the larger van for a group transport request", async () => {
  const reply = await buildRuleBasedReply([
    { role: "user", content: "We are 6 people and need transport" },
  ]);

  assert.match(reply.message, /Executive Van/i);
  assert.ok(
    reply.suggestions.includes("Airport transfer"),
    "expected transport follow-up suggestions",
  );
});
