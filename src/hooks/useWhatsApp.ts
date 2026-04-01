import { useMemo } from "react";
import { generateWhatsAppLink } from "@/lib/whatsapp/generateWhatsAppLink";

const DEFAULT_ADMIN_WHATSAPP = "+94770000000";

export function useWhatsApp(message: string) {
  const adminPhoneNumber =
    process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || DEFAULT_ADMIN_WHATSAPP;

  return useMemo(
    () => ({
      adminPhoneNumber,
      href: generateWhatsAppLink(adminPhoneNumber, message),
    }),
    [adminPhoneNumber, message],
  );
}
