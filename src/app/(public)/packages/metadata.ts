import type { Metadata } from "next";

const BASE_URL = "https://www.abaceylontours.com";

export const metadata: Metadata = {
  title: "Sri Lanka Tour Packages | Curated Holiday Packages",
  description:
    "Explore Aba Ceylon's handcrafted Sri Lanka tour packages — from the Ancient Kingdoms heritage circuit and Hill Country Escape to Wildlife & Coast Adventures. 3-day to 10-day itineraries with private chauffeur, accommodation, and activities included.",
  keywords: [
    "Sri Lanka tour packages",
    "Sri Lanka holiday packages",
    "Sri Lanka travel itinerary",
    "Sri Lanka package tours",
    "Sri Lanka guided tours",
    "Sri Lanka heritage tour",
    "Sri Lanka hill country tour",
    "Sri Lanka wildlife safari package",
    "Sigiriya tour package",
    "Kandy Ella tour",
    "Yala safari package Sri Lanka",
    "10 day Sri Lanka tour",
    "5 day Sri Lanka tour",
    "private tour Sri Lanka",
    "all inclusive Sri Lanka holiday",
    "Forschungsreise Sri Lanka",   // German
    "circuit Sri Lanka",           // French
  ],
  alternates: {
    canonical: `${BASE_URL}/packages`,
  },
  openGraph: {
    title: "Sri Lanka Tour Packages | Aba Ceylon Tours & Travels",
    description:
      "Handcrafted multi-day tour packages covering Sri Lanka's heritage sites, hill country, wildlife reserves, and southern beaches. Private chauffeur, stays, and activities included.",
    url: `${BASE_URL}/packages`,
    images: [
      {
        url: `${BASE_URL}/allPckgs.png`,
        width: 1200,
        height: 630,
        alt: "Aba Ceylon – Sri Lanka Tour Packages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Lanka Tour Packages | Aba Ceylon Tours & Travels",
    description:
      "Handcrafted Sri Lanka travel packages with private chauffeur, heritage stays, and curated itineraries.",
    images: [`${BASE_URL}/allPckgs.png`],
  },
};
