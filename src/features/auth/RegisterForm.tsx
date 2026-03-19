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
    <main
      style={{ fontFamily: 'Switzer, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}
      className="min-h-screen bg-white px-4 py-8 sm:py-12"
    >
      <div className="mx-auto w-full max-w-md px-4 sm:px-6">
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
          <SignUp appearance={signUpAppearance} routing="path" path="/sign-up" />
        </div>
      </div>
    </main>
  );
}