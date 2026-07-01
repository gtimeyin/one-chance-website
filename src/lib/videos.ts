/**
 * Videos are pulled live from the One Chance Game YouTube channel's public
 * Atom feed. No API key required — the feed returns the ~15 most recent
 * uploads with title, description, publish date, and view count.
 *
 * Channel: https://www.youtube.com/@onechancegameYT
 */
const CHANNEL_ID = "UC5IAtjRWdJvRZEkx2S5RAMQ";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export const CHANNEL_URL = `https://www.youtube.com/channel/${CHANNEL_ID}`;

export type VideoFormat = "short" | "long";

export interface Video {
  /** YouTube video ID, e.g. "GJGv90ncX6U" */
  id: string;
  title: string;
  description: string;
  /** ISO 8601 publish date */
  published: string;
  /** 16:9-safe thumbnail served from YouTube's CDN */
  thumbnail: string;
  /** Canonical watch URL on youtube.com */
  url: string;
  /** Lifetime view count, when reported by the feed */
  views: number | null;
  /** "short" = vertical YouTube Short; "long" = regular landscape upload */
  format: VideoFormat;
}

/** Minimal XML entity decode for the fields we surface (titles/descriptions). */
function decodeEntities(input: string): string {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&");
}

function pick(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? decodeEntities(match[1].trim()) : "";
}

type ParsedEntry = Omit<Video, "format">;

function parseFeed(xml: string): ParsedEntry[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  return entries.map((entry) => {
    const id = pick(entry, "yt:videoId");
    const viewsMatch = entry.match(/<media:statistics\s+views="(\d+)"/);

    return {
      id,
      title: pick(entry, "title"),
      description: pick(entry, "media:description"),
      published: pick(entry, "published"),
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${id}`,
      views: viewsMatch ? Number(viewsMatch[1]) : null,
    };
  });
}

/**
 * The Atom feed carries no duration or Shorts flag, so we detect Shorts the
 * only reliable no-API-key way: hitting `/shorts/{id}`. YouTube serves an
 * actual Short with 200, but redirects a regular upload to its /watch page.
 * A video's format never changes, so this is cached for a day.
 */
async function detectFormat(id: string): Promise<VideoFormat> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
      method: "HEAD",
      redirect: "manual",
      next: { revalidate: 86400 },
    });
    return res.status === 200 ? "short" : "long";
  } catch {
    return "long";
  }
}

/**
 * Fetch the channel's latest uploads, each tagged as a Short or long-form
 * video. Revalidated hourly so we don't hit YouTube on every request; the list
 * refreshes well within a day of a new post. Returns an empty array if the
 * feed is unreachable so the page still renders.
 */
export async function getVideos(): Promise<Video[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const entries = parseFeed(await res.text());
    const formats = await Promise.all(entries.map((e) => detectFormat(e.id)));
    return entries.map((entry, i) => ({ ...entry, format: formats[i] }));
  } catch {
    return [];
  }
}
