// What Aba knows: live site data (packages, stays, fleet, destinations,
// activities) plus a small set of general Sri Lanka travel facts.

import type { Activity } from "@/types/activity";
import type { Destination } from "@/types/destination";
import type { PackageItem } from "@/types/package";
import type { Stay } from "@/types/stay";
import type { FleetVehicle } from "@/types/vehicle";

export interface KnowledgeBase {
  packages: PackageItem[];
  vehicles: FleetVehicle[];
  stays: Stay[];
  destinations: Destination[];
  activities: Activity[];
}

export const COMPANY = {
  name: "Aba Ceylon Tours & Travels",
  phoneDisplay: "+94 72 255 4488",
  phone: "+94722554488",
  email: "abaceylon@gmail.com",
  // Colombo opening hours (Sri Lanka time, UTC+5:30).
  hours: "Mon–Fri 8am–5pm, Sat 9am–1pm (Sri Lanka time)",
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Typical dry-season months per region (0 = January). Sri Lanka has two
 * monsoons, so one coast is usually good while the other is wet.
 */
export const REGION_CLIMATE: Record<string, { label: string; best: number[]; note?: string }> = {
  "West Coast": { label: "the west coast (Colombo, Negombo, Bentota)", best: [11, 0, 1, 2, 3] },
  "South Coast": { label: "the south coast (Galle, Mirissa, Tangalle)", best: [11, 0, 1, 2, 3] },
  "Hill Country": {
    label: "the hill country (Kandy, Nuwara Eliya, Ella)",
    best: [0, 1, 2, 3],
    note: "Ella sits on the drier eastern side of the hills, so it stays pleasant through the middle of the year too.",
  },
  "Cultural Triangle": {
    label: "the Cultural Triangle (Sigiriya, Dambulla, Polonnaruwa)",
    best: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  "East Coast": {
    label: "the east coast (Trincomalee, Pasikudah, Arugam Bay)",
    best: [3, 4, 5, 6, 7, 8],
    note: "Arugam Bay's surf season usually runs from about April to October.",
  },
  "Northern Sri Lanka": { label: "the north (Jaffna)", best: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  "Wildlife Belt": {
    label: "the wildlife parks (Yala, Udawalawe)",
    best: [1, 2, 3, 4, 5, 6],
    note: "Yala usually closes for a few weeks around September to October.",
  },
};

/** Seasonal highlights worth mentioning for a given month. */
export const MONTH_EXTRAS: Array<{ months: number[]; text: string }> = [
  { months: [10, 11, 0, 1, 2, 3], text: "it's whale-watching season off Mirissa" },
  { months: [6, 7, 8, 9], text: "elephants gather in their hundreds at Minneriya" },
  { months: [6, 7], text: "Kandy usually hosts the Esala Perahera festival, with dancers and decorated elephants" },
  { months: [3, 4, 5, 6, 7, 8, 9], text: "the surf is up at Arugam Bay" },
];

export const TRAVEL_FACTS = {
  visa:
    "Most visitors need an Electronic Travel Authorisation (ETA) before they fly. The rules and fees change from time to time, so please check the official site, eta.gov.lk, before you book flights. Our team is happy to point you in the right direction too.",
  safety:
    "Sri Lanka is a warm, welcoming place for travellers. The usual travel sense applies, and on our trips you have one direct contact throughout, so if anything changes on the ground we adjust the route for you.",
  currency:
    "The currency is the Sri Lankan rupee (LKR). ATMs are easy to find in towns, and cards work in most hotels and larger restaurants. It's worth carrying some cash for markets, temples and tuk-tuks.",
  plugs:
    "Sockets are mostly Type D and Type G (the UK-style three-pin), at 230V. A universal adapter covers you.",
  sim:
    "Tourist SIM cards with data are sold right at the airport arrivals hall, and they're inexpensive. Wi-Fi is common in hotels.",
  tipping:
    "Tipping isn't required, but it's appreciated for drivers, guides and hotel staff when you've had good service. It's always your call.",
  language:
    "Sinhala and Tamil are the main languages, and English is widely spoken wherever you'll travel. Our team speaks all three.",
  dress:
    "Light cotton clothes work best. For temples, cover shoulders and knees and remove shoes and hats, so a light scarf or sarong is handy.",
  timezone: "Sri Lanka runs on UTC+5:30, the same as India.",
  packing:
    "Pack light breathable clothes, a rain layer, a warmer top for the hill country evenings, comfortable shoes, sunscreen, and something to cover shoulders and knees at temples.",
  health:
    "It's best to check with your doctor or a travel clinic about recommended vaccines before you go, and travel insurance is always a good idea.",
};

/** Sri Lanka local time pieces, for "the team is offline right now" honesty. */
export function sriLankaNow(now: Date) {
  const local = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const day = local.getUTCDay(); // 0 Sunday
  const hour = local.getUTCHours() + local.getUTCMinutes() / 60;
  const open =
    (day >= 1 && day <= 5 && hour >= 8 && hour < 17) || (day === 6 && hour >= 9 && hour < 13);
  const hh = local.getUTCHours();
  const mm = String(local.getUTCMinutes()).padStart(2, "0");
  const clock = `${((hh + 11) % 12) + 1}:${mm}${hh < 12 ? "am" : "pm"}`;
  return { open, clock, day };
}
