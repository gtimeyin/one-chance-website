import type { Metadata } from "next";
import { Barlow_Condensed } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import AgentationProvider from "@/components/AgentationProvider";
import PageLoader from "@/components/PageLoader";
import ReferralCodeCapture from "@/components/referral/ReferralCodeCapture";
import { Suspense } from "react";
import "./globals.css";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

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
        {children}
        <AgentationProvider />
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
