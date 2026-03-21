import { SignUp } from "@clerk/nextjs";

const signUpAppearance = {
  elements: {
    rootBox: "w-full",
    cardBox: "w-full",
    card: "w-full max-w-none bg-transparent border-0 shadow-none",
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
      className="relative min-h-dvh"
    >
      <div
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage: "url('/images/heritage/sigiriya-login.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute inset-0 bg-slate-950/55 md:hidden" />

      <div className="relative grid min-h-dvh md:grid-cols-2">
        <section
          className="hidden md:block"
          style={{
            backgroundImage: "url('/images/heritage/sigiriya-login.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <section className="flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 bg-transparent md:bg-white">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-sm sm:p-6 md:border-slate-200 md:bg-white md:p-8 md:shadow-sm">
            <SignUp appearance={signUpAppearance} routing="path" path="/sign-up" />
          </div>
        </section>
      </div>
    </main>
  );
}