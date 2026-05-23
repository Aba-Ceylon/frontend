import type { Metadata } from "next";
import Script from "next/script";
import StayDetails from "@/features/stays/StayDetails";
import { fetchStayBySlug } from "@/services/stayService";
import { notFound } from "next/navigation";

const BASE_URL = "https://www.abaceylontours.com";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stay = await fetchStayBySlug(slug);

  if (!stay) return { title: "Stay Not Found" };

  const title = `${stay.name} – ${stay.location} | ${stay.category} Sri Lanka`;
  const description =
    `${stay.description} Located in ${stay.location}, Sri Lanka. From $${stay.pricePerNight}/night. Amenities: ${(stay.amenities ?? []).join(", ")}.`.slice(0, 160);
  const canonicalUrl = `${BASE_URL}/stays/${slug}`;

  return {
    title,
    description,
    keywords: [
      `${stay.name}`,
      `${stay.location} hotel Sri Lanka`,
      `${stay.category} Sri Lanka`,
      `accommodation ${stay.location} Sri Lanka`,
      "Sri Lanka luxury stay",
      "heritage accommodation Sri Lanka",
    ],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: stay.image ? [{ url: stay.image, width: 800, height: 600, alt: stay.name }] : [],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function StayPage({ params }: Props) {
  const { slug } = await params;
  const stay = await fetchStayBySlug(slug);
  if (!stay) notFound();

  const canonicalUrl = `${BASE_URL}/stays/${slug}`;

  const lodgingJsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: stay.name,
    description: stay.description,
    url: canonicalUrl,
    image: stay.image,
    priceRange: `$${stay.pricePerNight}/night`,
    starRating: { "@type": "Rating", ratingValue: stay.rating, bestRating: "5" },
    address: {
      "@type": "PostalAddress",
      addressLocality: stay.location,
      addressCountry: "LK",
    },
    amenityFeature: (stay.amenities ?? []).map((a: string) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    isPartOf: {
      "@type": "TravelAgency",
      name: "Aba Ceylon Tours & Travels",
      url: BASE_URL,
    },
  };

  return (
    <>
      <Script
        id={`stay-jsonld-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd) }}
      />
      <StayDetails stay={stay} />
    </>
  );
}

