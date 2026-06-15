import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";

export default function RegisterPage() {
  redirect(routes.signUp);
}
