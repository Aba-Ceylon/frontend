"use client";

import {
  useCallback,
  useMemo,
  useReducer,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import { SectionKicker, TeardropWatermark } from "@/components/ui/Teardrop";
import { formatSriLankanPhoneNumber } from "@/lib/phone/sriLankanPhoneNumber";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

const ADMIN_PHONE =
  process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";
const ADMIN_EMAIL = "abaceylon@gmail.com";
const SWITZER = {
  fontFamily: 'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
};

function buildMessage(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  return [
    "Hello Aba Ceylon,",
    "",
    "I would like to plan my Sri Lanka journey with you.",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    "",
    "Enquiry:",
    data.message,
  ].join("\n");
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
};

type FormAction = { field: keyof FormState; value: string | boolean };

function formReducer(state: FormState, action: FormAction): FormState {
  return { ...state, [action.field]: action.value };
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
};

const INPUT_CLS =
  "w-full border border-[#182231]/14 bg-[var(--ivory)] px-5 py-3.5 text-[15px] text-[#182231] outline-none transition placeholder:text-[#182231]/40 hover:border-[#182231]/30 focus:border-[#c99a2b] focus:bg-white focus:ring-4 focus:ring-[#c99a2b]/12";

export default function ContactPage() {
  const [form, dispatch] = useReducer(formReducer, INITIAL);
  const [error, setError] = useReducer((_: string, value: string) => value, "");

  const formattedPhone = useMemo(() => formatSriLankanPhoneNumber(ADMIN_PHONE), []);
  const whatsappHref = useMemo(
    () =>
      generateWhatsAppLink(
        ADMIN_PHONE,
        buildMessage({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        }),
      ),
    [form.email, form.message, form.name, form.phone],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = event.target;
      const nextValue =
        type === "checkbox" && event.target instanceof HTMLInputElement
          ? event.target.checked
          : value;
      dispatch({ field: name as keyof FormState, value: nextValue });
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.phone.trim() ||
        !form.message.trim()
      ) {
        setError("Please complete all required details before sending your enquiry.");
        return;
      }
      if (!form.consent) {
        setError("Please confirm that Aba Ceylon can contact you about this enquiry.");
        return;
      }
      setError("");
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
    },
    [form, whatsappHref],
  );

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      <section className="relative overflow-hidden bg-[var(--navy-deep)] px-6 pb-20 pt-36 text-white lg:px-10 lg:pb-24 lg:pt-44">
        <TeardropWatermark className="absolute -right-12 top-16 w-[260px] text-[#e2c27a]/[0.08] sm:w-[360px]" />
        <div className="relative mx-auto max-w-[1360px]">
          <div className="hero-rise">
            <SectionKicker tone="dark">Contact</SectionKicker>
          </div>
          <h1 className="hero-rise mt-5 font-cinzel text-5xl leading-[1.05] sm:text-7xl" style={{ animationDelay: "0.1s" }}>
            Get in touch.
          </h1>
          <p className="hero-rise mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg" style={{ ...SWITZER, animationDelay: "0.2s" }}>
            Tell us your dates and ideas. We usually reply within a few hours.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[minmax(0,1.05fr)_380px]">
          <form onSubmit={handleSubmit} className="border border-[#182231]/10 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(13,20,30,0.35)] sm:p-8 lg:p-12" data-reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block font-cinzel text-xs uppercase tracking-[0.14em] text-[#182231]/72">
                  Your name
                </span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={INPUT_CLS}
                  style={SWITZER}
                />
              </label>
              <label className="block">
                <span className="mb-2 block font-cinzel text-xs uppercase tracking-[0.14em] text-[#182231]/72">
                  Your email
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className={INPUT_CLS}
                  style={SWITZER}
                />
              </label>
            </div>

            <div className="mt-4">
              <label className="block">
                <span className="mb-2 block font-cinzel text-xs uppercase tracking-[0.14em] text-[#182231]/72">
                  Your phone
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your phone"
                  className={INPUT_CLS}
                  style={SWITZER}
                />
              </label>
            </div>

            <div className="mt-4">
              <label className="block">
                <span className="mb-2 block font-cinzel text-xs uppercase tracking-[0.14em] text-[#182231]/72">
                  Route notes
                </span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={9}
                  placeholder="Dates, group size and places you want to see."
                  className={`${INPUT_CLS} py-4`}
                  style={SWITZER}
                />
              </label>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3 border border-[#182231]/10 px-4 py-4 transition hover:border-[#c99a2b]/50">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-[#9b7422]"
              />
              <span className="text-sm leading-6 text-[#182231]/68" style={SWITZER}>
                Aba Ceylon may contact me by WhatsApp, phone, or email about
                this enquiry.
              </span>
            </label>

            {error ? (
              <p className="mt-4 border border-red-400/30 bg-red-50 px-4 py-3 text-sm text-red-700" style={SWITZER}>
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" variant="secondary" size="lg">
                Submit enquiry
              </Button>
              <p className="text-sm text-[#182231]/58" style={SWITZER}>
                Opens in WhatsApp.
              </p>
            </div>
          </form>

          <div className="space-y-6">
            <div className="relative overflow-hidden bg-[var(--navy-deep)] p-8 text-white shadow-[0_30px_70px_-30px_rgba(13,20,30,0.6)] lg:sticky lg:top-28" data-reveal>
              <SectionKicker tone="dark">Direct contact</SectionKicker>
              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-[#e2c27a]" />
                  <div>
                    <p className="font-cinzel text-xs uppercase tracking-[0.14em] text-white/58">
                      Phone
                    </p>
                    <a href={`tel:${ADMIN_PHONE}`} className="mt-1 block text-lg text-white transition hover:text-[#e2c27a]">
                      {formattedPhone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-[#e2c27a]" />
                  <div>
                    <p className="font-cinzel text-xs uppercase tracking-[0.14em] text-white/58">
                      Email
                    </p>
                    <a href={`mailto:${ADMIN_EMAIL}`} className="mt-1 block break-all text-lg text-white transition hover:text-[#e2c27a]">
                      {ADMIN_EMAIL}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-[#e2c27a]" />
                  <div>
                    <p className="font-cinzel text-xs uppercase tracking-[0.14em] text-white/58">
                      Based in
                    </p>
                    <p className="mt-1 text-lg text-white">Colombo, Sri Lanka</p>
                  </div>
                </div>
              </div>
              <Link
                href={generateWhatsAppLink(
                  ADMIN_PHONE,
                  "Hello Aba Ceylon, I would like to enquire about planning my Sri Lanka trip.",
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-8 block bg-[#e2c27a] px-5 py-4 text-center font-cinzel text-xs uppercase tracking-[0.2em] text-[#0d141e] transition hover:bg-white"
              >
                Chat on WhatsApp
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
