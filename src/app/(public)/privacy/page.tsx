import type { Metadata } from "next";
import { SectionKicker } from "@/components/ui/Teardrop";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Aba Ceylon Tours and Travels and how travel enquiry information is handled.",
  alternates: {
    canonical: "https://www.abaceylontours.com/privacy",
  },
};

const privacySections = [
  {
    title: "What we collect",
    body: "When you contact Aba Ceylon, we may collect the details you choose to share, including your name, email address, phone number, travel dates, group size, and route preferences.",
  },
  {
    title: "How we use it",
    body: "We use your information only to reply to enquiries, shape travel recommendations, arrange requested services, and support active trips.",
  },
  {
    title: "Third-party services",
    body: "This website uses services such as Clerk for authentication and Supabase for application data. If you continue through WhatsApp or email, those platforms apply their own privacy policies as well.",
  },
  {
    title: "Retention",
    body: "We keep enquiry and trip-planning information only for as long as it remains useful for support, coordination, follow-up, and normal business records.",
  },
  {
    title: "Your control",
    body: "If you want us to update or remove information you shared through the website, contact the Aba Ceylon team directly and we will handle the request as reasonably and lawfully as possible.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--ivory)] px-6 pb-24 pt-32 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <section className="relative overflow-hidden bg-[var(--navy-deep)] px-8 py-12 text-white shadow-[0_30px_70px_-30px_rgba(13,20,30,0.6)] sm:px-12 sm:py-14" data-reveal>
          <SectionKicker tone="dark">Legal</SectionKicker>
          <h1 className="mt-5 font-cinzel text-4xl sm:text-5xl">Privacy policy</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/74">
            This explains how Aba Ceylon handles the travel-planning information
            you choose to share with us.
          </p>
        </section>

        <section className="border-x border-b border-[#182231]/10 bg-white px-8 py-10 sm:px-10" data-reveal>
          <div className="space-y-9">
            {privacySections.map((section) => (
              <article key={section.title} className="border-b border-[#182231]/10 pb-8 last:border-b-0 last:pb-0">
                <h2 className="font-cinzel text-2xl text-[#182231]">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#182231]/68">{section.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
