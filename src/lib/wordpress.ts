import type { BlogPost } from "./blog";

/**
 * Blog posts are sourced live from the WordPress REST API on the same host
 * that backs the WooCommerce store. Authors publish in the WP admin; no code
 * deploy needed. Posts are fetched server-side and revalidated periodically.
 */
const WP_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://shopapi.yvpgame.com";
const POSTS_ENDPOINT = `${WP_URL}/wp-json/wp/v2/posts`;
const REVALIDATE_SECONDS = 600;

// WP categories have no colour; assign a stable one from the brand palette.
const CATEGORY_COLORS = ["#DF6961", "#FCCD21", "#A75ACD", "#5AD46F", "#99CAF1"];

const FALLBACK_IMAGE = "/images/gallery-playing.png";

interface WPRendered {
  rendered: string;
}

interface WPEmbedded {
  author?: { name?: string; avatar_urls?: Record<string, string> }[];
  "wp:featuredmedia"?: { source_url?: string }[];
  "wp:term"?: { taxonomy?: string; name?: string }[][];
}

interface WPPost {
  slug: string;
  date: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  _embedded?: WPEmbedded;
}

function decodeEntities(input: string): string {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8230;/g, "…")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function colorForCategory(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length];
}

function readTime(html: string): string {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return `${day} ${month}, ${d.getFullYear()}`;
}

function mapPost(p: WPPost): BlogPost {
  const emb = p._embedded ?? {};
  const author = emb.author?.[0];
  const media = emb["wp:featuredmedia"]?.[0];
  const term = emb["wp:term"]?.flat().find((t) => t?.taxonomy === "category" && t?.name);
  const category = term?.name ? decodeEntities(term.name) : "Blog";

  return {
    slug: p.slug,
    title: decodeEntities(p.title.rendered),
    description: decodeEntities(stripHtml(p.excerpt.rendered)).slice(0, 200),
    category: category.toUpperCase(),
    categoryColor: colorForCategory(category),
    readTime: readTime(p.content.rendered),
    image: media?.source_url || FALLBACK_IMAGE,
    // BlogCard renders the author as a coloured initial, so no avatar image needed.
    author: { name: author?.name ? decodeEntities(author.name) : "One Chance", avatar: "" },
    date: formatDate(p.date),
    content: p.content.rendered,
  };
}

/** All published posts, newest first (WP default order). Empty on failure. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${POSTS_ENDPOINT}?per_page=100&_embed`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as WPPost[];
    return data.map(mapPost);
  } catch {
    return [];
  }
}

/** A single post by slug, or null if not found / unreachable. */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${POSTS_ENDPOINT}?slug=${encodeURIComponent(slug)}&_embed`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WPPost[];
    return data[0] ? mapPost(data[0]) : null;
  } catch {
    return null;
  }
}

/** Other posts to show alongside the current one. */
export async function getRelatedPosts(currentSlug: string, limit = 3): Promise<BlogPost[]> {
  const all = await getBlogPosts();
  return all.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
