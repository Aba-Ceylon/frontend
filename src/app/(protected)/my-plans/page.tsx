import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";

export const metadata = { title: "My Plans | Aba Ceylon" };

export default async function MyPlansPage() {
  const { userId } = await auth();
  if (!userId) redirect(routes.signIn);

  return (
    <main className="min-h-screen bg-white px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <section className="border border-[#182231] bg-[#182231] px-8 py-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.14)] sm:px-10">
          <p className="font-cinzel text-xs uppercase tracking-[0.18em] text-[#C99A2B]">
            Planning workflow
          </p>
          <h1 className="mt-3 font-cinzel text-4xl sm:text-5xl">My Plans</h1>
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
              title: "Explore packages",
              body: "If you are not ready for a fully custom route, start from curated packages and refine from there.",
              href: routes.packages,
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="border border-[#182231]/10 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="font-cinzel text-2xl text-[#182231]">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-[#182231]/66">
                {item.body}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
