import { notFound } from "next/navigation";
import { getComicBySlug } from "@/lib/comics-data";
import ComicViewer from "./ComicViewer";
import type { Comic } from "@/lib/blog";
import type { Metadata } from "next";

interface ComicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ComicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comic = await getComicBySlug(slug);
  if (!comic) return { title: "Comic not found" };
  return {
    title: `${comic.episode} — ${comic.title}`,
    description: comic.subtitle,
    alternates: { canonical: `/comics/${comic.slug}` },
    openGraph: {
      title: `${comic.episode} — ${comic.title}`,
      description: comic.subtitle,
      images: [comic.gridImage || comic.image].filter(Boolean),
    },
  };
}

export default async function ComicPage({ params }: ComicPageProps) {
  const { slug } = await params;
  const record = await getComicBySlug(slug);
  if (!record) notFound();

  // Adapt the DB record to the shape ComicViewer expects.
  const comic: Comic = {
    slug: record.slug,
    title: record.title,
    subtitle: record.subtitle,
    episode: record.episode,
    image: record.image,
    gridImage: record.gridImage,
    panels: record.panels.map((p) => ({
      src: p.src,
      caption: p.caption ?? undefined,
    })),
  };

  return <ComicViewer comic={comic} />;
}
