import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chauffeur-Driven Fleet",
  description:
    "Premium chauffeured vehicles - sedans, SUVs, vans and more - for private transfers and touring across Sri Lanka with Aba Ceylon Tours & Travels.",
  alternates: {
    canonical: "https://www.abaceylontours.com/fleet",
  },
};

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
