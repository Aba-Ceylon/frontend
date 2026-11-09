import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Compass, MapPin } from "lucide-react";
import { routes } from "@/constants/routes";
import { fetchDestinationBySlug } from "@/services/destinationService";
import DestinationGuideBook from "@/features/destinations/DestinationGuideBook";
import { destinations } from "@/data/destinations";
import LocationMap from "@/components/maps/LocationMap";
import { getGalleryImages } from "@/lib/packages/packageImages";
import PackageImageCarousel from "@/features/packages/PackageImageCarousel";
import { SectionKicker } from "@/components/ui/Teardrop";
import { DetailSection, GalleryGrid } from "@/components/ui/DetailLayout";

const BASE_URL = "https://www.abaceylontours.com";
const FALLBACK_IMAGE = "/images/heritage/sl-image.webp";

export const revalidate = 3600;

// Prerender the same slugs the sitemap advertises so every submitted URL is a
// static page rather than a per-request Supabase fetch.
export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await fetchDestinationBySlug(slug);

  if (!destination) {
    return {
      title: "Destination Not Found",
      description: "The requested Sri Lanka destination could not be found.",
    };
  }

  return {
    title: `${destination.name} | Sri Lanka Destination Guide`,
    description: destination.description.slice(0, 160),
    alternates: {
      canonical: `${BASE_URL}${routes.destinations}/${destination.slug}`,
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = await fetchDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const image = destination.images?.[0] || FALLBACK_IMAGE;
  const galleryImages = getGalleryImages({ image, images: destination.images });

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-[var(--navy-deep)] pt-28">
        <div className="absolute inset-0" data-parallax-root>
          <PackageImageCarousel images={galleryImages} title={destination.name} variant="hero" entityLabel="destination" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,10,0.22)_0%,rgba(5,7,10,0.02)_35%,rgba(5,7,10,0.18)_58%,rgba(5,7,10,0.88)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,10,0.28)_0%,transparent_55%)]" />

        <div className="pointer-events-none relative mx-auto w-full max-w-[1360px] px-6 pb-24 sm:pb-28 lg:px-10">
          <Link
            href={routes.destinations}
            className="pointer-events-auto inline-flex items-center gap-2 font-cinzel text-[10px] uppercase tracking-[0.2em] text-white/80 transition hover:text-[#e2c27a]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All destinations
          </Link>
          <SectionKicker tone="dark" className="mt-8">
            {destination.category} · Sri Lanka
          </SectionKicker>
          <h1 className="mt-3 max-w-5xl font-cinzel text-[clamp(2.9rem,8vw,7.5rem)] leading-[0.92] text-white [text-wrap:balance]">
            {destination.name}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/82 sm:text-base sm:leading-8">
            {destination.summary}
          </p>
        </div>
      </section>

      <section className="relative bg-[var(--ivory)]">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <div className="grid border-b border-[#182231]/12 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
            <div className="py-12 sm:py-16 lg:border-r lg:border-[#182231]/12 lg:pr-14" data-reveal>
              <SectionKicker>Know before you go</SectionKicker>
              <h2 className="mt-4 max-w-3xl font-cinzel text-3xl leading-[1.12] text-[#182231] sm:text-4xl">
                A closer look at {destination.name}
              </h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#182231]/68 sm:text-base">
                {destination.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={routes.planner}
                  className="nudge-arrow inline-flex min-h-12 items-center justify-center gap-3 bg-[#182231] px-7 py-3 font-cinzel text-[11px] uppercase tracking-[0.2em] text-white transition hover:bg-[#9b7422]"
                >
                  Add to my journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={routes.contact}
                  className="inline-flex min-h-12 items-center justify-center border border-[#182231]/20 px-7 py-3 font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#182231] transition hover:border-[#9b7422] hover:text-[#9b7422]"
                >
                  Ask a local planner
                </Link>
              </div>
            </div>

            <div className="grid divide-y divide-[#182231]/12 py-4 lg:py-8 lg:pl-10" data-reveal>
              <div className="grid grid-cols-[42px_1fr] gap-4 py-6">
                <Compass className="mt-0.5 h-5 w-5 text-[#9b7422]" />
                <div>
                  <p className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#182231]/48">Travel region</p>
                  <p className="mt-2 font-cinzel text-lg leading-7 text-[#182231]">{destination.region}</p>
                </div>
              </div>
              <div className="grid grid-cols-[42px_1fr] gap-4 py-6">
                <MapPin className="mt-0.5 h-5 w-5 text-[#9b7422]" />
                <div>
                  <p className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#182231]/48">District</p>
                  <p className="mt-2 font-cinzel text-lg leading-7 text-[#182231]">{destination.district}</p>
                  <p className="mt-1 text-sm leading-6 text-[#182231]/58">{destination.province}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end" data-reveal>
            <div>
              <SectionKicker>Find your way</SectionKicker>
              <h2 className="mt-4 font-cinzel text-3xl text-[#182231] sm:text-4xl">
                {destination.name}, Sri Lanka
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#182231]/62">
              Explore the precise location before adding it to your route.
            </p>
          </div>
          <div className="overflow-hidden border border-[#182231]/12 shadow-[0_20px_60px_rgba(15,23,42,0.10)]" data-reveal>
            <LocationMap
              coordinates={destination.coordinates}
              title={destination.name}
              zoom={11}
              className="h-[340px] w-full sm:h-[460px]"
            />
          </div>
        </div>
      </section>

      <DestinationGuideBook
        destinationName={destination.name}
        bestTimeToVisit={destination.bestTimeToVisit}
        whyVisit={destination.whyVisit}
        highlights={destination.highlights}
      />

      <section className="bg-[var(--ivory)] py-16 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
          <DetailSection
            kicker="Gallery"
            title={`${destination.name} in pictures`}
            aside={<p className="text-sm text-[#182231]/55">{galleryImages.length} photos</p>}
          >
            <GalleryGrid images={galleryImages} title={destination.name} />
          </DetailSection>
        </div>
      </section>

      <section className="bg-[var(--ivory)] px-6 pb-20 lg:px-10 lg:pb-28">
        <div className="mx-auto max-w-[1360px]">
            <div className="bg-[var(--navy-deep)] p-8 text-white shadow-[0_30px_70px_-30px_rgba(13,20,30,0.6)] sm:p-12" data-reveal>
              <SectionKicker tone="dark">Route planning note</SectionKicker>
              <p className="mt-5 max-w-3xl font-cinzel text-xl leading-9 text-white/90 sm:text-2xl sm:leading-10">
                The best version of {destination.name} depends on what surrounds
                it. We use this stop as part of a paced private route, not as an
                isolated checklist item.
              </p>
              <Link
                href={routes.destinations}
                className="nudge-arrow mt-8 inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.2em] text-[#e2c27a] transition hover:text-white"
              >
                Back to all destinations
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
