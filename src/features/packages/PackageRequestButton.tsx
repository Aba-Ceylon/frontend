"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import PackageRequestDialog from "@/components/booking/PackageRequestDialog";
import { buildPackageRequestMessage } from "@/lib/packages/buildPackageRequestMessage";
import {
  DEFAULT_PACKAGE_REQUEST,
  validatePackageRequestDates,
  validatePackageRequestParty,
} from "@/lib/packages/packageRequest";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";
import { usePackageStore } from "@/store/PackageStore";
import type { PackageItem } from "@/types/package";
import type { PackageRequestDetails } from "@/types/packageRequest";

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
  label,
  requestedLabel,
}: PackageRequestButtonProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const { selectedPackage, setSelectedPackage } = usePackageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState<PackageRequestDetails>(DEFAULT_PACKAGE_REQUEST);
  const [step, setStep] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);
  const isRequested = selectedPackage?.id === pkg.id;
  const isUserSignedIn = Boolean(isSignedIn);

  const resolvedLabel = label ?? "Request Package";
  const resolvedRequestedLabel = requestedLabel ?? "Requested";

  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(pathname || "/packages")}`;
  const adminWhatsAppNumber =
    process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";

  const handleOpen = () => {
    setDetails(DEFAULT_PACKAGE_REQUEST);
    setStep(0);
    setIssues([]);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIssues([]);
  };

  const handleConfirm = () => {
    const validationIssues = [
      ...validatePackageRequestDates(details),
      ...validatePackageRequestParty(details),
    ];
    if (validationIssues.length) {
      setIssues(validationIssues);
      setStep(validationIssues.some((issue) => issue.toLowerCase().includes("date") || issue.toLowerCase().includes("arrival") || issue.toLowerCase().includes("departure") || issue.toLowerCase().includes("chauffeur")) ? 0 : 1);
      return;
    }

    const travelerName =
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ");
    const travelerEmail = user?.primaryEmailAddress?.emailAddress || "";

    const href = generateWhatsAppLink(
      adminWhatsAppNumber,
      buildPackageRequestMessage(pkg, {
        details,
        travelerName,
        travelerEmail,
      }),
    );

    setSelectedPackage(pkg);
    handleClose();
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const handleStepChange = (nextStep: number) => {
    const validationIssues =
      step === 0
        ? validatePackageRequestDates(details)
        : step === 1
          ? validatePackageRequestParty(details)
          : [];
    if (nextStep > step && validationIssues.length) {
      setIssues(validationIssues);
      return;
    }
    setIssues([]);
    setStep(nextStep);
  };

  const handleChange = <K extends keyof PackageRequestDetails>(
    key: K,
    value: PackageRequestDetails[K],
  ) => {
    setDetails((current) => ({ ...current, [key]: value }));
    setIssues([]);
  };

  const buttonClassName =
    isRequested && requestedClassName ? requestedClassName : className;

  return (
    <>
      <button type="button" onClick={handleOpen} className={buttonClassName}>
        {isRequested ? resolvedRequestedLabel : resolvedLabel}
      </button>

      <PackageRequestDialog
        isOpen={isOpen}
        isLoaded={isLoaded}
        isSignedIn={isUserSignedIn}
        signInHref={signInHref}
        packageTitle={pkg.title}
        packageRoute={pkg.route}
        packageDuration={pkg.duration}
        details={details}
        step={step}
        issues={issues}
        onChange={handleChange}
        onStepChange={handleStepChange}
        onClose={handleClose}
        onSubmit={handleConfirm}
      />
    </>
  );
}
