import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Imagify — AI Virtual Try-On | Try Clothes Online",
    template: "%s | Imagify",
  },
  description:
    "Imagify is an AI-powered virtual try-on platform. Upload your photo and try on any clothing, accessory, or device instantly using advanced AI image generation.",
  keywords: [
    "virtual try-on",
    "AI fashion",
    "try clothes online",
    "virtual fitting room",
    "AI image generation",
    "fashion AI",
    "outfit try on",
    "AI stylist",
  ],
  authors: [{ name: "Imagify" }],
  creator: "Imagify",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://imagify.app",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://imagify.app",
    siteName: "Imagify",
    title: "Imagify — AI Virtual Try-On",
    description:
      "Try on clothes, accessories, and devices with AI. Upload your photo and see yourself in any outfit instantly.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Imagify — AI Virtual Try-On Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Imagify — AI Virtual Try-On",
    description:
      "Try on clothes with AI. Upload your photo and see yourself in any outfit.",
    images: ["/og-image.jpg"],
    creator: "@imagifyapp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${display.variable} font-sans antialiased bg-background text-white selection:bg-violet-500/30`}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-20">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
