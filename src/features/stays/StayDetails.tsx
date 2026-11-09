"use client";

import Link from "next/link";
import { Check, MapPin, MessageCircle, Tag, User } from "lucide-react";
import {
  formatSriLankanPhoneNumber,
  normalizeSriLankanPhoneNumber,
} from "@/lib/phone/sriLankanPhoneNumber";
import { getGalleryImages } from "@/lib/packages/packageImages";
import { Stay } from "@/types/stay";
import { routes } from "@/constants/routes";
import {
  BookingPanel,
  DetailBody,
  DetailHero,
  DetailSection,
  FactPill,
  GalleryGrid,
} from "@/components/ui/DetailLayout";
import StayLocationMap from "./StayLocationMap";

export default function StayDetails({ stay }: { stay: Stay }) {
  const mapsHref = stay.coordinates
    ? `https://www.google.com/maps?q=${stay.coordinates.latitude},${stay.coordinates.longitude}`
    : null;
  const whatsappDigits = stay.ownerWhatsAppNumber
    ? normalizeSriLankanPhoneNumber(stay.ownerWhatsAppNumber)
    : "";
  const images = getGalleryImages(stay);
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits.replace(/^\+/, "")}`
    : null;

  return (
    <div className="min-h-screen">
      <DetailHero
        images={images}
        title={stay.name}
        eyebrow={stay.category}
        backHref={routes.stays}
        backLabel="All stays"
        entityLabel="stay"
      >
        <div className="flex flex-wrap gap-3">
          <FactPill icon={<MapPin className="h-4 w-4" />}>{stay.location}</FactPill>
          <FactPill icon={<Tag className="h-4 w-4" />}>{stay.category}</FactPill>
        </div>
      </DetailHero>

      <DetailBody
        aside={
          <BookingPanel kicker="Stay here" title="Talk to the host.">
            <dl className="space-y-3 border-y border-white/12 py-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="inline-flex items-center gap-2 text-white/60">
                  <User className="h-3.5 w-3.5" /> Host
                </dt>
                <dd className="text-right">{stay.ownerName || "Available on request"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="inline-flex items-center gap-2 text-white/60">
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </dt>
                <dd className="text-right">
                  {stay.ownerWhatsAppNumber
                    ? formatSriLankanPhoneNumber(stay.ownerWhatsAppNumber)
                    : "Available on request"}
                </dd>
              </div>
            </dl>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 bg-[#e2c27a] px-5 py-4 font-cinzel text-xs uppercase tracking-[0.22em] text-[#0d141e] transition hover:bg-white"
              >
                <MessageCircle className="h-4 w-4" />
                Message on WhatsApp
              </a>
            ) : (
              <Link
                href={routes.contact}
                className="mt-6 flex w-full items-center justify-center gap-2 bg-[#e2c27a] px-5 py-4 font-cinzel text-xs uppercase tracking-[0.22em] text-[#0d141e] transition hover:bg-white"
              >
                <MessageCircle className="h-4 w-4" />
                Ask us about this stay
              </Link>
            )}
            {mapsHref ? (
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 border border-white/25 px-5 py-4 font-cinzel text-xs uppercase tracking-[0.22em] text-white transition hover:border-[#e2c27a] hover:text-[#e2c27a]"
              >
                <MapPin className="h-4 w-4" />
                Open in Google Maps
              </a>
            ) : null}
          </BookingPanel>
        }
      >
        <DetailSection kicker="About" title="About this stay">
          <p className="max-w-3xl text-base leading-8 text-[#182231]/72 sm:text-lg sm:leading-9">
            {stay.description}
          </p>
        </DetailSection>

        {stay.amenities.length ? (
          <DetailSection kicker="Amenities" title="What's here">
            <ul className="grid gap-3 sm:grid-cols-2">
              {stay.amenities.map((amenity) => (
                <li key={amenity} className="flex items-start gap-3 border border-[#182231]/8 bg-white px-5 py-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c99a2b]/15 text-[#9b7422]">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="text-[15px] leading-6 text-[#182231]/80">{amenity}</span>
                </li>
              ))}
            </ul>
          </DetailSection>
        ) : null}

        <DetailSection
          kicker="Gallery"
          title="A look inside"
          aside={<p className="text-sm text-[#182231]/55">{images.length} photos</p>}
        >
          <GalleryGrid images={images} title={stay.name} />
        </DetailSection>

        <StayLocationMap stay={stay} />
      </DetailBody>
    </div>
  );
}
