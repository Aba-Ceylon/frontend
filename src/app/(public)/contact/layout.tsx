import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Aba Ceylon Tours & Travels to plan your Sri Lanka trip, chauffeur hire, or heritage stay.",
  alternates: {
    canonical: "https://www.abaceylontours.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
