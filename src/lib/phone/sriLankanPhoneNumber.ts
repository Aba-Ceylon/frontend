const SRI_LANKAN_LOCAL_NUMBER = /^0\d{9}$/;
const SRI_LANKAN_INTERNATIONAL_NUMBER = /^94\d{9}$/;
const SRI_LANKAN_INTERNATIONAL_PREFIX = /^0094\d{9}$/;

function getDigits(value: string) {
  return value.replace(/[^\d]/g, "");
}

/** Converts a local Sri Lankan number such as 0722554488 to 94722554488. */
export function normalizeSriLankanPhoneNumber(value: string) {
  const digits = getDigits(value);

  if (SRI_LANKAN_LOCAL_NUMBER.test(digits)) {
    return `94${digits.slice(1)}`;
  }

  if (SRI_LANKAN_INTERNATIONAL_PREFIX.test(digits)) {
    return digits.slice(2);
  }

  return digits;
}

/** Formats a Sri Lankan number as +94 72 255 4488 when it is a valid local number. */
export function formatSriLankanPhoneNumber(value: string) {
  const normalizedNumber = normalizeSriLankanPhoneNumber(value);

  if (SRI_LANKAN_INTERNATIONAL_NUMBER.test(normalizedNumber)) {
    return `+94 ${normalizedNumber.slice(2, 4)} ${normalizedNumber.slice(4, 7)} ${normalizedNumber.slice(7)}`;
  }

  return value.trim();
}
