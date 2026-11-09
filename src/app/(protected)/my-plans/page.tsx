import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";
import { SectionKicker } from "@/components/ui/Teardrop";

export const metadata = { title: "My Plans | Aba Ceylon" };

export default async function MyPlansPage() {
  const { userId } = await auth();
  if (!userId) redirect(routes.signIn);

  return (
    <div className="min-h-screen bg-[var(--ivory)] px-4 pb-24 pt-32 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <section className="relative overflow-hidden bg-[var(--navy-deep)] px-8 py-12 text-white shadow-[0_30px_70px_-30px_rgba(13,20,30,0.6)] sm:px-12 sm:py-14">
          <SectionKicker tone="dark">Planning workflow</SectionKicker>
          <h1 className="mt-5 font-cinzel text-4xl sm:text-5xl">My Plans</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/82">
            Planner requests are currently assembled in-app and delivered to the
            Aba Ceylon team through WhatsApp. This page gives your account a real
            home for that workflow even before deeper saved-plan storage exists.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Build the route",
              body: "Choose dates, destinations, vehicle, and accommodation handling inside the protected planner.",
              href: routes.planner,
            },
            {
              title: "Review the summary",
              body: "Check the final planner summary before opening the pre-filled WhatsApp message.",
              href: routes.planner,
            },
            {
              title: "Planning guide",
              body: "Review how the custom journey process works and what to prepare before you begin.",
              href: routes.customizeJourneys,
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="card-lift relative overflow-hidden border border-[#182231]/10 bg-white p-7 hover:border-[#c99a2b]/50" data-spotlight
            >
              <p className="font-cinzel text-2xl text-[#182231]">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-[#182231]/66">
                {item.body}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
