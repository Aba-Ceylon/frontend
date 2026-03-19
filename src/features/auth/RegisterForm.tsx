import { SignUp } from "@clerk/nextjs";

const signUpAppearance = {
  elements: {
    card: "bg-white border border-slate-200 shadow-none",
    rootBox: "w-full",
    formButtonPrimary:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-none rounded-md",
    formFieldInput:
      "bg-white border border-slate-300 text-slate-900 rounded-md focus:ring-2 focus:ring-slate-300",
    headerTitle: "text-slate-900",
    headerSubtitle: "text-slate-600",
  },
};

export default function RegisterForm() {
  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto flex w-full max-w-md items-center justify-center">
        <SignUp appearance={signUpAppearance} routing="path" path="/sign-up" />
      </div>
    </main>
  );
}