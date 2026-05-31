import type { Metadata } from "next";

const BASE_URL = "https://www.abaceylontours.com";

export const metadata: Metadata = {
  title: "Chauffeur-Driven Vehicle Hire in Sri Lanka | Premium Fleet",
  description:
    "Hire a private chauffeur-driven vehicle in Sri Lanka. Choose from executive sedans, luxury SUVs, spacious vans, and convertibles. Perfect for airport transfers, day trips, and island-wide touring. Aba Ceylon Tours & Travels.",
  keywords: [
    // Core – vehicle hire
    "vehicle hire Sri Lanka",
    "car hire Sri Lanka",
    "chauffeur Sri Lanka",
    "private driver Sri Lanka",
    "chauffeur driven car Sri Lanka",
    "minivan hire Sri Lanka",
    "van hire Sri Lanka",
    "SUV hire Sri Lanka",
    "luxury car Sri Lanka",
    "airport transfer Sri Lanka",
    "Colombo airport transfer",
    "private taxi Sri Lanka",
    "Sri Lanka driver hire",
    "Toyota Land Cruiser hire Sri Lanka",
    "Toyota KDH van hire Sri Lanka",
    // Long-tail
    "hire car with driver Sri Lanka",
    "tourist vehicle Sri Lanka",
    "private transport Sri Lanka",
    "Sri Lanka chauffeur service",
    // International
    "Mietwagen Sri Lanka",           // German – car hire
    "location voiture Sri Lanka",    // French – car hire
    "alquiler coche Sri Lanka",      // Spanish
    "auto huren Sri Lanka",          // Dutch
    "noleggio auto Sri Lanka",       // Italian
    "レンタカー スリランカ",           // Japanese
    "스리랑카 차량 렌탈",             // Korean
  ],
  alternates: {
    canonical: `${BASE_URL}/fleet`,
  },
  openGraph: {
    title: "Chauffeur-Driven Vehicle Hire in Sri Lanka | Aba Ceylon Tours",
    description:
      "Premium chauffeured vehicles for private transfers and island-wide touring. Sedans, SUVs, vans and convertibles available across Sri Lanka.",
    url: `${BASE_URL}/fleet`,
    images: [
      {
        url: `${BASE_URL}/android-chrome-512x512.webp`,
        width: 512,
        height: 512,
        alt: "Premium fleet vehicles – chauffeur hire Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chauffeur Vehicle Hire Sri Lanka | Aba Ceylon Fleet",
    description:
      "Private chauffeur-driven vehicles across Sri Lanka — sedans, SUVs, vans, and convertibles for transfers and touring.",
    images: [`${BASE_URL}/android-chrome-512x512.webp`],
  },
};
