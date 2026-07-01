import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Watch One Chance Game in action — gameplay, reactions, and behind the scenes from our YouTube channel.",
  alternates: { canonical: "/videos" },
  openGraph: {
    title: "Videos | One Chance",
    description: "Watch One Chance Game in action — gameplay, reactions, and behind the scenes.",
    url: "/videos",
  },
};

export default function VideosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
