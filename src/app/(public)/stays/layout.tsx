import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heritage Stays",
  description:
    "Curated accommodation across eco lodges, boutique hotels, luxury resorts, and safari camps in Sri Lanka, hand-picked by Aba Ceylon Tours & Travels.",
  alternates: {
    canonical: "https://www.abaceylontours.com/stays",
  },
};

export default function StaysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
