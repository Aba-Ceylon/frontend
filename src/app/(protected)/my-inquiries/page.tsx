import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";

export const metadata = { title: "My Inquiries | Aba Ceylon" };

export default async function MyInquiriesPage() {
  const { userId } = await auth();
  if (!userId) redirect(routes.signIn);

  return (
    <main className="min-h-screen bg-white px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <section className="border border-[#182231] bg-[#182231] px-8 py-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.14)] sm:px-10">
          <p className="font-cinzel text-xs uppercase tracking-[0.18em] text-[#C99A2B]">
            Inquiry history
          </p>
          <h1 className="mt-3 font-cinzel text-4xl sm:text-5xl">
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
              className="border border-[#182231]/10 bg-white p-6"
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
              className="border border-[#182231]/10 bg-white p-6"
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
    </main>
  );
}
