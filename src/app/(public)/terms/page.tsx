import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and conditions for using the Aba Ceylon Tours and Travels website and planning enquiries.",
};

const termSections = [
  {
    title: "Website use",
    body: "This website helps travellers explore Sri Lanka journey options, enquire about transport and stays, and contact Aba Ceylon directly. Content is informational and may change as routes, availability, and operating conditions change.",
  },
  {
    title: "Planning and availability",
    body: "Packages, vehicles, stays, and route suggestions shown on the site do not guarantee final availability. Actual arrangements are confirmed only after direct communication with the team.",
  },
  {
    title: "Custom requests",
    body: "The planner and contact flows help you send structured requests. Final pricing, inclusions, exclusions, and scheduling details are confirmed during direct planning.",
  },
  {
    title: "Third-party platforms",
    body: "If you continue your enquiry through WhatsApp, email, maps, or other third-party services, those services operate under their own terms and policies.",
  },
  {
    title: "Content accuracy",
    body: "We aim to keep route, destination, and service information practical and accurate, but travel conditions can change. Treat the website as a planning guide rather than a fixed contractual statement.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <section className="border border-[#182231] bg-[#182231] px-8 py-10 text-white sm:px-10" data-reveal>
          <p className="font-cinzel text-[11px] uppercase tracking-[0.18em] text-[#C99A2B]">
            Legal
          </p>
          <h1 className="mt-4 font-cinzel text-4xl sm:text-5xl">Terms and conditions</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/74">
            These terms describe how the Aba Ceylon website and enquiry flows
            should be used during trip planning.
          </p>
        </section>

        <section className="border-x border-b border-[#182231]/10 bg-white px-8 py-10 sm:px-10" data-reveal>
          <div className="space-y-9">
            {termSections.map((section) => (
              <article key={section.title} className="border-b border-[#182231]/10 pb-8 last:border-b-0 last:pb-0">
                <h2 className="font-cinzel text-2xl text-[#182231]">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#182231]/68">{section.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
