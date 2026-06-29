import type { Metadata, Viewport } from "next";
import { Barlow_Condensed } from "next/font/google";
import AgentationProvider from "@/components/AgentationProvider";
import PageLoader from "@/components/PageLoader";
import ReferralCodeCapture from "@/components/referral/ReferralCodeCapture";
import AnalyticsLoader from "@/components/analytics/AnalyticsLoader";
import CookieConsent from "@/components/analytics/CookieConsent";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { getActiveCurrency } from "@/lib/currency";
import { siteUrl } from "@/lib/site";
import { Suspense } from "react";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const title = "One Chance - The Lagos Board Game";
const description =
  "Lagos can be a chaotic place, so we made a game out of it. Experience the One Chance board game.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | One Chance",
  },
  description,
  applicationName: "One Chance",
  keywords: [
    "One Chance",
    "Lagos board game",
    "Nigerian board game",
    "African tabletop game",
    "One Chance game",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "One Chance",
    title,
    description,
    url: "/",
    locale: "en_NG",
    images: [
      {
        url: "/images/characters-group.png",
        width: 1200,
        height: 630,
        alt: "One Chance — The Lagos Board Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/characters-group.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#FFD600",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currency = await getActiveCurrency();
  return (
    <html lang="en" className={barlowCondensed.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <PageLoader />
        <Suspense>
          <ReferralCodeCapture />
        </Suspense>
        <CurrencyProvider currency={currency}>{children}</CurrencyProvider>
        <AgentationProvider />
        <CookieConsent />
      </body>
      <AnalyticsLoader />
    </html>
  );
}
