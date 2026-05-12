"use client";

import Image from "next/image";
import { MapPin, Clock, Route, Car, CheckCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PackageRequestButton from "@/features/packages/PackageRequestButton";
import { PackageItem } from "@/types/package";
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
    <Card variant="white" className={`flex items-center gap-3 p-4 ${className}`}>
      {icon}
      <div>
        <p className="text-xs text-[#1A2238] font-cinzel">{label}</p>
        <p className="text-sm text-[#1A2238] font-medium font-cinzel">{value}</p>
      </div>
    </Card>
  );
}

export default function PackageDetails({ pkg }: { pkg: PackageItem }) {
  const routeLabel = pkg.route.join(" → ");

  return (
    <div className="bg-[#F8F4ED] min-h-screen">
      <div className="relative h-72 sm:h-96 w-full">
        <Image src={pkg.image} alt={pkg.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-5xl mx-auto">
          <Badge variant="amber" className="mb-2 w-fit">{pkg.duration}</Badge>
          <h1 className="font-cinzel text-3xl sm:text-5xl text-white font-medium">{pkg.title}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard icon={<Clock size={18} className="text-amber-700" />} label="Duration" value={pkg.duration} />
          <StatCard icon={<Route size={18} className="text-amber-700" />} label="Distance" value={`${pkg.km} KM`} />
          <StatCard icon={<MapPin size={18} className="text-amber-700" />} label="Route" value={routeLabel} className="col-span-2 sm:col-span-1" />
        </div>

        <section>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-4">Overview</h2>
          <p className="text-neutral-700 leading-7">{pkg.overview}</p>
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
