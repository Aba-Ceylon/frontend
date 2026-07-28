"use client";

import { useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import type {
  AccommodationRequest,
  AccommodationStyle,
  PackageRequestDetails,
  VehicleRequest,
} from "@/types/packageRequest";

interface Props {
  isOpen: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  signInHref: string;
  packageTitle: string;
  packageRoute: string[];
  packageDuration: string;
  details: PackageRequestDetails;
  step: number;
  issues: string[];
  onChange: <K extends keyof PackageRequestDetails>(
    key: K,
    value: PackageRequestDetails[K],
  ) => void;
  onStepChange: (step: number) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const accommodationOptions: Array<{
  value: AccommodationRequest;
  title: string;
  text: string;
}> = [
  { value: "recommend", title: "Recommend for me", text: "The team selects stays that fit this route." },
  { value: "already-arranged", title: "Already arranged", text: "I only need the package transport and support." },
  { value: "not-needed", title: "No accommodation", text: "Do not include stays in this request." },
];

const vehicleOptions: Array<{ value: VehicleRequest; label: string }> = [
  { value: "recommend", label: "Aba Ceylon recommends" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "van", label: "Van" },
  { value: "premium", label: "Premium" },
];

const stayStyles: Array<{ value: AccommodationStyle; label: string }> = [
  { value: "flexible", label: "Best fit" },
  { value: "comfort", label: "Comfort" },
  { value: "boutique", label: "Boutique" },
  { value: "premium", label: "Premium" },
];

function today() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export default function PackageRequestDialog(props: Props) {
  const {
    isOpen, isLoaded, isSignedIn, signInHref, packageTitle, packageRoute,
    packageDuration, details, step, issues, onChange, onStepChange, onClose, onSubmit,
  } = props;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const fieldClass =
    "mt-2 min-h-12 w-full border border-[#182231]/14 bg-white px-4 text-sm text-[#182231] outline-none transition focus:border-[#A97B17]";
  const optionClass = (selected: boolean) =>
    `border p-4 text-left transition ${selected ? "border-[#A97B17] bg-[#fbf7ed]" : "border-[#182231]/12 bg-white hover:border-[#A97B17]/50"}`;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
      <button type="button" className="absolute inset-0 bg-[#08111d]/62 backdrop-blur-sm" onClick={onClose} aria-label="Close package request" />

      <div role="dialog" aria-modal="true" aria-labelledby="package-request-title" className="relative z-10 flex max-h-[94svh] w-full max-w-4xl flex-col overflow-hidden border border-[#182231]/10 bg-[#f6f0e6] shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
        <header className="flex items-start justify-between gap-6 border-b border-[#182231]/10 px-5 py-5 sm:px-8">
          <div>
            <p className="font-cinzel text-[10px] uppercase tracking-[0.24em] text-[#A97B17]">Package travel brief</p>
            <h2 id="package-request-title" className="mt-2 font-cinzel text-2xl text-[#182231] sm:text-3xl">{packageTitle}</h2>
            <p className="mt-2 text-sm text-[#182231]/62">{packageDuration} · {packageRoute.join(" — ")}</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#182231]/12 text-[#182231]" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </header>

        {!isLoaded ? (
          <div className="p-8 text-sm text-[#182231]/65">Checking account status…</div>
        ) : !isSignedIn ? (
          <div className="p-8 sm:p-12">
            <h3 className="font-cinzel text-2xl text-[#182231]">Sign in to prepare your request</h3>
            <p className="mt-3 max-w-xl leading-7 text-[#182231]/65">Your account details help the travel team identify and respond to your package enquiry.</p>
            <Link href={signInHref} className="mt-7 inline-flex min-h-12 items-center bg-[#182231] px-6 font-cinzel text-[11px] uppercase tracking-[0.2em] text-white">Sign in</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 border-b border-[#182231]/10 bg-white/45">
              {["Travel dates", "Trip needs", "Review"].map((label, index) => (
                <div key={label} className={`px-3 py-4 text-center font-cinzel text-[9px] uppercase tracking-[0.14em] sm:text-[10px] ${step === index ? "bg-[#182231] text-white" : index < step ? "text-[#8B6719]" : "text-[#182231]/45"}`}>
                  {index < step ? <Check className="mx-auto mb-1 h-3.5 w-3.5" /> : null}{label}
                </div>
              ))}
            </div>

            <div className="overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              {issues.length ? (
                <div className="mb-6 border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {issues.map((issue) => <p key={issue}>{issue}</p>)}
                </div>
              ) : null}

              {step === 0 ? (
                <div>
                  <h3 className="font-cinzel text-2xl text-[#182231]">When are you travelling?</h3>
                  <p className="mt-2 text-sm leading-6 text-[#182231]/62">Your island stay can be longer than the package. Tell us exactly when the chauffeur is needed.</p>
                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <label className="text-sm text-[#182231]">Arrival in Sri Lanka<input className={fieldClass} type="date" min={today()} value={details.arrivalDate} onChange={(e) => onChange("arrivalDate", e.target.value)} /></label>
                    <label className="text-sm text-[#182231]">Departure from Sri Lanka<input className={fieldClass} type="date" min={details.arrivalDate || today()} value={details.departureDate} onChange={(e) => onChange("departureDate", e.target.value)} /></label>
                    <label className="text-sm text-[#182231]">Chauffeur service starts<input className={fieldClass} type="date" min={details.arrivalDate || today()} max={details.departureDate || undefined} value={details.chauffeurStartDate} onChange={(e) => onChange("chauffeurStartDate", e.target.value)} /></label>
                    <label className="text-sm text-[#182231]">Chauffeur service ends<input className={fieldClass} type="date" min={details.chauffeurStartDate || details.arrivalDate || today()} max={details.departureDate || undefined} value={details.chauffeurEndDate} onChange={(e) => onChange("chauffeurEndDate", e.target.value)} /></label>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[["arrivalTransfer", "Airport pickup on arrival"], ["departureTransfer", "Airport drop-off on departure"]].map(([key, label]) => (
                      <label key={key} className="flex cursor-pointer items-center gap-3 border border-[#182231]/12 bg-white p-4 text-sm">
                        <input type="checkbox" checked={details[key as "arrivalTransfer" | "departureTransfer"]} onChange={(e) => onChange(key as "arrivalTransfer" | "departureTransfer", e.target.checked)} className="h-4 w-4 accent-[#A97B17]" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-cinzel text-2xl text-[#182231]">What should we arrange?</h3>
                    <p className="mt-2 text-sm leading-6 text-[#182231]/62">Give the team enough context to recommend the right stays and vehicle.</p>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {([["adults", "Adults", 1], ["children", "Children", 0], ["luggage", "Bags", 0]] as const).map(([key, label, min]) => (
                        <label key={key} className="text-xs uppercase tracking-[0.12em] text-[#182231]/60">{label}<input className={fieldClass} type="number" min={min} max={30} value={details[key]} onChange={(e) => onChange(key, Number(e.target.value))} /></label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-cinzel text-sm text-[#182231]">Accommodation</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {accommodationOptions.map((option) => (
                        <button key={option.value} type="button" onClick={() => onChange("accommodation", option.value)} className={optionClass(details.accommodation === option.value)}>
                          <span className="font-cinzel text-sm text-[#182231]">{option.title}</span>
                          <span className="mt-2 block text-xs leading-5 text-[#182231]/60">{option.text}</span>
                        </button>
                      ))}
                    </div>
                    {details.accommodation === "recommend" ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {stayStyles.map((style) => <button key={style.value} type="button" onClick={() => onChange("accommodationStyle", style.value)} className={`min-h-10 border px-4 text-xs ${details.accommodationStyle === style.value ? "border-[#A97B17] bg-[#182231] text-white" : "border-[#182231]/12 bg-white text-[#182231]"}`}>{style.label}</button>)}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <p className="font-cinzel text-sm text-[#182231]">Vehicle</p>
                    <p className="mt-1 text-xs text-[#182231]/55">Recommendation uses party size, luggage, route, and road conditions.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {vehicleOptions.map((option) => <button key={option.value} type="button" onClick={() => onChange("vehicle", option.value)} className={`min-h-11 border px-4 text-xs ${details.vehicle === option.value ? "border-[#A97B17] bg-[#182231] text-white" : "border-[#182231]/12 bg-white text-[#182231]"}`}>{option.label}</button>)}
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div>
                  <h3 className="font-cinzel text-2xl text-[#182231]">Review your travel brief</h3>
                  <p className="mt-2 text-sm leading-6 text-[#182231]/62">The route is fixed by the package. Aba Ceylon will confirm availability and recommend anything left open.</p>
                  <div className="mt-6 grid gap-px bg-[#182231]/10 sm:grid-cols-2">
                    {[
                      ["Island stay", `${details.arrivalDate} → ${details.departureDate}`],
                      ["Chauffeur", `${details.chauffeurStartDate} → ${details.chauffeurEndDate}`],
                      ["Travellers", `${details.adults} adult(s), ${details.children} child(ren), ${details.luggage} bag(s)`],
                      ["Accommodation", details.accommodation === "recommend" ? `Recommend · ${details.accommodationStyle}` : details.accommodation.replace("-", " ")],
                      ["Vehicle", details.vehicle === "recommend" ? "Recommend for my group" : details.vehicle],
                      ["Transfers", `${details.arrivalTransfer ? "Arrival pickup" : "No pickup"} · ${details.departureTransfer ? "Departure drop-off" : "No drop-off"}`],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-white p-4"><p className="text-[10px] uppercase tracking-[0.16em] text-[#A97B17]">{label}</p><p className="mt-2 text-sm text-[#182231]">{value}</p></div>
                    ))}
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm text-[#182231]">Arrival flight or pickup location <span className="text-[#182231]/45">(optional)</span><input className={fieldClass} value={details.arrivalReference} onChange={(e) => onChange("arrivalReference", e.target.value)} placeholder="e.g. UL 504 / CMB Airport" /></label>
                    <label className="text-sm text-[#182231]">Departure flight or drop-off location <span className="text-[#182231]/45">(optional)</span><input className={fieldClass} value={details.departureReference} onChange={(e) => onChange("departureReference", e.target.value)} placeholder="e.g. EK 649 / Galle hotel" /></label>
                  </div>
                  <label className="mt-4 block text-sm text-[#182231]">Anything else the team should know? <span className="text-[#182231]/45">(optional)</span><textarea className={`${fieldClass} min-h-24 py-3`} maxLength={500} value={details.notes} onChange={(e) => onChange("notes", e.target.value)} placeholder="Room setup, accessibility, child seats, dietary needs…" /></label>
                </div>
              ) : null}
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-[#182231]/10 bg-white/55 px-5 py-4 sm:px-8">
              <button type="button" onClick={() => step === 0 ? onClose() : onStepChange(step - 1)} className="inline-flex min-h-11 items-center gap-2 px-2 font-cinzel text-[10px] uppercase tracking-[0.16em] text-[#182231]">
                {step > 0 ? <ArrowLeft className="h-4 w-4" /> : null}{step === 0 ? "Cancel" : "Back"}
              </button>
              <button type="button" onClick={() => step === 2 ? onSubmit() : onStepChange(step + 1)} className="inline-flex min-h-12 items-center gap-3 bg-[#182231] px-5 font-cinzel text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-[#283548]">
                {step === 2 ? "Send request on WhatsApp" : "Continue"}<ArrowRight className="h-4 w-4" />
              </button>
            </footer>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
