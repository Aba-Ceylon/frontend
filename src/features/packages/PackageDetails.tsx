"use client";

import Image from "next/image";
import { Car, CheckCircle, Clock, MapPin, Route } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { useI18n } from "@/components/i18n/I18nProvider";
import PackageRequestButton from "@/features/packages/PackageRequestButton";
import type { PackageItem } from "@/types/package";
import PackageTimeline from "./PackageTimeline";

function StatCard({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <Card
      variant="white"
      className={`flex items-center gap-3 p-4 ${className}`}
    >
      {icon}
      <div>
        <p className="font-cinzel text-xs text-[#1A2238]">{label}</p>
        <p className="font-cinzel text-sm font-medium text-[#1A2238]">
          {value}
        </p>
      </div>
    </Card>
  );
}

export default function PackageDetails({ pkg }: { pkg: PackageItem }) {
  const { t } = useI18n();
  const routeLabel = pkg.route.join(" | ");

  return (
    <div className="min-h-screen bg-[#F8F4ED]">
      <div className="relative h-72 w-full sm:h-96">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 mx-auto flex max-w-5xl flex-col justify-end p-6 sm:p-10">
          <Badge variant="amber" className="mb-2 w-fit">
            {pkg.duration}
          </Badge>
          <h1 className="font-cinzel text-3xl font-medium text-white sm:text-5xl">
            {pkg.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Clock size={18} className="text-amber-700" />}
            label={t("packages.duration")}
            value={pkg.duration}
          />
          <StatCard
            icon={<Route size={18} className="text-amber-700" />}
            label={t("packages.distance")}
            value={t("packages.distanceKm", { km: pkg.km })}
          />
          <StatCard
            icon={<MapPin size={18} className="text-amber-700" />}
            label={t("packages.route")}
            value={routeLabel}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        <section>
          <h2 className="mb-4 font-cinzel text-2xl text-neutral-900">
            {t("packages.overview")}
          </h2>
          <p className="leading-7 text-neutral-700">{pkg.overview}</p>
        </section>

        <section>
          <h2 className="mb-6 font-cinzel text-2xl text-neutral-900">
            {t("packages.itinerary")}
          </h2>
          <PackageTimeline itinerary={pkg.itinerary} />
        </section>

        <section>
          <h2 className="mb-4 font-cinzel text-2xl text-neutral-900">
            {t("packages.includedServices")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {pkg.includedServices.map((service) => (
              <Card
                key={service}
                variant="white"
                className="flex items-start gap-3 p-3"
              >
                <CheckCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-green-600"
                />
                <span className="text-sm text-neutral-700">{service}</span>
              </Card>
            ))}
          </div>
        </section>

        {pkg.recommendedVehicle ? (
          <section>
            <h2 className="mb-4 font-cinzel text-2xl text-neutral-900">
              {t("packages.recommendedVehicle")}
            </h2>
            <Card variant="white" className="flex items-start gap-4 p-5">
              <Car size={28} className="mt-1 shrink-0 text-amber-700" />
              <div>
                <p className="mb-1 font-cinzel text-lg text-neutral-900">
                  {pkg.recommendedVehicle.type}
                </p>
                <p className="text-sm text-neutral-600">
                  {pkg.recommendedVehicle.description}
                </p>
              </div>
            </Card>
          </section>
        ) : null}

        <PackageRequestButton
          pkg={pkg}
          className="cursor-pointer rounded bg-neutral-900 px-6 py-3 font-cinzel text-sm text-white transition hover:bg-neutral-700"
          label={t("packages.requestThisPackage")}
        />
      </div>
    </div>
  );
}
