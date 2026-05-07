"use client";

import Image from "next/image";
import { CheckCircle, MapPin, Phone, Tag, User } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { useI18n } from "@/components/i18n/I18nProvider";
import type { Stay } from "@/types/stay";
import StayLocationMap from "./StayLocationMap";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card variant="white" className="flex items-center gap-3 p-4">
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

export default function StayDetails({ stay }: { stay: Stay }) {
  const { t } = useI18n();
  const mapsHref = stay.coordinates
    ? `https://www.google.com/maps?q=${stay.coordinates.latitude},${stay.coordinates.longitude}`
    : null;
  const whatsappDigits = stay.ownerWhatsAppNumber?.replace(/[^\d+]/g, "") ?? "";
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits.replace(/^\+/, "")}`
    : null;

  return (
    <div className="min-h-screen bg-[#F8F4ED]">
      <div className="relative h-72 w-full sm:h-96">
        <Image
          src={stay.image}
          alt={stay.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 mx-auto flex max-w-5xl flex-col justify-end p-6 sm:p-10">
          <Badge variant="amber" className="mb-2 w-fit">
            {stay.category}
          </Badge>
          <h1 className="font-cinzel text-3xl font-medium text-white sm:text-5xl">
            {stay.name}
          </h1>
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            icon={<Tag size={18} className="text-amber-700" />}
            label={t("stays.category")}
            value={stay.category}
          />
          <StatCard
            icon={<User size={18} className="text-amber-700" />}
            label={t("stays.owner")}
            value={stay.ownerName || t("common.availableOnRequest")}
          />
        </div>

        <StayLocationMap stay={stay} />

        <section>
          <h2 className="mb-4 font-cinzel text-2xl text-neutral-900">
            {t("stays.about")}
          </h2>
          <p className="leading-7 text-neutral-700">{stay.description}</p>
        </section>

        <section>
          <h2 className="mb-4 font-cinzel text-2xl text-neutral-900">
            {t("stays.amenities")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {stay.amenities.map((amenity) => (
              <Card
                key={amenity}
                variant="white"
                className="flex items-start gap-3 p-3"
              >
                <CheckCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-green-600"
                />
                <span className="text-sm text-neutral-700">{amenity}</span>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Card variant="white" className="min-w-[220px] p-5">
            <p className="mb-1 font-cinzel text-xs text-neutral-500">
              {t("stays.whatsappContact")}
            </p>
            <p className="font-cinzel text-xl font-medium text-neutral-900 break-all">
              {stay.ownerWhatsAppNumber || t("common.availableOnRequest")}
            </p>
          </Card>
          <div className="flex flex-col gap-3 sm:flex-row">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded bg-neutral-900 px-6 py-3 font-cinzel text-sm text-white transition hover:bg-amber-700"
              >
                <Phone size={16} />
                {t("stays.contactWhatsApp")}
              </a>
            ) : null}
            {mapsHref ? (
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded border border-neutral-300 px-6 py-3 font-cinzel text-sm text-neutral-900 transition hover:bg-white"
              >
                <MapPin size={16} />
                {t("stays.viewOnMap")}
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
