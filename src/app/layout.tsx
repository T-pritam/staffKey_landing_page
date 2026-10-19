import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";

import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

// Labels and numbers only. "optional" means a late font never forces a
// full-page relayout; the fallback mono is fine for a first visit.
const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Staffkey · Hospitality hiring for Indian hotels",
  description:
    "Hospitality recruitment for Indian hotels and restaurants. Verified candidate profiles, released to you the moment you need them.",
  applicationName: "Staffkey",
  openGraph: {
    type: "website",
    siteName: "Staffkey",
    title: "Staffkey · The right hands for every hotel",
    description: "Verified hospitality candidates, live and ready. Hire chefs, captains, front office and housekeeping across India.",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#07080B",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-ivory px-5 py-3 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
