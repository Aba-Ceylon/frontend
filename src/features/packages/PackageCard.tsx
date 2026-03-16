"use client";

import { PackageItem, usePackageStore } from "@/store/PackageStore";
import Image from "next/image";

type PackageCardProps = {
  pkg: PackageItem;
};

export default function PackageCard({ pkg }: PackageCardProps) {
  const selectedPackage = usePackageStore((state) => state.selectedPackage);
  const setSelectedPackage = usePackageStore(
    (state) => state.setSelectedPackage,
  );

  const isSelected = selectedPackage?.id === pkg.id;

  return (
    <div
      className={`rounded-[0.2rem] overflow-hidden border shadow-md bg-white transition hover:shadow-xl ${
        isSelected
          ? "border-slate-800/95 ring-2 ring-slate-900/95"
          : "border-neutral-200"
      }`}
    >
      <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full">
        <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />
      </div>

      <div className="p-3 sm:p-4 md:p-5">
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-cinzel text-neutral-900 mb-1 sm:mb-2">
          {pkg.id.toUpperCase()}
        </h3>

        <p className="font-cinzel text-xs sm:text-sm text-amber-700 font-medium mb-1 sm:mb-2">
          {pkg.duration}
        </p>

        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-cinzel text-neutral-900 mb-1 sm:mb-2">
          {pkg.title}
        </h3>

        <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3">{pkg.route.join(" • ")}</p>

        <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3">{pkg.km} KM</p>

        <p className="text-xs sm:text-sm text-neutral-700 leading-5 sm:leading-6 mb-3 sm:mb-5">{pkg.summary}</p>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedPackage(pkg)}
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 font-cinzel rounded-lg bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md text-white hover:bg-amber-700 transition cursor-pointer"
          >
            {isSelected ? "Requested" : "Request Package"}
          </button>

          <button className="font-cinzel text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-neutral-300 text-neutral-800 hover:bg-neutral-50 transition cursor-pointer">
            View Package
          </button>
        </div>
      </div>
    </div>
  );
}
