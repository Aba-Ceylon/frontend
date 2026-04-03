import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FeedbackForm from "@/features/feedback/FeedbackForm";

export const metadata = { title: "Account | Aba Ceylon" };

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-20"
      style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
    >
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-cinzel text-3xl text-amber-400 drop-shadow-[0_0_20px_rgba(201,154,43,0.4)]">
            My Account
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-12 h-px bg-amber-400/50" />
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            <div className="w-12 h-px bg-amber-400/50" />
          </div>
        </div>

        <FeedbackForm />
      </div>
    </main>
  );
}
