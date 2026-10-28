import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";

// Clerk handles password resets inside the sign-in flow.
export default function ForgotPasswordPage() {
  redirect(routes.signIn);
}
