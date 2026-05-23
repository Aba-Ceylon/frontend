import type { Metadata } from "next";

const BASE_URL = "https://www.abaceylontours.com";

export const metadata: Metadata = {
  title: "Explore Destinations in Sri Lanka | Places to Visit Guide",
  description:
    "Discover all must-visit destinations across Sri Lanka — from Sigiriya and Kandy to Ella, Galle Fort, Yala, Mirissa, Jaffna, and beyond. Expert travel guide by Aba Ceylon Tours & Travels.",
  keywords: [
    "Sri Lanka destinations",
    "places to visit in Sri Lanka",
    "Sri Lanka travel guide",
    "top destinations Sri Lanka",
    "Sri Lanka tourist spots",
    "Sigiriya", "Kandy", "Ella", "Galle", "Mirissa",
    "Yala National Park", "Nuwara Eliya", "Jaffna",
    "Anuradhapura", "Polonnaruwa", "Dambulla",
    "Nine Arch Bridge", "Adam's Peak", "Horton Plains",
    "Sinharaja Rainforest", "Arugam Bay",
    "Sri Lanka reiseführer",    // German
    "destinations Sri Lanka",   // French/international
  ],
  alternates: { canonical: `${BASE_URL}/destinations` },
  openGraph: {
    title: "Explore Sri Lanka Destinations | Aba Ceylon Tours & Travels",
    description:
      "Your complete guide to Sri Lanka's best destinations — heritage cities, hill country, beaches, wildlife reserves, and hidden gems.",
    url: `${BASE_URL}/destinations`,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Sri Lanka destinations guide" }],
  },
};
