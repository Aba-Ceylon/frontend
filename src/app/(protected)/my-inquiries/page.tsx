import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";
import { SectionKicker } from "@/components/ui/Teardrop";

export const metadata = { title: "My Inquiries | Aba Ceylon" };

export default async function MyInquiriesPage() {
  const { userId } = await auth();
  if (!userId) redirect(routes.signIn);

  return (
    <div className="min-h-screen bg-[var(--ivory)] px-4 pb-24 pt-32 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <section className="relative overflow-hidden bg-[var(--navy-deep)] px-8 py-12 text-white shadow-[0_30px_70px_-30px_rgba(13,20,30,0.6)] sm:px-12 sm:py-14">
          <SectionKicker tone="dark">Inquiry history</SectionKicker>
          <h1 className="mt-5 font-cinzel text-4xl sm:text-5xl">
            My Inquiries
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/82">
            Direct enquiries currently happen through WhatsApp and contact-led
            conversations, so there is no saved inquiry history in the dashboard
            yet. Use the actions below to start a properly scoped request.
          </p>
        </section>

        <section className="mt-8 border border-[#182231]/10 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
          <h2 className="font-cinzel text-3xl text-[#182231]">
            Nothing recorded here yet
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#182231]/66">
            When you send a planner request or a direct contact message, the
            next step happens with the Aba Ceylon team personally. This page
            exists so your account has a clear place for enquiry-related actions
            instead of dropping you into a dead route.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link
              href={routes.contact}
              className="card-lift relative overflow-hidden border border-[#182231]/10 bg-white p-7 hover:border-[#c99a2b]/50" data-spotlight
            >
              <p className="font-cinzel text-2xl text-[#182231]">
                Start a direct enquiry
              </p>
              <p className="mt-3 text-sm leading-7 text-[#182231]/66">
                Use the concierge contact page for date-led, group-led, or open
                trip questions.
              </p>
            </Link>
            <Link
              href={routes.planner}
              className="card-lift relative overflow-hidden border border-[#182231]/10 bg-white p-7 hover:border-[#c99a2b]/50" data-spotlight
            >
              <p className="font-cinzel text-2xl text-[#182231]">
                Send a planner request
              </p>
              <p className="mt-3 text-sm leading-7 text-[#182231]/66">
                Build a full custom route and send it to the team as a structured
                WhatsApp-ready request.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
