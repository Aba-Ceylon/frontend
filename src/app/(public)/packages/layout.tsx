import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holiday Packages",
  description:
    "Handcrafted multi-day Sri Lanka tour packages covering heritage sites, hill country, wildlife, and beaches from Aba Ceylon Tours & Travels.",
  alternates: {
    canonical: "https://www.abaceylontours.com/packages",
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
