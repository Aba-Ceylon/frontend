import { SignIn } from "@clerk/nextjs";

const signInAppearance = {
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

export default function LoginForm() {
  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto flex w-full max-w-md items-center justify-center">
        <SignIn appearance={signInAppearance} routing="path" path="/sign-in" />
      </div>
    </main>
  );
}