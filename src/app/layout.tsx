import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import NavBar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";
import { LoaderGateProvider } from "../components/home/LoaderGate";
import GatedShell from "../components/home/GatedShell";
import ChatbotWidget from "../features/chatbot/ChatbotWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ─── Base URL ─────────────────────────────────────────────────────────────── */
const SITE_URL = "https://www.abaceylontours.com";

/* ─── Root Metadata ─────────────────────────────────────────────────────────
   Every page can override individual fields via its own `export const metadata`.
   These values serve as the global defaults / fallbacks.
────────────────────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  /* ── Core ─────────────────────────────────────────────────────────────── */
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Aba Ceylon Tours & Travels | Sri Lanka Travel Packages, Stays & Chauffeur Fleet",
    template: "%s | Aba Ceylon Tours & Travels",
  },
  description:
    "Plan your perfect Sri Lanka holiday with Aba Ceylon Tours & Travels. Curated travel packages, heritage stays, chauffeur-driven fleet hire, and bespoke itineraries across Colombo, Sigiriya, Kandy, Galle, and beyond.",

  /* ── Keywords (broad + long-tail + multilingual intent) ────────────────── */
  keywords: [
    // English – core intent
    "Sri Lanka tours",
    "Sri Lanka travel packages",
    "Sri Lanka holiday packages",
    "Sri Lanka vacation",
    "Sri Lanka tour operator",
    "best tours Sri Lanka",
    // Accommodation
    "accommodation in Sri Lanka",
    "hotels Sri Lanka",
    "heritage stays Sri Lanka",
    "luxury resorts Sri Lanka",
    "boutique hotels Sri Lanka",
    "where to stay in Sri Lanka",
    // Vehicle hire
    "car hire Sri Lanka",
    "vehicle hire Sri Lanka",
    "chauffeur Sri Lanka",
    "private driver Sri Lanka",
    "taxi Sri Lanka",
    "van hire Sri Lanka",
    "minivan hire Sri Lanka",
    "airport transfer Sri Lanka",
    "Sri Lanka driver hire",
    "chauffeur driven car Sri Lanka",
    // Destinations
    "Colombo tours",
    "Sigiriya day trip",
    "Kandy tours",
    "Galle Fort tour",
    "Ella Sri Lanka",
    "Yala safari Sri Lanka",
    "Mirissa whale watching",
    "Nuwara Eliya tea plantation tour",
    // Brand
    "Aba Ceylon",
    "ABA Ceylon Tours",
    "abaceylontours.com",
    // Geo-specific (languages / markets)
    "Sri Lanka reizen",         // Dutch
    "Sri Lanka Urlaub",         // German
    "voyage Sri Lanka",         // French
    "viaggi Sri Lanka",         // Italian
    "viaje Sri Lanka",          // Spanish
    "alquiler coche Sri Lanka", // Spanish – car hire
    "Sri Lanka Mietwagen",      // German – car hire
    "location voiture Sri Lanka", // French – car hire
    "斯里兰卡旅游",               // Simplified Chinese
    "スリランカ ツアー",           // Japanese
    "스리랑카 여행",              // Korean
  ],

  /* ── Canonical / Locale ────────────────────────────────────────────────── */
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": `${SITE_URL}`,
      "en-GB": `${SITE_URL}`,
      "de-DE": `${SITE_URL}`,
      "fr-FR": `${SITE_URL}`,
      "zh-CN": `${SITE_URL}`,
      "ja-JP": `${SITE_URL}`,
      "ko-KR": `${SITE_URL}`,
      "nl-NL": `${SITE_URL}`,
      "it-IT": `${SITE_URL}`,
    },
  },

  /* ── Open Graph ─────────────────────────────────────────────────────────── */
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Aba Ceylon Tours & Travels",
    title:
      "Aba Ceylon Tours & Travels | Sri Lanka Travel Packages, Stays & Fleet",
    description:
      "Your trusted Sri Lanka travel partner. Bespoke tour packages, hand-picked heritage stays, and premium chauffeur-driven vehicles across the whole island.",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Aba Ceylon Tours – Sri Lanka travel packages, stays & chauffeur fleet",
      },
    ],
  },

  /* ── Twitter / X Card ───────────────────────────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title:
      "Aba Ceylon Tours & Travels | Sri Lanka Packages, Stays & Chauffeur Fleet",
    description:
      "Plan your perfect Sri Lanka holiday. Curated tours, heritage stays, and premium chauffeur fleet across the island.",
    images: [`${SITE_URL}/og-image.jpg`],
    site: "@AbaCeylonTours",
    creator: "@AbaCeylonTours",
  },

  /* ── Search Engine Directives ───────────────────────────────────────────── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Verification (replace placeholder tokens after domain setup) ────────── */
  verification: {
    google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_VERIFICATION_TOKEN",
    // yandex: "REPLACE_WITH_YANDEX_TOKEN",
    // bing verified via BingWebmasterTools HTML-tag or DNS; add below if needed
    other: {
      "msvalidate.01": "REPLACE_WITH_BING_VERIFICATION_TOKEN",
    },
  },

  /* ── App / PWA metadata ─────────────────────────────────────────────────── */
  applicationName: "Aba Ceylon Tours & Travels",
  authors: [{ name: "Aba Ceylon Tours & Travels", url: SITE_URL }],
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "travel",
};

/* ─── Organisation JSON-LD structured data ──────────────────────────────────
   Placed once in the root layout so it appears on every page.
   Helps Google understand the business entity (Knowledge Panel eligibility).
────────────────────────────────────────────────────────────────────────────── */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": `${SITE_URL}/#organization`,
  name: "Aba Ceylon Tours & Travels",
  alternateName: "ABA Ceylon",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/LOGO.jpeg`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/og-image.jpg`,
  description:
    "Aba Ceylon Tours & Travels is a Sri Lanka-based travel company offering curated tour packages, heritage accommodation stays, and premium chauffeur-driven vehicle hire across the island.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Colombo",
    addressCountry: "LK",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+94-72-255-4488",
      contactType: "customer service",
      availableLanguage: ["English", "Sinhala", "Tamil"],
      areaServed: "LK",
    },
    {
      "@type": "ContactPoint",
      email: "abaceylon@gmail.com",
      contactType: "customer support",
    },
  ],
  sameAs: [
    "https://www.facebook.com/abaceylonaours",
    "https://www.instagram.com/abaceylonaours",
    "https://www.tripadvisor.com/abaceylonaours",
    "https://www.linkedin.com/company/abaceylonaours",
  ],
  priceRange: "$$",
  currenciesAccepted: "USD, EUR, GBP, LKR",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
  areaServed: {
    "@type": "Country",
    name: "Sri Lanka",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Sri Lanka Travel Services",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Sri Lanka Tour Packages",
        url: `${SITE_URL}/packages`,
        description:
          "Handcrafted multi-day Sri Lanka tour packages covering heritage sites, hill country, wildlife, and beaches.",
      },
      {
        "@type": "Offer",
        name: "Heritage Stays in Sri Lanka",
        url: `${SITE_URL}/stays`,
        description:
          "Curated accommodation across eco lodges, boutique hotels, luxury resorts, and safari camps in Sri Lanka.",
      },
      {
        "@type": "Offer",
        name: "Chauffeur-Driven Vehicle Hire",
        url: `${SITE_URL}/fleet`,
        description:
          "Premium chauffeured vehicles — sedans, SUVs, vans and more — for private transfers and touring across Sri Lanka.",
      },
    ],
  },
};

/* ─── Website JSON-LD ───────────────────────────────────────────────────────
   Enables a Sitelinks Search Box in Google results.
────────────────────────────────────────────────────────────────────────────── */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Aba Ceylon Tours & Travels",
  description:
    "Sri Lanka tour packages, heritage stays, and chauffeur fleet hire.",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/packages?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "en-US",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <LoaderGateProvider>
            <GatedShell navbar={<NavBar />} footer={<Footer />}>
              {children}
            </GatedShell>
            <ChatbotWidget />
          </LoaderGateProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
