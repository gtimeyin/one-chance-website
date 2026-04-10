import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import AgentationProvider from "@/components/AgentationProvider";
import PageLoader from "@/components/PageLoader";
import ReferralCodeCapture from "@/components/referral/ReferralCodeCapture";
import { Suspense } from "react";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "One Chance - The Lagos Board Game",
  description:
    "Lagos can be a chaotic place, so we made a game out of it. Experience the One Chance board game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <PageLoader />
        <Suspense>
          <ReferralCodeCapture />
        </Suspense>
        {children}
        <AgentationProvider />
      </body>
    </html>
  );
}
