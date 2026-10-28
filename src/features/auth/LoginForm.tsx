import { SignIn } from "@clerk/nextjs";
import AuthLayout, { authAppearance } from "./AuthLayout";

export default function LoginForm() {
  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to your account"
    >
      <SignIn appearance={authAppearance} routing="path" path="/sign-in" />
    </AuthLayout>
  );
}
