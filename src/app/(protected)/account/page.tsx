import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";

export const metadata = { title: "Account | Aba Ceylon" };

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect(routes.signIn);
  const user = await currentUser();

  const quickLinks = [
    {
      title: "Custom Planner",
      description:
        "Build a route, match the right vehicle, and send the request to Aba Ceylon.",
      href: routes.planner,
    },
    {
      title: "My Plans",
      description:
        "Review your saved planner workflow and next steps for sending a request.",
      href: routes.myPlans,
    },
    {
      title: "My Inquiries",
      description:
        "See how direct enquiries and WhatsApp-led requests fit into your account.",
      href: routes.myInquiries,
    },
    {
      title: "Share Feedback",
      description:
        "Tell the team how your experience went after your journey.",
      href: routes.feedback,
    },
  ];

  return (
    <main
      className="min-h-screen bg-white px-4 py-24"
      style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="border border-[#182231] bg-[#182231] px-8 py-10 text-white shadow-[0_24px_80px_rgba(15,23,42,0.14)] sm:px-10">
          <p className="font-cinzel text-xs uppercase tracking-[0.18em] text-[#C99A2B]">
            Signed-in traveller
          </p>
          <h1 className="mt-3 font-cinzel text-4xl sm:text-5xl">
            My Account
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/82">
            Keep the essentials in one place: your planner workflow, enquiry
            starting points, and the best next action when you are ready to
            speak with the Aba Ceylon team.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="border border-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.12em] text-white/58">
                Name
              </p>
              <p className="mt-2 text-lg text-white">
                {user?.fullName || user?.firstName || "Aba Ceylon Traveller"}
              </p>
            </div>
            <div className="border border-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.12em] text-white/58">
                Email
              </p>
              <p className="mt-2 break-all text-lg text-white">
                {user?.primaryEmailAddress?.emailAddress || "Not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border border-[#182231]/10 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="font-cinzel text-2xl text-[#182231]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-[#182231]/66">
                {item.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.14em] text-[#182231]">
                Open
                <span aria-hidden="true">-&gt;</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
