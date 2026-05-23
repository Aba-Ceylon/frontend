import type { Metadata } from "next";

const BASE_URL = "https://www.abaceylontours.com";

export const metadata: Metadata = {
  title: "Heritage Stays in Sri Lanka | Curated Accommodation",
  description:
    "Discover hand-picked heritage stays across Sri Lanka — eco lodges, boutique hotels, luxury resorts, safari camps and hilltop villas. From Sigiriya Rock View Eco Lodge to Cape Weligama cliff-top villas. Book with Aba Ceylon Tours & Travels.",
  keywords: [
    "accommodation in Sri Lanka",
    "where to stay in Sri Lanka",
    "heritage stays Sri Lanka",
    "best hotels Sri Lanka",
    "luxury resorts Sri Lanka",
    "boutique hotels Sri Lanka",
    "eco lodge Sri Lanka",
    "safari camp Sri Lanka",
    "Sigiriya hotel",
    "Kandy hotel",
    "Ella resort",
    "Galle boutique hotel",
    "Yala safari lodge",
    "Weligama beach resort",
    "Anuradhapura resort",
    "Sri Lanka bed and breakfast",
    "Sri Lanka villa rental",
    // International
    "unterkunft Sri Lanka",    // German
    "hébergement Sri Lanka",   // French
    "alojamiento Sri Lanka",   // Spanish
    "accommodatie Sri Lanka",  // Dutch
  ],
  alternates: {
    canonical: `${BASE_URL}/stays`,
  },
  openGraph: {
    title: "Heritage Stays in Sri Lanka | Aba Ceylon Tours & Travels",
    description:
      "Stay within the story of Sri Lanka. Hand-picked eco lodges, boutique hotels, luxury resorts, and safari camps curated by Aba Ceylon.",
    url: `${BASE_URL}/stays`,
    images: [
      {
        url: `${BASE_URL}/staysbanner.png`,
        width: 1200,
        height: 630,
        alt: "Heritage stays and accommodation in Sri Lanka – Aba Ceylon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heritage Stays in Sri Lanka | Aba Ceylon Tours",
    description:
      "Curated accommodation across Sri Lanka — eco lodges, luxury resorts, boutique hotels, and safari camps.",
    images: [`${BASE_URL}/staysbanner.png`],
  },
};
