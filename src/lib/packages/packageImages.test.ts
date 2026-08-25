import assert from "node:assert/strict";
import test from "node:test";
import { getPackageImages } from "./packageImages";

test("keeps database package image order", () => {
  assert.deepEqual(
    getPackageImages({ image: "/cover.jpg", images: ["/one.jpg", "/two.jpg", "/three.jpg"] }),
    ["/one.jpg", "/two.jpg", "/three.jpg"],
  );
});

test("uses the cover image when a package has no gallery images", () => {
  assert.deepEqual(getPackageImages({ image: "/cover.jpg", images: [] }), ["/cover.jpg"]);
});

test("ignores blank gallery entries", () => {
  assert.deepEqual(
    getPackageImages({ image: "/cover.jpg", images: ["", "  ", "/route.jpg"] }),
    ["/route.jpg"],
  );
});
