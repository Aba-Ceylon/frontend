#!/usr/bin/env node
/**
 * Production SEO smoke check.
 *
 * Exists because an `X-Robots-Tag: noindex` header set at the hosting layer —
 * never in this repo — silently deindexed the whole site for roughly two months
 * before anyone noticed. Page-level audits all looked clean because the
 * directive lived in the HTTP response, not the HTML.
 *
 * Requests use a Googlebot smartphone UA: Google indexes mobile-first, so that
 * is the response that actually decides whether the site gets indexed.
 *
 * Usage:
 *   node scripts/seo-check.mjs [baseUrl]
 *   npm run seo:check
 *   npm run seo:check -- https://staging.example.com
 */

const BASE_URL = (process.argv[2] || "https://www.abaceylontours.com").replace(
  /\/$/,
  "",
);

const GOOGLEBOT_SMARTPHONE =
  "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36 " +
  "(compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const SAMPLE_SIZE = 5;
const MIN_SITEMAP_URLS = 50;

const failures = [];

function fail(check, detail) {
  failures.push({ check, detail });
  console.error(`  FAIL  ${check}\n        ${detail}`);
}

function pass(check, detail = "") {
  console.log(`  ok    ${check}${detail ? `  (${detail})` : ""}`);
}

async function get(url) {
  const response = await fetch(url, {
    headers: { "user-agent": GOOGLEBOT_SMARTPHONE },
    redirect: "follow",
  });
  return { response, body: await response.text() };
}

/** The header form that caused the original outage. */
function robotsHeaderNoindex(response) {
  const header = response.headers.get("x-robots-tag");
  return header && /noindex/i.test(header) ? header : null;
}

/** The meta form, e.g. <meta name="robots" content="noindex"> */
function robotsMetaNoindex(body) {
  const match = body.match(
    /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  );
  return match && /noindex/i.test(match[1]) ? match[0] : null;
}

function assertIndexable(label, url, response, body) {
  const header = robotsHeaderNoindex(response);
  if (header) {
    fail(`${label} has no noindex header`, `${url} -> X-Robots-Tag: ${header}`);
  }

  const meta = robotsMetaNoindex(body);
  if (meta) {
    fail(`${label} has no noindex meta`, `${url} -> ${meta}`);
  }

  return !header && !meta;
}

async function checkHomepage() {
  const url = `${BASE_URL}/`;
  const { response, body } = await get(url);

  if (response.status !== 200) {
    fail("homepage returns 200", `${url} -> HTTP ${response.status}`);
    return;
  }
  pass("homepage returns 200");

  if (assertIndexable("homepage", url, response, body)) {
    pass("homepage is indexable", "no noindex header or meta");
  }

  // The homepage previously rendered its content client-side only, shipping an
  // empty shell to crawlers. An <h1> is the cheapest proof that did not regress.
  if (/<h1[\s>]/i.test(body)) {
    pass("homepage renders an <h1> server-side");
  } else {
    fail(
      "homepage renders an <h1> server-side",
      `${url} -> no <h1> in server HTML (content may be client-gated again)`,
    );
  }
}

async function checkRobotsTxt() {
  const url = `${BASE_URL}/robots.txt`;
  const { response, body } = await get(url);

  if (response.status !== 200) {
    fail("robots.txt returns 200", `${url} -> HTTP ${response.status}`);
    return;
  }
  pass("robots.txt returns 200");

  if (/^sitemap:/im.test(body)) {
    pass("robots.txt advertises a sitemap");
  } else {
    fail("robots.txt advertises a sitemap", `${url} -> no "Sitemap:" line`);
  }
}

async function checkSitemap() {
  const url = `${BASE_URL}/sitemap.xml`;
  const { response, body } = await get(url);

  if (response.status !== 200) {
    fail("sitemap returns 200", `${url} -> HTTP ${response.status}`);
    return [];
  }
  pass("sitemap returns 200");

  const contentType = response.headers.get("content-type") || "";
  if (/xml/i.test(contentType)) {
    pass("sitemap is served as XML", contentType.split(";")[0]);
  } else {
    fail("sitemap is served as XML", `${url} -> Content-Type: ${contentType}`);
  }

  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

  if (locs.length >= MIN_SITEMAP_URLS) {
    pass("sitemap lists enough URLs", `${locs.length} URLs`);
  } else {
    fail(
      "sitemap lists enough URLs",
      `${url} -> ${locs.length} URLs, expected at least ${MIN_SITEMAP_URLS}`,
    );
  }

  const duplicates = locs.length - new Set(locs).size;
  if (duplicates === 0) {
    pass("sitemap has no duplicate URLs");
  } else {
    fail("sitemap has no duplicate URLs", `${url} -> ${duplicates} duplicates`);
  }

  return locs;
}

/** Spot-check a spread of sitemap URLs rather than all ~91 on every run. */
async function checkSampleUrls(locs) {
  if (!locs.length) return;

  const step = Math.max(1, Math.floor(locs.length / SAMPLE_SIZE));
  const sample = [];
  for (let i = 0; i < locs.length && sample.length < SAMPLE_SIZE; i += step) {
    sample.push(locs[i]);
  }

  for (const url of sample) {
    let result;
    try {
      result = await get(url);
    } catch (error) {
      fail("sampled sitemap URL is reachable", `${url} -> ${error.message}`);
      continue;
    }

    const { response, body } = result;
    if (response.status !== 200) {
      fail("sampled sitemap URL returns 200", `${url} -> HTTP ${response.status}`);
      continue;
    }

    if (assertIndexable("sampled sitemap URL", url, response, body)) {
      pass("sampled URL is indexable", url.replace(BASE_URL, "") || "/");
    }
  }
}

async function main() {
  console.log(`SEO check against ${BASE_URL}`);
  console.log(`(as Googlebot smartphone)\n`);

  await checkHomepage();
  await checkRobotsTxt();
  const locs = await checkSitemap();
  await checkSampleUrls(locs);

  console.log("");
  if (failures.length) {
    console.error(`SEO check FAILED — ${failures.length} problem(s):`);
    for (const { check, detail } of failures) {
      console.error(`  - ${check}: ${detail}`);
    }
    process.exit(1);
  }

  console.log("SEO check passed.");
}

main().catch((error) => {
  console.error(`SEO check errored: ${error.message}`);
  process.exit(1);
});
