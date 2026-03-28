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

export interface Comic {
  slug: string;
  title: string;
  subtitle: string;
  episode: string;
  image: string;
}

export interface Announcement {
  slug: string;
  title: string;
  date: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "o-wa-a-relatable-shege-story",
    title: "O WA! - A Relatable Shege Story.",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tristique ac quis turpis nulla sagittis scelerisque. Et diam faucibus tincidunt.",
    category: "O WA!",
    categoryColor: "#DF6961",
    readTime: "15 - 20 mins read",
    image: "/images/gallery-playing.png",
    author: { name: "Treasure Ugbolu", avatar: "" },
    date: "07 March, 2024",
    content: `<p>Lorem ipsum dolor sit amet consectetur. Tristique ac quis turpis nulla sagittis scelerisque. Et diam faucibus tincidunt varius non. A adipiscing proin lorem morbi feugiat. Est vel orci tempor lorem facilisi. Imperdiet sit quis justo venenatis congue.</p>
<p>Faucibus lobortis nibh nibh consequat etiam est turpis vitae felis. Eget scelerisque adipiscing elit ut et dignissim enim. Imperdiet sodales ultrices diam amet accumsan tincidunt facilisi.</p>
<blockquote>But that day, shege sat me down and said 'I'll deal with you</blockquote>
<p>Lorem ipsum dolor sit amet consectetur. Tristique ac quis turpis nulla sagittis scelerisque. Et diam faucibus tincidunt varius non. A adipiscing proin lorem morbi feugiat.</p>`,
  },
  {
    slug: "chess-in-slums",
    title: "Chess in Slums",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tristique ac quis turpis nulla sagittis scelerisque. Et diam faucibus tincidunt.",
    category: "WORK",
    categoryColor: "#FCCD21",
    readTime: "15 - 20 mins read",
    image: "/images/gallery-kids.jpg",
    author: { name: "Lorem ipsum dolor", avatar: "" },
    date: "07 March, 2024",
    content: "<p>Full article content here...</p>",
  },
  {
    slug: "daily-life-in-lagos",
    title: "Chess in Slums",
    description:
      "Lorem ipsum dolor sit amet consectetur. Tristique ac quis turpis nulla sagittis scelerisque. Et diam faucibus tincidunt.",
    category: "DAILY LIFE",
    categoryColor: "#A75ACD",
    readTime: "15 - 20 mins read",
    image: "/images/gallery-box.jpg",
    author: { name: "Lorem ipsum dolor", avatar: "" },
    date: "07 March, 2024",
    content: "<p>Full article content here...</p>",
  },
];

export const comics: Comic[] = [
  {
    slug: "ep-1-road-to-riches",
    title: "LOREM IPSUM...",
    subtitle: "LOREM IPSUM...",
    episode: "EP 1 - Road to Riches",
    image: "/images/gallery-playing.png",
  },
  {
    slug: "ep-2-the-gathering",
    title: "LOREM IPSUM...",
    subtitle: "LOREM IPSUM...",
    episode: "EP 2 - The Gathering",
    image: "/images/gallery-kids.jpg",
  },
  {
    slug: "ep-3-roads-are-rough",
    title: "LOREM IPSUM...",
    subtitle: "LOREM IPSUM...",
    episode: "EP 3 - Roads are Rough",
    image: "/images/gallery-box.jpg",
  },
];

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

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(currentSlug: string): BlogPost[] {
  return blogPosts.filter((p) => p.slug !== currentSlug).slice(0, 3);
}
