import type { Metadata } from "next";
import Script from "next/script";
import PackageDetails from "@/features/packages/PackageDetails";
import { fetchPackageBySlug } from "@/services/packageService";
import { notFound } from "next/navigation";

const BASE_URL = "https://www.abaceylontours.com";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

/* ── Dynamic Metadata ────────────────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await fetchPackageBySlug(slug);

  if (!pkg) {
    return {
      title: "Package Not Found",
      description: "The requested Sri Lanka travel package could not be found.",
    };
  }

  const title = `${pkg.title} | ${pkg.duration} Sri Lanka Tour Package`;
  const description = pkg.overview?.slice(0, 160) || pkg.summary;
  const canonicalUrl = `${BASE_URL}/packages/${slug}`;
  const image = pkg.image?.startsWith("http")
    ? pkg.image
    : `${BASE_URL}${pkg.image}`;

  return {
    title,
    description,
    keywords: [
      `${pkg.title} Sri Lanka`,
      `${pkg.duration} Sri Lanka tour`,
      ...(pkg.route ?? []).map((stop) => `${stop} Sri Lanka tour`),
      "Sri Lanka tour package",
      "Sri Lanka private tour",
      "chauffeur tour Sri Lanka",
      "bespoke Sri Lanka holiday",
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: pkg.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  const pkg = await fetchPackageBySlug(slug);
  if (!pkg) notFound();

  const canonicalUrl = `${BASE_URL}/packages/${slug}`;
  const image = pkg.image?.startsWith("http")
    ? pkg.image
    : `${BASE_URL}${pkg.image}`;

  /* ── TourPackage / Product JSON-LD ─────────────────────────────────────── */
  const tourJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.overview || pkg.summary,
    url: canonicalUrl,
    image,
    provider: {
      "@type": "TravelAgency",
      name: "Aba Ceylon Tours & Travels",
      url: BASE_URL,
      telephone: "+94722554488",
    },
    touristType: ["Family", "Couple", "Solo"],
    itinerary: {
      "@type": "ItemList",
      itemListElement: (pkg.itinerary ?? []).map((day, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `Day ${day.day}: ${day.title}`,
        description: day.description,
      })),
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      seller: {
        "@type": "TravelAgency",
        name: "Aba Ceylon Tours & Travels",
      },
    },
    ...(pkg.route?.length
      ? {
          containsPlace: pkg.route.map((place) => ({
            "@type": "Place",
            name: place,
            address: { "@type": "PostalAddress", addressCountry: "LK" },
          })),
        }
      : {}),
  };

  return (
    <>
      <Script
        id={`tour-jsonld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourJsonLd) }}
      />
      <PackageDetails pkg={pkg} />
    </>
  );
}

