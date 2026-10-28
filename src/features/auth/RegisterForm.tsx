import { SignUp } from "@clerk/nextjs";
import AuthLayout, { authAppearance } from "./AuthLayout";

export default function RegisterForm() {
  return (
    <AuthLayout
      title="Begin your journey."
      subtitle="Create your account"
    >
      <SignUp appearance={authAppearance} routing="path" path="/sign-up" />
    </AuthLayout>
  );
}
