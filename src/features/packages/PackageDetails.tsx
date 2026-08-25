"use client";

import Image from "next/image";
import { MapPin, Clock, Route, Car, CheckCircle, ExternalLink } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PackageRequestButton from "@/features/packages/PackageRequestButton";
import { buildGoogleMapsRouteUrl } from "@/lib/maps/buildRouteUrl";
import { PackageItem } from "@/types/package";
import { getPackageImages } from "@/lib/packages/packageImages";
import PackageTimeline from "./PackageTimeline";
import PackageImageCarousel from "./PackageImageCarousel";

function StatCard({
  icon,
  label,
  value,
  className = "",
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
  href?: string;
}) {
  const cardContent = (
    <>
      {icon}
      <div className="min-w-0">
        <p className="text-xs text-[#1A2238] font-cinzel">{label}</p>
        <p className="text-sm text-[#1A2238] font-medium font-cinzel">{value}</p>
      </div>
      {href ? (
        <ExternalLink size={14} className="ml-auto shrink-0 text-amber-700/60" aria-hidden="true" />
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label}: ${value} — view route on Google Maps`}
        className={className}
      >
        <Card
          variant="white"
          className="flex h-full items-center gap-3 p-4 transition hover:border-[#A97B17]/50 hover:shadow-[0_18px_42px_rgba(169,123,23,0.1)]"
        >
          {cardContent}
        </Card>
      </a>
    );
  }

  return (
    <Card variant="white" className={`flex items-center gap-3 p-4 ${className}`}>
      {cardContent}
    </Card>
  );
}

export default function PackageDetails({ pkg }: { pkg: PackageItem }) {
  const routeLabel = pkg.route.join(" → ");
  const routeMapsHref = buildGoogleMapsRouteUrl(pkg.route);
  const images = getPackageImages(pkg);

  return (
    <div className="bg-[#F8F4ED] min-h-screen">
      <div className="relative h-72 sm:h-96 w-full">
        <PackageImageCarousel images={images} title={pkg.title} variant="hero" />
        <div className="pointer-events-none absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-5xl mx-auto">
          <Badge variant="amber" className="mb-2 w-fit">{pkg.duration}</Badge>
          <h1 className="font-cinzel text-3xl sm:text-5xl text-white font-medium">{pkg.title}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard icon={<Clock size={18} className="text-amber-700" />} label="Duration" value={pkg.duration} />
          <StatCard icon={<Route size={18} className="text-amber-700" />} label="Distance" value={`${pkg.km} KM`} />
          <StatCard icon={<MapPin size={18} className="text-amber-700" />} label="Route" value={routeLabel} className="col-span-2 sm:col-span-1" href={routeMapsHref ?? undefined} />
        </div>

        <section>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-4">Overview</h2>
          <p className="text-neutral-700 leading-7">{pkg.overview}</p>
        </section>

        <section aria-labelledby="package-gallery-title">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-cinzel text-[11px] uppercase tracking-[0.24em] text-[#A97B17]">Package images</p>
              <h2 id="package-gallery-title" className="mt-1 font-cinzel text-2xl text-neutral-900">Journey gallery</h2>
            </div>
            <p className="text-sm text-neutral-600">
              {images.length} {images.length === 1 ? "image" : "images"} in travel order
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {images.map((image, index) => (
              <figure key={`${image}-${index}`} className="group relative aspect-[4/3] overflow-hidden bg-[#101A28]">
                <Image
                  src={image}
                  alt={`${pkg.title} — gallery image ${index + 1} of ${images.length}`}
                  fill
                  sizes="(max-width: 639px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pb-4 pt-12 font-cinzel text-[11px] uppercase tracking-[0.2em] text-white">
                  Image {String(index + 1).padStart(2, "0")}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-6">Day-by-Day Itinerary</h2>
          <PackageTimeline itinerary={pkg.itinerary} />
        </section>

        <section>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-4">Included Services</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {pkg.includedServices.map((service) => (
              <Card key={service} variant="white" className="flex items-start gap-3 p-3">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-neutral-700">{service}</span>
              </Card>
            ))}
          </div>
        </section>

        {pkg.recommendedVehicle ? (
          <section>
            <h2 className="font-cinzel text-2xl text-neutral-900 mb-4">Recommended Vehicle</h2>
            <Card variant="white" className="flex items-start gap-4 p-5">
              <Car size={28} className="text-amber-700 flex-shrink-0 mt-1" />
              <div>
                <p className="font-cinzel text-lg text-neutral-900 mb-1">{pkg.recommendedVehicle.type}</p>
                <p className="text-sm text-neutral-600">{pkg.recommendedVehicle.description}</p>
              </div>
            </Card>
          </section>
        ) : null}

        <PackageRequestButton
          pkg={pkg}
          className="rounded bg-neutral-900 px-6 py-3 font-cinzel text-sm text-white transition cursor-pointer hover:bg-neutral-700"
          label="Request This Package"
        />
      </div>
    </div>
  );
}
