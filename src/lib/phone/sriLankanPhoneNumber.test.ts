import assert from "node:assert/strict";
import test from "node:test";
import {
  formatSriLankanPhoneNumber,
  normalizeSriLankanPhoneNumber,
} from "./sriLankanPhoneNumber";

test("converts a local Sri Lankan number to an international number", () => {
  assert.equal(normalizeSriLankanPhoneNumber("072 255 4488"), "94722554488");
  assert.equal(formatSriLankanPhoneNumber("072 255 4488"), "+94 72 255 4488");
});

test("keeps an existing +94 number in international form", () => {
  assert.equal(normalizeSriLankanPhoneNumber("+94 72 255 4488"), "94722554488");
  assert.equal(formatSriLankanPhoneNumber("+94 72 255 4488"), "+94 72 255 4488");
});

test("does not convert an unrelated number that starts with zero", () => {
  assert.equal(normalizeSriLankanPhoneNumber("01234"), "01234");
});
