"use client";

import { useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface RequestBookingDialogProps {
  isOpen: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  subjectName: string;
  subjectType: "package" | "vehicle";
  signInHref: string;
  allowUnknownDate?: boolean;
  bookingDate: string;
  dateUnknown: boolean;
  errorMessage: string;
  onBookingDateChange: (value: string) => void;
  onDateUnknownToggle: () => void;
  onClose: () => void;
  onConfirm: () => void;
}

function getTodayDateString() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export default function RequestBookingDialog({
  isOpen,
  isLoaded,
  isSignedIn,
  subjectName,
  subjectType,
  signInHref,
  allowUnknownDate = false,
  bookingDate,
  dateUnknown = false,
  errorMessage,
  onBookingDateChange,
  onDateUnknownToggle,
  onClose,
  onConfirm,
}: RequestBookingDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const title = subjectType === "package" ? "Request Package" : "Request Vehicle";

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-[#08111d]/68 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[#0F172A] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <p className="font-cinzel text-xs uppercase tracking-[0.28em] text-amber-300/80">
            Secure Booking
          </p>
          <h3 className="mt-2 font-cinzel text-2xl text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/72">{subjectName}</p>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          {!isLoaded ? (
            <p className="text-sm leading-6 text-white/72">Checking account status...</p>
          ) : !isSignedIn ? (
            <>
              <p className="text-sm leading-7 text-white/72">
                Please sign in to send a {subjectType} request to ABA Ceylon.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={signInHref}
                  className="inline-flex flex-1 items-center justify-center rounded-md bg-amber-400/60 px-5 py-3 font-cinzel text-sm uppercase tracking-[0.18em] text-white transition hover:bg-amber-400/75"
                >
                  Sign In
                </Link>
                <Button variant="ghost" fullWidth onClick={onClose} className="flex-1">
                  Close
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm leading-7 text-white/72">
                Confirm your preferred booking date before we open WhatsApp.
              </p>

              <div className="space-y-3">
                <Input
                  dark
                  label="Preferred Booking Date"
                  type="date"
                  min={getTodayDateString()}
                  value={bookingDate}
                  onChange={(e) => onBookingDateChange(e.target.value)}
                  disabled={allowUnknownDate && dateUnknown}
                />

                {allowUnknownDate ? (
                  <Button
                    variant={dateUnknown ? "secondary" : "ghost"}
                    size="sm"
                    onClick={onDateUnknownToggle}
                  >
                    {dateUnknown ? "Date Will Be Decided Later" : "No Idea About Date"}
                  </Button>
                ) : null}
              </div>

              {errorMessage ? (
                <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {errorMessage}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" fullWidth onClick={onConfirm} className="flex-1">
                  Continue to WhatsApp
                </Button>
                <Button variant="ghost" fullWidth onClick={onClose} className="flex-1">
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
