"use client";

import { useCallback, useMemo, useReducer, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "+94722554488";
const ADMIN_EMAIL = "abaceylon@gmail.com";
const SWITZER = { fontFamily: 'Switzer, system-ui, -apple-system, "Segoe UI", sans-serif' };

const INPUT_CLS = "w-full rounded-full border border-white/15 bg-white px-5 py-3 text-[15px] text-slate-900 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20";

function formatPhone(p: string) {
  const d = p.replace(/[^\d]/g, "");
  if (d.length === 10 && d.startsWith("0")) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  if (d.length === 11 && d.startsWith("94")) return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  if (p.startsWith("+")) return p;
  return `+${d}`;
}

function buildMsg(d: { name: string; email: string; phone: string; message: string }) {
  return ["Hello ABA Ceylon,", "", "I would like to plan my Sri Lanka journey with you.", "",
    `Name: ${d.name}`, `Email: ${d.email}`, `Phone: ${d.phone}`, "", "Enquiry:", d.message].join("\n");
}

type FormState = { name: string; email: string; phone: string; message: string; consent: boolean };
type FormAction = { field: keyof FormState; value: string | boolean };

function formReducer(state: FormState, action: FormAction): FormState {
  return { ...state, [action.field]: action.value };
}

const INITIAL: FormState = { name: "", email: "", phone: "", message: "", consent: false };

const OPENING_HOURS = [
  { label: "Weekdays", value: "8:00 AM – 5:00 PM (SLST)" },
  { label: "Saturday", value: "9:00 AM – 1:00 PM (SLST)" },
  { label: "Sunday", value: "By prior arrangement" },
];

export default function ContactPage() {
  const [form, dispatch] = useReducer(formReducer, INITIAL);
  const [error, setError] = useReducer((_: string, v: string) => v, "");

  const formattedPhone = useMemo(() => formatPhone(ADMIN_PHONE), []);
  const whatsappHref = useMemo(
    () => generateWhatsAppLink(ADMIN_PHONE, buildMsg({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), message: form.message.trim() })),
    [form.email, form.message, form.name, form.phone],
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" && e.target instanceof HTMLInputElement ? e.target.checked : value;
    dispatch({ field: name as keyof FormState, value: val });
  }, []);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      setError("Please complete all required details before sending your enquiry.");
      return;
    }
    if (!form.consent) {
      setError("Please confirm that ABA Ceylon can contact you about this enquiry.");
      return;
    }
    setError("");
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  }, [form, whatsappHref]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08111d] text-white">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/plannerBakcground.jpg')" }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,154,43,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,rgba(7,12,22,0.88),rgba(7,12,22,0.98))]" />

      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pt-36">
        <div className="mb-12 max-w-3xl">
          <p className="font-cinzel text-xs uppercase tracking-[0.35em] text-amber-300/75">Travel Concierge</p>
          <h1 className="mt-4 font-cinzel text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">Let&apos;s Plan Your Trip</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg" style={SWITZER}>
            Share your travel idea with ABA Ceylon and our team will guide you with the right route, vehicle, stays, and local support.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          {/* Form */}
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70" style={SWITZER}>Your Name</span>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className={INPUT_CLS} style={SWITZER} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70" style={SWITZER}>Your Email</span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your Email" className={INPUT_CLS} style={SWITZER} />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-white/70" style={SWITZER}>Your Phone</span>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Your Phone" className={INPUT_CLS} style={SWITZER} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-white/70" style={SWITZER}>What&apos;s on your mind?</span>
                <textarea
                  name="message" value={form.message} onChange={handleChange} rows={9}
                  placeholder="Tell us about your dates, group size, route ideas, or the style of journey you would like to create."
                  className="w-full rounded-[1.75rem] border border-white/15 bg-white px-5 py-4 text-[15px] text-slate-900 outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20"
                  style={SWITZER}
                />
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-white/20 accent-amber-400" />
                <span className="text-sm leading-6 text-white/72" style={SWITZER}>
                  ABA Ceylon may contact me by WhatsApp, phone, or email about this enquiry.
                </span>
              </label>

              {error ? <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" style={SWITZER}>{error}</p> : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                <Button type="submit" variant="secondary" size="lg">Submit</Button>
                <p className="text-sm text-white/55" style={SWITZER}>Your enquiry opens as a pre-filled WhatsApp message to our team.</p>
              </div>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <Card variant="dark" className="p-6 sm:p-8 bg-[#111c2f]/80">
              <h2 className="font-cinzel text-3xl text-white sm:text-4xl">Call Us</h2>
              <p className="mt-3 text-base text-white/65" style={SWITZER}>The best call you&apos;ll make for your Sri Lanka journey.</p>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href={`tel:${ADMIN_PHONE}`} className="font-cinzel text-3xl text-[#7fd0ff] transition hover:text-white sm:text-4xl">{formattedPhone}</Link>
                <Link
                  href={generateWhatsAppLink(ADMIN_PHONE, "Hello ABA Ceylon, I would like to enquire about planning my Sri Lanka trip.")}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25d366] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                  style={SWITZER}
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </Link>
              </div>

              <div className="mt-8 space-y-4 text-white/72">
                {[
                  { icon: <Phone className="mt-1 h-5 w-5 text-amber-300/80" />, label: "Phone", value: formattedPhone, href: undefined },
                  { icon: <Mail className="mt-1 h-5 w-5 text-amber-300/80" />, label: "Email", value: ADMIN_EMAIL, href: `mailto:${ADMIN_EMAIL}` },
                  { icon: <MapPin className="mt-1 h-5 w-5 text-amber-300/80" />, label: "Based In", value: "Colombo, Sri Lanka", href: undefined },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    {icon}
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-amber-200/65" style={SWITZER}>{label}</p>
                      {href
                        ? <Link href={href} className="mt-1 block text-base text-[#7fd0ff] transition hover:text-white" style={SWITZER}>{value}</Link>
                        : <p className="mt-1 text-base" style={SWITZER}>{value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="glass" className="p-6 sm:p-8">
              <h2 className="font-cinzel text-3xl text-white sm:text-4xl">Opening Hours</h2>
              <p className="mt-3 text-base text-white/65" style={SWITZER}>
                Our Sri Lanka office hours are below. Outside these hours, you can still reach us on WhatsApp or email.
              </p>
              <div className="mt-7 space-y-3">
                {OPENING_HOURS.map((slot) => (
                  <div key={slot.label} className="grid gap-3 rounded-2xl bg-white/8 p-4 text-white sm:grid-cols-[0.95fr_1.05fr] sm:items-center">
                    <p className="text-base" style={SWITZER}>{slot.label}</p>
                    <p className="text-base text-white/82" style={SWITZER}>{slot.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
