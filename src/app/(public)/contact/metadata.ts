import type { Metadata } from "next";

const BASE_URL = "https://www.abaceylontours.com";

export const metadata: Metadata = {
  title: "Contact Us | Plan Your Sri Lanka Holiday",
  description:
    "Get in touch with Aba Ceylon Tours & Travels to plan your perfect Sri Lanka trip. WhatsApp us, call, or email our Colombo team. Office hours: Mon–Fri 8 AM–5 PM SLST.",
  keywords: [
    "contact Aba Ceylon",
    "Sri Lanka travel agency contact",
    "plan Sri Lanka trip",
    "Sri Lanka tour enquiry",
    "WhatsApp Sri Lanka tours",
    "Colombo travel agent",
    "abaceylon@gmail.com",
    "+94722554488",
  ],
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Aba Ceylon Tours & Travels | Plan Your Sri Lanka Holiday",
    description:
      "Share your travel idea with our Colombo team and we'll craft your perfect Sri Lanka itinerary — route, vehicle, stays, and activities.",
    url: `${BASE_URL}/contact`,
    images: [
      {
        url: `${BASE_URL}/android-chrome-512x512.webp`,
        width: 512,
        height: 512,
        alt: "Contact Aba Ceylon Tours & Travels",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Contact Aba Ceylon Tours | Plan Your Sri Lanka Trip",
    description:
      "WhatsApp, call, or email our Colombo team to start planning your Sri Lanka holiday.",
    images: [`${BASE_URL}/android-chrome-512x512.webp`],
  },
};
