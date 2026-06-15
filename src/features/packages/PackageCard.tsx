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
      className={`overflow-hidden border-[#101A28]/8 bg-[#fffdf8] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(7,15,28,0.08)] ${
        isSelected ? "border-[#101A28]/70 ring-2 ring-[#101A28]/90" : ""
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[5/4] lg:aspect-[6/5]">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/38 via-transparent to-transparent" />
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="amber">{packageLabel}</Badge>
          <Badge
            variant="amber"
            className="border-amber-200 bg-amber-50 text-amber-700"
          >
            {pkg.duration}
          </Badge>
        </div>

        <h3 className="font-cinzel text-xl leading-snug text-[#101A28]">
          {pkg.title}
        </h3>
        <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#A97B17]/90">
          {pkg.route.join(" | ")}
        </p>
        <p className="mt-4 text-sm leading-7 text-[#3B4654]">{pkg.summary}</p>

        <div className="mt-5 flex items-center justify-between border-t border-[#101A28]/8 pt-4">
          <p className="font-cinzel text-sm tracking-[0.08em] text-[#101A28]">
            {pkg.km} KM route
          </p>
          <Link
            href={`/packages/${pkg.id}`}
            className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#A97B17] transition-colors hover:text-[#101A28]"
          >
            View package
          </Link>
        </div>

        <div className="mt-5">
          <PackageRequestButton
            pkg={pkg}
            className="w-full cursor-pointer bg-[#101A28] px-4 py-3 text-[11px] font-cinzel uppercase tracking-[0.2em] text-white transition hover:bg-[#1A2A40]"
          />
        </div>
      </div>
    </Card>
  );
}
