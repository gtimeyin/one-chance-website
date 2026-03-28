import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import AgentationProvider from "@/components/AgentationProvider";
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
      <body>
        {children}
        <AgentationProvider />
      </body>
    </html>
  );
}
