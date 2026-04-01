function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/[^\d]/g, "");
}

export function generateWhatsAppLink(phoneNumber: string, message: string) {
  const normalizedNumber = normalizePhoneNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message.trim());
  return `https://wa.me/${normalizedNumber}?text=${encodedMessage}`;
}
