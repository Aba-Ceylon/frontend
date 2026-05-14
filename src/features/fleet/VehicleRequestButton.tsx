"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useI18n } from "@/components/i18n/I18nProvider";
import RequestBookingDialog from "@/components/booking/RequestBookingDialog";
import { buildVehicleRequestMessage } from "@/lib/fleet/buildVehicleRequestMessage";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";
import type { FleetVehicle } from "@/types/vehicle";

interface VehicleRequestButtonProps {
  vehicle: FleetVehicle;
  className: string;
}

export default function VehicleRequestButton({ vehicle, className }: VehicleRequestButtonProps) {
  const { t } = useI18n();
  const { user, isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const isUserSignedIn = Boolean(isSignedIn);

  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(pathname || `/fleet/${vehicle.id}`)}`;
  const adminWhatsAppNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";

  const handleConfirm = () => {
    if (!bookingDate) {
      setErrorMessage(t("booking.selectBookingDate"));
      return;
    }

    const travelerName =
      user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ");
    const travelerEmail = user?.primaryEmailAddress?.emailAddress || "";

    const href = generateWhatsAppLink(
      adminWhatsAppNumber,
      buildVehicleRequestMessage(vehicle, { bookingDate, travelerName, travelerEmail }),
    );

    setIsOpen(false);
    setErrorMessage("");
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setBookingDate(""); setErrorMessage(""); setIsOpen(true); }}
        className={className}
      >
        {t("fleet.requestVehicle")}
      </button>

      <RequestBookingDialog
        isOpen={isOpen}
        isLoaded={isLoaded}
        isSignedIn={isUserSignedIn}
        signInHref={signInHref}
        subjectName={vehicle.name}
        subjectType="vehicle"
        bookingDate={bookingDate}
        dateUnknown={false}
        errorMessage={errorMessage}
        onBookingDateChange={(value) => { setBookingDate(value); setErrorMessage(""); }}
        onDateUnknownToggle={() => undefined}
        onClose={() => { setIsOpen(false); setBookingDate(""); setErrorMessage(""); }}
        onConfirm={handleConfirm}
      />
    </>
  );
}
