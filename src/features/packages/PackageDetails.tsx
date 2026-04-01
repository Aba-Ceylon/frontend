"use client";

import Image from "next/image";
import { PackageItem } from "@/types/package";
import PackageTimeline from "./PackageTimeline";
import { usePackageStore } from "@/store/PackageStore";
import { MapPin, Clock, Route, Car, CheckCircle } from "lucide-react";

export default function PackageDetails({ pkg }: { pkg: PackageItem }) {
  const { selectedPackage, setSelectedPackage } = usePackageStore();
  const isSelected = selectedPackage?.id === pkg.id;
  const routeLabel = pkg.route.join(" -> ");

  return (
    <div className="bg-[#F8F4ED] min-h-screen">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 w-full">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-5xl mx-auto">
          <p className="font-cinzel text-amber-400 text-sm mb-1">
            {pkg.duration}
          </p>
          <h1 className="font-cinzel text-3xl sm:text-5xl text-white font-medium">
            {pkg.title}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-white rounded p-4 shadow-sm">
            <Clock size={18} className="text-amber-700" />
            <div>
              <p className="text-xs text-[#1A2238] font-cinzel">Duration</p>
              <p className="text-sm text-[#1A2238] font-medium font-cinzel">
                {pkg.duration}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded p-4 shadow-sm">
            <Route size={18} className="text-amber-700" />
            <div>
              <p className="text-xs text-[#1A2238] font-cinzel">Distance</p>
              <p className="text-sm text-[#1A2238] font-medium font-cinzel">
                {pkg.km} KM
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded p-4 shadow-sm col-span-2 sm:col-span-1">
            <MapPin size={18} className="text-amber-700" />
            <div>
              <p className="text-xs text-[#1A2238] font-cinzel">Route</p>
              <p className="text-sm text-[#1A2238] font-medium font-cinzel">
                {routeLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <section>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-4">
            Overview
          </h2>
          <p className="text-neutral-700 leading-7">{pkg.overview}</p>
        </section>

        {/* Itinerary */}
        <section>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-6">
            Day-by-Day Itinerary
          </h2>
          <PackageTimeline itinerary={pkg.itinerary} />
        </section>

        {/* Included Services */}
        <section>
          <h2 className="font-cinzel text-2xl text-neutral-900 mb-4">
            Included Services
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {pkg.includedServices.map((service) => (
              <div
                key={service}
                className="flex items-start gap-3 bg-white rounded p-3 shadow-sm"
              >
                <CheckCircle
                  size={16}
                  className="text-green-600 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm text-neutral-700">{service}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Vehicle */}
        {pkg.recommendedVehicle ? (
          <section>
            <h2 className="font-cinzel text-2xl text-neutral-900 mb-4">
              Recommended Vehicle
            </h2>
            <div className="flex items-start gap-4 bg-white rounded p-5 shadow-sm">
              <Car size={28} className="text-amber-700 flex-shrink-0 mt-1" />
              <div>
                <p className="font-cinzel text-lg text-neutral-900 mb-1">
                  {pkg.recommendedVehicle.type}
                </p>
                <p className="text-sm text-neutral-600">
                  {pkg.recommendedVehicle.description}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* CTA */}
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedPackage(pkg)}
            className="px-6 py-3 font-cinzel text-[0] rounded bg-neutral-900 text-white hover:bg-neutral-700 transition cursor-pointer"
          >
            <span className="text-sm">
              {isSelected ? "Requested" : "Request This Package"}
            </span>
            {isSelected ? "Requested ✓" : "Request This Package"}
          </button>
        </div>
      </div>
    </div>
  );
}
