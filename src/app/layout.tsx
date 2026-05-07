import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import NavBar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";
import { LoaderGateProvider } from "../components/home/LoaderGate";
import GatedShell from "../components/home/GatedShell";
import ChatbotWidget from "../features/chatbot/ChatbotWidget";
import { I18nProvider } from "../components/i18n/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aba Ceylon (Pvt) Ltd.",
  description: "developed by VernoxLabs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <I18nProvider>
            <LoaderGateProvider>
              <GatedShell navbar={<NavBar />} footer={<Footer />}>
                {children}
              </GatedShell>
              <ChatbotWidget />
            </LoaderGateProvider>
          </I18nProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
