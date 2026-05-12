"use client";

import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PackageRequestButton from "@/features/packages/PackageRequestButton";
import { usePackageStore } from "@/store/PackageStore";
import type { PackageItem } from "@/types/package";

export default function PackageCard({ pkg }: { pkg: PackageItem }) {
  const selectedPackage = usePackageStore((s) => s.selectedPackage);
  const isSelected = selectedPackage?.id === pkg.id;

  const packageLabel = pkg.packageId
    ? `Package ${String(pkg.packageId).padStart(2, "0")}`
    : "Curated Package";

  return (
    <Card
      variant="white"
      className={`overflow-hidden transition hover:shadow-xl ${
        isSelected ? "ring-2 ring-slate-900/95 border-slate-800/95" : ""
      }`}
    >
      <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-3 sm:p-4 md:p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="amber">{packageLabel}</Badge>
          <Badge variant="amber" className="bg-amber-50 text-amber-700 border-amber-200">{pkg.duration}</Badge>
        </div>

        <h3 className="text-sm sm:text-base md:text-lg font-cinzel text-neutral-900 mb-1">{pkg.title}</h3>
        <p className="text-xs sm:text-sm text-neutral-600 mb-1">{pkg.route.join(" | ")}</p>
        <p className="text-xs sm:text-sm text-neutral-600 mb-2">{pkg.km} KM</p>
        <p className="text-xs sm:text-sm text-neutral-700 leading-5 mb-3 sm:mb-5">{pkg.summary}</p>

        <div className="flex gap-2 sm:gap-3 flex-col xl:flex-row">
          <PackageRequestButton
            pkg={pkg}
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 font-cinzel rounded-lg bg-gradient-to-br from-slate-900/95 to-slate-800/95 text-white hover:opacity-90 transition cursor-pointer"
          />
          <Link
            href={`/packages/${pkg.id}`}
            className="font-cinzel text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-neutral-300 text-neutral-800 hover:bg-neutral-50 transition text-center"
          >
            View Package
          </Link>
        </div>
      </div>
    </Card>
  );
}
