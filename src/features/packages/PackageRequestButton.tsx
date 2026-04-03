"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import RequestBookingDialog from "@/components/booking/RequestBookingDialog";
import { buildPackageRequestMessage } from "@/lib/packages/buildPackageRequestMessage";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";
import { usePackageStore } from "@/store/PackageStore";
import type { PackageItem } from "@/types/package";

interface PackageRequestButtonProps {
  pkg: PackageItem;
  className: string;
  requestedClassName?: string;
  label?: string;
  requestedLabel?: string;
}

export default function PackageRequestButton({
  pkg,
  className,
  requestedClassName,
  label = "Request Package",
  requestedLabel = "Requested",
}: PackageRequestButtonProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const { selectedPackage, setSelectedPackage } = usePackageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [dateUnknown, setDateUnknown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isRequested = selectedPackage?.id === pkg.id;
  const isUserSignedIn = Boolean(isSignedIn);

  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(pathname || "/packages")}`;
  const adminWhatsAppNumber =
    process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";

  const handleOpen = () => {
    setBookingDate("");
    setDateUnknown(false);
    setErrorMessage("");
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setBookingDate("");
    setDateUnknown(false);
    setErrorMessage("");
  };

  const handleConfirm = () => {
    if (!dateUnknown && !bookingDate) {
      setErrorMessage(
        "Please confirm the preferred date or choose no idea about date.",
      );
      return;
    }

    const travelerName =
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ");
    const travelerEmail = user?.primaryEmailAddress?.emailAddress || "";

    const href = generateWhatsAppLink(
      adminWhatsAppNumber,
      buildPackageRequestMessage(pkg, {
        bookingDate: dateUnknown ? null : bookingDate,
        dateUnknown,
        travelerName,
        travelerEmail,
      }),
    );

    setSelectedPackage(pkg);
    handleClose();
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const buttonClassName =
    isRequested && requestedClassName ? requestedClassName : className;

  return (
    <>
      <button type="button" onClick={handleOpen} className={buttonClassName}>
        {isRequested ? requestedLabel : label}
      </button>

      <RequestBookingDialog
        isOpen={isOpen}
        isLoaded={isLoaded}
        isSignedIn={isUserSignedIn}
        signInHref={signInHref}
        subjectName={pkg.title}
        subjectType="package"
        allowUnknownDate
        bookingDate={bookingDate}
        dateUnknown={dateUnknown}
        errorMessage={errorMessage}
        onBookingDateChange={(value) => {
          setBookingDate(value);
          if (value) {
            setDateUnknown(false);
          }
          setErrorMessage("");
        }}
        onDateUnknownToggle={() => {
          setDateUnknown((current) => {
            const nextValue = !current;
            if (nextValue) {
              setBookingDate("");
            }
            return nextValue;
          });
          setErrorMessage("");
        }}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}
