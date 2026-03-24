import type { Metadata } from "next";
import AgentationProvider from "@/components/AgentationProvider";
import "./globals.css";

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
    <html lang="en">
      <body>
          {children}
          <AgentationProvider />
        </body>
    </html>
  );
}
