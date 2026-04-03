import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FeedbackForm from "@/features/feedback/FeedbackForm";

export const metadata = { title: "Share Feedback | Aba Ceylon" };

export default async function FeedbackPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black flex flex-col items-center justify-center px-4 py-20"
      style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
    >
      {/* Corner brackets */}
      <div className="relative w-full max-w-xl">
        <div className="absolute -top-4 -left-4 w-10 h-10 border-l-2 border-t-2 border-amber-400/30 pointer-events-none" />
        <div className="absolute -top-4 -right-4 w-10 h-10 border-r-2 border-t-2 border-amber-400/30 pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-10 h-10 border-l-2 border-b-2 border-amber-400/30 pointer-events-none" />
        <div className="absolute -bottom-4 -right-4 w-10 h-10 border-r-2 border-b-2 border-amber-400/30 pointer-events-none" />
        <FeedbackForm />
      </div>
    </main>
  );
}
