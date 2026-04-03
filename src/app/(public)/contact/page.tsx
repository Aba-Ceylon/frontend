"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

const ADMIN_PHONE =
  process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94770000000";
const ADMIN_EMAIL = "hello@abaceylon.com";

const OPENING_HOURS = [
  { label: "Weekdays", value: "8:00 AM - 5:00 PM (SLST)" },
  { label: "Saturday", value: "9:00 AM - 1:00 PM (SLST)" },
  { label: "Sunday", value: "By prior arrangement" },
];

function formatPhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/[^\d]/g, "");

  if (digits.length === 11 && digits.startsWith("94")) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  if (phoneNumber.startsWith("+")) {
    return phoneNumber;
  }

  return `+${digits}`;
}

function buildEnquiryMessage(details: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  return [
    "Hello ABA Ceylon,",
    "",
    "I would like to plan my Sri Lanka journey with you.",
    "",
    `Name: ${details.name}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone}`,
    "",
    "Enquiry:",
    details.message,
  ].join("\n");
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
  });
  const [error, setError] = useState("");

  const formattedPhone = useMemo(() => formatPhoneNumber(ADMIN_PHONE), []);
  const whatsappHref = useMemo(
    () =>
      generateWhatsAppLink(
        ADMIN_PHONE,
        buildEnquiryMessage({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        }),
      ),
    [form.email, form.message, form.name, form.phone],
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target;
    const checked =
      type === "checkbox" && event.target instanceof HTMLInputElement
        ? event.target.checked
        : false;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.message.trim()
    ) {
      setError(
        "Please complete all required details before sending your enquiry.",
      );
      return;
    }

    if (!form.consent) {
      setError(
        "Please confirm that ABA Ceylon can contact you about this enquiry.",
      );
      return;
    }

    setError("");
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08111d] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/plannerBakcground.jpg')" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,154,43,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,rgba(7,12,22,0.88),rgba(7,12,22,0.98))]" />

      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pt-36">
        <div className="mb-12 max-w-3xl">
          <p className="font-cinzel text-xs uppercase tracking-[0.35em] text-amber-300/75">
            Travel Concierge
          </p>
          <h1 className="mt-4 font-cinzel text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Let&apos;s Plan Your Trip
          </h1>
          <p
            className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg"
            style={{
              fontFamily:
                'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
            }}
          >
            Share your travel idea with ABA Ceylon and our team will guide you
            with the right route, vehicle, stays, and local support for a smooth
            Sri Lanka journey.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span
                    className="mb-2 block text-sm text-white/70"
                    style={{
                      fontFamily:
                        'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                    }}
                  >
                    Your Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full rounded-full border border-white/15 bg-white px-5 py-3 text-[15px] text-slate-900 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20"
                    style={{
                      fontFamily:
                        'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                    }}
                  />
                </label>

                <label className="block">
                  <span
                    className="mb-2 block text-sm text-white/70"
                    style={{
                      fontFamily:
                        'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                    }}
                  >
                    Your Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full rounded-full border border-white/15 bg-white px-5 py-3 text-[15px] text-slate-900 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20"
                    style={{
                      fontFamily:
                        'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                    }}
                  />
                </label>
              </div>

              <label className="block">
                <span
                  className="mb-2 block text-sm text-white/70"
                  style={{
                    fontFamily:
                      'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                  }}
                >
                  Your Phone
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your Phone"
                  className="w-full rounded-full border border-white/15 bg-white px-5 py-3 text-[15px] text-slate-900 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20"
                  style={{
                    fontFamily:
                      'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                  }}
                />
              </label>

              <label className="block">
                <span
                  className="mb-2 block text-sm text-white/70"
                  style={{
                    fontFamily:
                      'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                  }}
                >
                  What&apos;s on your mind?
                </span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={9}
                  placeholder="Tell us about your dates, group size, route ideas, or the style of journey you would like to create."
                  className="w-full rounded-[1.75rem] border border-white/15 bg-white px-5 py-4 text-[15px] text-slate-900 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20"
                  style={{
                    fontFamily:
                      'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                  }}
                />
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-white/20 accent-amber-400"
                />
                <span
                  className="text-sm leading-6 text-white/72"
                  style={{
                    fontFamily:
                      'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                  }}
                >
                  ABA Ceylon may contact me by WhatsApp, phone, or email about
                  this enquiry.
                </span>
              </label>

              {error ? (
                <p
                  className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  style={{
                    fontFamily:
                      'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                  }}
                >
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="rounded-md bg-amber-400/60 px-8 py-3 text-sm text-white drop-shadow-[0_0_30px_rgba(201,154,43,0.5)] transition-all duration-300 hover:bg-amber-400/75"
                >
                  <span className="font-cinzel tracking-[0.18em] uppercase">
                    Submit
                  </span>
                </button>
                <p
                  className="text-sm text-white/55"
                  style={{
                    fontFamily:
                      'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                  }}
                >
                  Your enquiry opens as a pre-filled WhatsApp message to our
                  team.
                </p>
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-[#111c2f]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-8">
              <h2 className="font-cinzel text-3xl text-white sm:text-4xl">
                Call Us
              </h2>
              <p
                className="mt-3 text-base text-white/65"
                style={{
                  fontFamily:
                    'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                }}
              >
                The best call you&apos;ll make for your Sri Lanka journey.
              </p>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href={`tel:${ADMIN_PHONE}`}
                  className="font-cinzel text-3xl text-[#7fd0ff] transition hover:text-white sm:text-4xl"
                >
                  {formattedPhone}
                </Link>
                <Link
                  href={generateWhatsAppLink(
                    ADMIN_PHONE,
                    "Hello ABA Ceylon, I would like to enquire about planning my Sri Lanka trip.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25d366] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                  style={{
                    fontFamily:
                      'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </Link>
              </div>

              <div className="mt-8 space-y-4 text-white/72">
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-amber-300/80" />
                  <div>
                    <p
                      className="text-sm uppercase tracking-[0.22em] text-amber-200/65"
                      style={{
                        fontFamily:
                          'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                      }}
                    >
                      Phone
                    </p>
                    <p
                      className="mt-1 text-base"
                      style={{
                        fontFamily:
                          'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                      }}
                    >
                      {formattedPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-amber-300/80" />
                  <div>
                    <p
                      className="text-sm uppercase tracking-[0.22em] text-amber-200/65"
                      style={{
                        fontFamily:
                          'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                      }}
                    >
                      Email
                    </p>
                    <Link
                      href={`mailto:${ADMIN_EMAIL}`}
                      className="mt-1 block text-base text-[#7fd0ff] transition hover:text-white"
                      style={{
                        fontFamily:
                          'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                      }}
                    >
                      {ADMIN_EMAIL}
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-amber-300/80" />
                  <div>
                    <p
                      className="text-sm uppercase tracking-[0.22em] text-amber-200/65"
                      style={{
                        fontFamily:
                          'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                      }}
                    >
                      Based In
                    </p>
                    <p
                      className="mt-1 text-base"
                      style={{
                        fontFamily:
                          'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                      }}
                    >
                      Colombo, Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-8">
              <h2 className="font-cinzel text-3xl text-white sm:text-4xl">
                Opening Hours
              </h2>
              <p
                className="mt-3 text-base text-white/65"
                style={{
                  fontFamily:
                    'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                }}
              >
                Our Sri Lanka office hours are below. Outside these hours, you
                can still reach us on WhatsApp or email and we&apos;ll reply as
                soon as possible.
              </p>

              <div className="mt-7 space-y-3">
                {OPENING_HOURS.map((slot) => (
                  <div
                    key={slot.label}
                    className="grid gap-3 rounded-2xl bg-white/8 p-4 text-white sm:grid-cols-[0.95fr_1.05fr] sm:items-center"
                  >
                    <p
                      className="text-base"
                      style={{
                        fontFamily:
                          'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                      }}
                    >
                      {slot.label}
                    </p>
                    <p
                      className="text-base text-white/82"
                      style={{
                        fontFamily:
                          'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
                      }}
                    >
                      {slot.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
