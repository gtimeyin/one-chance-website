import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Updates",
  description:
    "News, stories, and comics from the One Chance world. Read the latest from Lagos and behind the scenes.",
  alternates: { canonical: "/updates" },
  openGraph: {
    title: "Updates | One Chance",
    description:
      "News, stories, and comics from the One Chance world.",
    url: "/updates",
  },
};

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
