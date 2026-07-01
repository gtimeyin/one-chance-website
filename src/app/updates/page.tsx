import { listComics } from "@/lib/comics-data";
import { getBlogPosts } from "@/lib/wordpress";
import type { Comic } from "@/lib/blog";
import UpdatesContent from "./UpdatesContent";

export const metadata = {
  title: "Updates",
  description: "Latest news, comics, and announcements from One Chance.",
  alternates: { canonical: "/updates" },
};

export default async function UpdatesPage() {
  const [records, blogPosts] = await Promise.all([listComics(), getBlogPosts()]);
  const comics: Comic[] = records.map((c) => ({
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    episode: c.episode,
    image: c.image,
    gridImage: c.gridImage,
    panels: c.panels.map((p) => ({
      src: p.src,
      caption: p.caption ?? undefined,
    })),
  }));

  return <UpdatesContent comics={comics} blogPosts={blogPosts} />;
}
