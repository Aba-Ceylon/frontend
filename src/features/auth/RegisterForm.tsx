import { SignUp } from "@clerk/nextjs";

const signUpAppearance = {
  elements: {
    rootBox: "w-full mx-auto flex justify-center",
    cardBox: "w-full mx-auto flex justify-center",
    card: "w-full max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto bg-white shadow-2xl rounded-2xl md:border md:border-slate-200",
    formButtonPrimary:
      "bg-amber-600 hover:bg-amber-700 text-white shadow-none rounded-md transition-colors",
    formFieldInput:
      "bg-white border border-slate-300 text-slate-900 rounded-md focus:ring-2 focus:ring-amber-500",
    headerTitle: "text-slate-900 font-bold",
    headerSubtitle: "text-slate-600",
  },
};

export default function RegisterForm() {
  return (
    <main
      style={{ fontFamily: "Switzer, system-ui, sans-serif" }}
      className="relative flex min-h-dvh w-full flex-col md:flex-row"
    >
      <div
        className="fixed inset-0 -z-20 md:hidden"
        style={{
          backgroundImage: "url('/images/heritage/sigiriya-login.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-slate-950/75 md:hidden" />

      <section className="relative hidden w-1/2 flex-col justify-end p-12 lg:p-16 md:flex">
        <div
          className="absolute inset-0 -z-20"
          style={{
            backgroundImage: "url('/images/heritage/sigiriya-login.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        <div className="max-w-xl text-white">
          <h1 className="mb-4 text-4xl lg:text-5xl font-bold leading-tight">
            Your journey through paradise begins here.
          </h1>
          <p className="mb-6 text-lg text-slate-200">
            From golden beaches to misty hill country, ancient temples to
            vibrant city life, Sri Lanka is a story waiting to be explored.
          </p>
          <p className="text-sm font-medium text-amber-400">
            Sign up to discover hidden gems, plan unforgettable experiences, and
            travel smarter across every corner of the island.
          </p>
        </div>
      </section>

      <section className="flex w-full flex-col items-center justify-center py-12 md:w-1/2 md:bg-slate-50 md:px-4">
        <div className="mb-8 px-4 text-center md:hidden mt-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your journey begins here.
          </h1>
          <p className="text-sm text-slate-200">
            Join us to discover hidden gems and travel smarter.
          </p>
        </div>

        <SignUp appearance={signUpAppearance} routing="path" path="/sign-up" />
      </section>
    </main>
  );
}
