import { normalizeSriLankanPhoneNumber } from "@/lib/phone/sriLankanPhoneNumber";

export function generateWhatsAppLink(phoneNumber: string, message: string) {
  const normalizedNumber = normalizeSriLankanPhoneNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message.trim());
  return `https://wa.me/${normalizedNumber}?text=${encodedMessage}`;
}
