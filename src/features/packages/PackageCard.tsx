"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, Map, Route } from "lucide-react";
import PackageRequestButton from "@/features/packages/PackageRequestButton";
import { buildGoogleMapsRouteUrl } from "@/lib/maps/buildRouteUrl";
import { usePackageStore } from "@/store/PackageStore";
import type { PackageItem } from "@/types/package";
import { getPackageImages } from "@/lib/packages/packageImages";
import PackageImageCarousel from "./PackageImageCarousel";

export default function PackageCard({ pkg }: { pkg: PackageItem }) {
  const selectedPackage = usePackageStore((s) => s.selectedPackage);
  const isSelected = selectedPackage?.id === pkg.id;
  const routeMapsHref = buildGoogleMapsRouteUrl(pkg.route);
  const images = getPackageImages(pkg);
  const detailHref = `/packages/${pkg.id}`;

  const packageLabel = pkg.packageId
    ? `Journey ${String(pkg.packageId).padStart(2, "0")}`
    : "Curated journey";

  return (
    <article
      className={`card-lift card-zoom group flex h-full flex-col overflow-hidden border bg-white ${
        isSelected ? "border-[#182231] ring-2 ring-[#182231]" : "border-[#182231]/10 hover:border-[#c99a2b]/50"
      }`}
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#182231]" data-spotlight>
        <PackageImageCarousel images={images} title={pkg.title} variant="card" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0d141e]/85 via-[#0d141e]/10 to-transparent" />

        <p className="pointer-events-none absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#0d141e]/45 px-3.5 py-1.5 font-cinzel text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
          <Clock className="h-3 w-3 text-[#e2c27a]" aria-hidden="true" />
          {pkg.duration}
        </p>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
          <p className="font-cinzel text-[11px] uppercase tracking-[0.24em] text-[#e2c27a]">
            {packageLabel}
          </p>
          <h3 className="mt-2 font-cinzel text-2xl leading-tight text-white [text-wrap:balance] sm:text-3xl">
            {pkg.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {routeMapsHref ? (
          <a
            href={routeMapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-start gap-2 text-xs uppercase leading-6 tracking-[0.18em] text-[#9b7422] transition hover:text-[#182231]"
          >
            <Map size={14} className="mt-1 shrink-0" aria-hidden="true" />
            <span>{pkg.route.join(" · ")}</span>
          </a>
        ) : (
          <p className="text-xs uppercase leading-6 tracking-[0.18em] text-[#9b7422]">
            {pkg.route.join(" · ")}
          </p>
        )}

        <p className="mt-4 line-clamp-3 text-[15px] leading-7 text-[#182231]/70">{pkg.summary}</p>

        <div className="mt-auto pt-7">
          <div className="flex items-center justify-between border-t border-[#182231]/10 pt-5">
            <p className="inline-flex items-center gap-2 text-sm text-[#182231]/70">
              <Route className="h-4 w-4 text-[#9b7422]" aria-hidden="true" />
              {pkg.km} km route
            </p>
            <Link
              href={detailHref}
              className="inline-flex items-center gap-3 font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#182231] transition-colors hover:text-[#9b7422]"
            >
              View journey
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#182231]/15 transition-colors duration-300 group-hover:border-[#182231] group-hover:bg-[#182231] group-hover:text-white">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </div>

          <PackageRequestButton
            pkg={pkg}
            className="mt-5 w-full cursor-pointer bg-[#182231] px-4 py-3.5 font-cinzel text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-[#9b7422]"
          />
        </div>
      </div>
    </article>
  );
}
