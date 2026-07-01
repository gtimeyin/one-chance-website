export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  readTime: string;
  image: string;
  author: { name: string; avatar: string };
  date: string;
  content: string;
}

export interface ComicPanel {
  src: string;
  caption?: string;
}

export interface Comic {
  slug: string;
  title: string;
  subtitle: string;
  episode: string;
  // Card / preview thumbnail.
  image: string;
  // The full multi-panel grid image used on the cover splash. If you don't
  // have one yet, reuse `image` — the viewer will still work.
  gridImage?: string;
  // Individual panels in reading order. When empty, the viewer falls back
  // to the grid image as a single panel.
  panels?: ComicPanel[];
}

export interface Announcement {
  slug: string;
  title: string;
  date: string;
  image: string;
}

// Blog posts are sourced from WordPress — see src/lib/wordpress.ts. The
// BlogPost interface above is the shared shape those posts are mapped into.

// Drop assets at:
//   /public/images/comics/<slug>/grid.jpg
//   /public/images/comics/<slug>/panels/01.jpg, 02.jpg, ...
// The viewer degrades gracefully if `gridImage` or `panels` are missing.
export const comics: Comic[] = [
  {
    slug: "ep-1-road-to-riches",
    title: "LOREM IPSUM...",
    subtitle: "LOREM IPSUM...",
    episode: "EP 1 - Road to Riches",
    image: "/images/gallery-playing.png",
    gridImage: "/images/comics/ep-1-road-to-riches/grid.jpg",
    panels: [
      { src: "/images/comics/ep-1-road-to-riches/panels/01.jpg" },
      { src: "/images/comics/ep-1-road-to-riches/panels/02.jpg" },
      { src: "/images/comics/ep-1-road-to-riches/panels/03.jpg" },
      { src: "/images/comics/ep-1-road-to-riches/panels/04.jpg" },
      { src: "/images/comics/ep-1-road-to-riches/panels/05.jpg" },
      { src: "/images/comics/ep-1-road-to-riches/panels/06.jpg" },
    ],
  },
  {
    slug: "ep-2-the-gathering",
    title: "LOREM IPSUM...",
    subtitle: "LOREM IPSUM...",
    episode: "EP 2 - The Gathering",
    image: "/images/gallery-kids.jpg",
    gridImage: "/images/comics/ep-2-the-gathering/grid.jpg",
    panels: [
      { src: "/images/comics/ep-2-the-gathering/panels/01.jpg" },
      { src: "/images/comics/ep-2-the-gathering/panels/02.jpg" },
      { src: "/images/comics/ep-2-the-gathering/panels/03.jpg" },
      { src: "/images/comics/ep-2-the-gathering/panels/04.jpg" },
    ],
  },
  {
    slug: "ep-3-roads-are-rough",
    title: "LOREM IPSUM...",
    subtitle: "LOREM IPSUM...",
    episode: "EP 3 - Roads are Rough",
    image: "/images/gallery-box.jpg",
    gridImage: "/images/comics/ep-3-roads-are-rough/grid.jpg",
    panels: [
      { src: "/images/comics/ep-3-roads-are-rough/panels/01.jpg" },
      { src: "/images/comics/ep-3-roads-are-rough/panels/02.jpg" },
      { src: "/images/comics/ep-3-roads-are-rough/panels/03.jpg" },
    ],
  },
];

export function getComic(slug: string): Comic | undefined {
  return comics.find((c) => c.slug === slug);
}

export const announcements: Announcement[] = [
  {
    slug: "announcement-1",
    title: "LOREM IPSUM...",
    date: "07 JULY 2025",
    image: "/images/gallery-closeup.jpg",
  },
  {
    slug: "announcement-2",
    title: "LOREM IPSUM...",
    date: "07 JULY 2025",
    image: "/images/gallery-playing.png",
  },
  {
    slug: "announcement-3",
    title: "LOREM IPSUM...",
    date: "07 JULY 2025",
    image: "/images/gallery-kids.jpg",
  },
];
