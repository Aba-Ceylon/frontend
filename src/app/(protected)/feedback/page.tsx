import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FeedbackForm from "@/features/feedback/FeedbackForm";

export const metadata = { title: "Share Feedback | Aba Ceylon" };

export default async function FeedbackPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--navy-deep)] px-4 pb-20 pt-32"
      style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
    >
      {/* Corner brackets */}
      <div className="relative w-full max-w-4xl shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]">
        <div className="absolute -top-4 -left-4 w-10 h-10 border-l-2 border-t-2 border-[#e2c27a]/40 pointer-events-none" />
        <div className="absolute -top-4 -right-4 w-10 h-10 border-r-2 border-t-2 border-[#e2c27a]/40 pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-10 h-10 border-l-2 border-b-2 border-[#e2c27a]/40 pointer-events-none" />
        <div className="absolute -bottom-4 -right-4 w-10 h-10 border-r-2 border-b-2 border-[#e2c27a]/40 pointer-events-none" />
        <FeedbackForm />
      </div>
    </div>
  );
}
