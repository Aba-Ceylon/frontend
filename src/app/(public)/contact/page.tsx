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
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

const ADMIN_PHONE =
  process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";
const ADMIN_EMAIL = "abaceylon@gmail.com";
const SWITZER = {
  fontFamily: 'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif',
};

function formatPhone(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length === 10 && digits.startsWith("0")) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("94")) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (phone.startsWith("+")) {
    return phone;
  }
  return `+${digits}`;
}

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
  "w-full border border-[#182231]/14 bg-white px-5 py-3 text-[15px] text-[#182231] outline-none transition focus:border-[#C99A2B] focus:ring-2 focus:ring-[#C99A2B]/15";

export default function ContactPage() {
  const [form, dispatch] = useReducer(formReducer, INITIAL);
  const [error, setError] = useReducer((_: string, value: string) => value, "");

  const formattedPhone = useMemo(() => formatPhone(ADMIN_PHONE), []);
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
    <main className="min-h-screen bg-white">
      <section className="border-b border-[#182231]/10 bg-white px-6 pb-16 pt-32 lg:px-10 lg:pt-36">
        <div className="mx-auto grid max-w-[1360px] gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-[#C99A2B]">
              Travel concierge
            </p>
            <h1 className="mt-4 font-cinzel text-5xl leading-[1.02] text-[#182231] sm:text-6xl lg:text-[4.5rem]">
              Start the conversation properly.
            </h1>
            <p
              className="mt-6 max-w-2xl text-base leading-8 text-[#182231]/66"
              style={SWITZER}
            >
              Send your dates, route ideas, and stay preferences. The enquiry is
              structured to save time and open directly into a WhatsApp message
              to the team.
            </p>
          </div>

          <div className="border border-[#182231] bg-[#182231] px-6 py-7 text-white" data-reveal>
            <p className="font-cinzel text-[11px] uppercase tracking-[0.18em] text-[#C99A2B]">
              Typical response
            </p>
            <p className="mt-4 font-cinzel text-3xl text-white sm:text-4xl">
              Within a few hours
            </p>
            <p className="mt-4 text-sm leading-7 text-white/72" style={SWITZER}>
              Route questions, stay guidance, and planning advice are handled by
              a local team, not a generic booking desk.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[minmax(0,1.05fr)_380px]">
          <form onSubmit={handleSubmit} className="border border-[#182231]/10 bg-white p-6 sm:p-8 lg:p-10" data-reveal>
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
                  placeholder="Tell us about your dates, group size, route ideas, and the kind of journey you want."
                  className="w-full border border-[#182231]/14 bg-white px-5 py-4 text-[15px] text-[#182231] outline-none transition focus:border-[#C99A2B] focus:ring-2 focus:ring-[#C99A2B]/15"
                  style={SWITZER}
                />
              </label>
            </div>

            <label className="mt-4 flex items-start gap-3 border border-[#182231]/10 px-4 py-4">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-[#182231]"
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
                This opens as a pre-filled WhatsApp message.
              </p>
            </div>
          </form>

          <div className="space-y-6">
            <div className="border border-[#182231] bg-[#182231] p-7 text-white" data-reveal>
              <p className="font-cinzel text-[11px] uppercase tracking-[0.18em] text-[#C99A2B]">
                Direct contact
              </p>
              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-[#C99A2B]" />
                  <div>
                    <p className="font-cinzel text-xs uppercase tracking-[0.14em] text-white/58">
                      Phone
                    </p>
                    <a href={`tel:${ADMIN_PHONE}`} className="mt-1 block text-lg text-white">
                      {formattedPhone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-[#C99A2B]" />
                  <div>
                    <p className="font-cinzel text-xs uppercase tracking-[0.14em] text-white/58">
                      Email
                    </p>
                    <a href={`mailto:${ADMIN_EMAIL}`} className="mt-1 block text-lg text-white break-all">
                      {ADMIN_EMAIL}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-[#C99A2B]" />
                  <div>
                    <p className="font-cinzel text-xs uppercase tracking-[0.14em] text-white/58">
                      Based in
                    </p>
                    <p className="mt-1 text-lg text-white">Colombo, Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#182231]/10 bg-white p-7" data-reveal>
              <p className="font-cinzel text-[11px] uppercase tracking-[0.18em] text-[#C99A2B]">
                Prefer a faster start?
              </p>
              <p className="mt-4 text-sm leading-7 text-[#182231]/66" style={SWITZER}>
                Skip the form and open a direct WhatsApp conversation with your
                basic travel details already filled in.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={generateWhatsAppLink(
                    ADMIN_PHONE,
                    "Hello Aba Ceylon, I would like to enquire about planning my Sri Lanka trip.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[#182231] bg-[#182231] px-5 py-3 text-center font-cinzel text-xs uppercase tracking-[0.14em] text-white transition hover:bg-[#243142]"
                >
                  Start on WhatsApp
                </Link>
                <Link href="/planner" className="editorial-link text-[#182231]">
                  Open the planner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
