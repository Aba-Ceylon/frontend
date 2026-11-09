"use client";

import Link from "next/link";
import { ArrowUpRight, Car, Check, Clock, MapPin, Route } from "lucide-react";
import PackageRequestButton from "@/features/packages/PackageRequestButton";
import { buildGoogleMapsRouteUrl } from "@/lib/maps/buildRouteUrl";
import { PackageItem } from "@/types/package";
import { getPackageImages } from "@/lib/packages/packageImages";
import { routes } from "@/constants/routes";
import {
  BookingPanel,
  DetailBody,
  DetailHero,
  DetailSection,
  FactPill,
  GalleryGrid,
} from "@/components/ui/DetailLayout";
import PackageTimeline from "./PackageTimeline";

export default function PackageDetails({ pkg }: { pkg: PackageItem }) {
  const routeMapsHref = buildGoogleMapsRouteUrl(pkg.route);
  const images = getPackageImages(pkg);

  return (
    <div className="min-h-screen">
      <DetailHero
        images={images}
        title={pkg.title}
        eyebrow="Signature journey"
        backHref={routes.packages}
        backLabel="All packages"
      >
        <div className="flex flex-wrap gap-3">
          <FactPill icon={<Clock className="h-4 w-4" />}>{pkg.duration}</FactPill>
          <FactPill icon={<Route className="h-4 w-4" />}>{pkg.km} km</FactPill>
          <FactPill icon={<MapPin className="h-4 w-4" />}>
            {pkg.route.length} stops
          </FactPill>
        </div>
      </DetailHero>

      <DetailBody
        aside={
          <BookingPanel kicker="Private journey" title="Make this trip yours.">
            <dl className="space-y-3 border-y border-white/12 py-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Duration</dt>
                <dd>{pkg.duration}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">Distance</dt>
                <dd>{pkg.km} km</dd>
              </div>
              {pkg.recommendedVehicle ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-white/60">Vehicle</dt>
                  <dd className="text-right">{pkg.recommendedVehicle.type}</dd>
                </div>
              ) : null}
            </dl>
            <PackageRequestButton
              pkg={pkg}
              className="mt-6 w-full cursor-pointer bg-[#e2c27a] px-5 py-4 font-cinzel text-xs uppercase tracking-[0.22em] text-[#0d141e] transition hover:bg-white"
              label="Request this journey"
            />
            <Link
              href={routes.customizeJourneys}
              className="nudge-arrow mt-3 flex items-center justify-center gap-2 border border-white/25 px-5 py-4 font-cinzel text-xs uppercase tracking-[0.22em] text-white transition hover:border-[#e2c27a] hover:text-[#e2c27a]"
            >
              Customize instead <ArrowUpRight className="h-4 w-4" />
            </Link>
            <p className="mt-5 text-xs leading-5 text-white/55">
              No payment until you have reviewed the final plan.
            </p>
          </BookingPanel>
        }
      >
        <DetailSection kicker="Overview" title="The journey at a glance">
          <p className="max-w-3xl text-base leading-8 text-[#182231]/72 sm:text-lg sm:leading-9">
            {pkg.overview}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {pkg.route.map((stop, index) => (
              <span key={`${stop}-${index}`} className="inline-flex items-center gap-2">
                <span className="rounded-full border border-[#182231]/12 bg-white px-4 py-2 text-sm text-[#182231]">
                  {stop}
                </span>
                {index < pkg.route.length - 1 ? (
                  <span className="h-px w-4 bg-[#c99a2b]" aria-hidden="true" />
                ) : null}
              </span>
            ))}
          </div>
          {routeMapsHref ? (
            <a
              href={routeMapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link mt-6 text-[#9b7422] hover:text-[#182231]"
            >
              View route on Google Maps
            </a>
          ) : null}
        </DetailSection>

        {pkg.itinerary.length ? (
          <DetailSection kicker="Day by day" title="Your itinerary">
            <PackageTimeline itinerary={pkg.itinerary} />
          </DetailSection>
        ) : null}

        {pkg.includedServices.length ? (
        <DetailSection kicker="Included" title="What's taken care of">
          <ul className="grid gap-3 sm:grid-cols-2">
            {pkg.includedServices.map((service) => (
              <li key={service} className="flex items-start gap-3 border border-[#182231]/8 bg-white px-5 py-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c99a2b]/15 text-[#9b7422]">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-[15px] leading-6 text-[#182231]/80">{service}</span>
              </li>
            ))}
          </ul>
        </DetailSection>
        ) : null}

        {pkg.recommendedVehicle ? (
          <DetailSection kicker="On the road" title="Recommended vehicle">
            <div className="flex items-start gap-5 border border-[#182231]/8 bg-white p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ivory)] text-[#9b7422]">
                <Car className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-cinzel text-xl text-[#182231]">{pkg.recommendedVehicle.type}</p>
                <p className="mt-2 text-[15px] leading-7 text-[#182231]/68">{pkg.recommendedVehicle.description}</p>
              </div>
            </div>
          </DetailSection>
        ) : null}

        <DetailSection
          kicker="Gallery"
          title="Along the way"
          aside={<p className="text-sm text-[#182231]/55">{images.length} photos</p>}
        >
          <GalleryGrid images={images} title={pkg.title} />
        </DetailSection>
      </DetailBody>
    </div>
  );
}
