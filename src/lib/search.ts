import type { WooProduct } from "./woocommerce";
import { blogPosts, announcements } from "./blog";
import { faqs } from "./faqs";

export type SearchItemType =
  | "product"
  | "post"
  | "comic"
  | "announcement"
  | "faq"
  | "page";

export interface SearchItem {
  id: string;
  type: SearchItemType;
  title: string;
  description?: string;
  href: string;
  image?: string;
  category?: string;
  keywords: string;
}

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export function productToSearchItem(p: WooProduct): SearchItem {
  const shortDesc = stripHtml(p.short_description || p.description || "");
  return {
    id: `product-${p.id}`,
    type: "product",
    title: p.name,
    description: shortDesc.slice(0, 160),
    href: `/shop/${p.slug}`,
    image: p.images?.[0]?.src,
    category: p.categories?.[0]?.name,
    keywords: [
      p.name,
      shortDesc,
      p.sku,
      p.categories?.map((c) => c.name).join(" "),
      p.tags?.map((t) => t.name).join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
}

const blogItems: SearchItem[] = blogPosts.map((b) => ({
  id: `post-${b.slug}`,
  type: "post",
  title: b.title,
  description: b.description,
  href: `/updates/${b.slug}`,
  image: b.image,
  category: b.category,
  keywords: `${b.title} ${b.description} ${b.category} ${stripHtml(b.content)}`.toLowerCase(),
}));

// Comics moved to Supabase — they're indexed via the /api/search/products
// endpoint alongside products, not from this static list.
const comicItems: SearchItem[] = [];

const announcementItems: SearchItem[] = announcements.map((a) => ({
  id: `announcement-${a.slug}`,
  type: "announcement",
  title: a.title,
  description: a.date,
  href: `/updates/${a.slug}`,
  image: a.image,
  category: "Announcement",
  keywords: `${a.title} ${a.date}`.toLowerCase(),
}));

const faqItems: SearchItem[] = faqs.map((f, i) => ({
  id: `faq-${i}`,
  type: "faq",
  title: f.question,
  description: f.answer.slice(0, 160),
  href: `/faq`,
  category: "FAQ",
  keywords: `${f.question} ${f.answer}`.toLowerCase(),
}));

const pageItems: SearchItem[] = [
  {
    id: "page-about",
    type: "page",
    title: "About",
    description: "Learn about One Chance, the Lagos-themed board game.",
    href: "/about",
    category: "Page",
    keywords: "about one chance story team mission",
  },
  {
    id: "page-shop",
    type: "page",
    title: "Shop",
    description: "Browse the One Chance product collection.",
    href: "/shop",
    category: "Page",
    keywords: "shop store products buy",
  },
  {
    id: "page-rules",
    type: "page",
    title: "How to Play / Rules",
    description: "Learn the rules of One Chance.",
    href: "/rules",
    category: "Page",
    keywords: "rules how to play instructions game guide",
  },
  {
    id: "page-faq",
    type: "page",
    title: "FAQ",
    description: "Frequently asked questions about One Chance.",
    href: "/faq",
    category: "Page",
    keywords: "faq questions help support",
  },
  {
    id: "page-updates",
    type: "page",
    title: "Updates",
    description: "Latest news, comics, and announcements.",
    href: "/updates",
    category: "Page",
    keywords: "updates blog news comics announcements",
  },
  {
    id: "page-contact",
    type: "page",
    title: "Contact",
    description: "Get in touch with the One Chance team.",
    href: "/contact",
    category: "Page",
    keywords: "contact support email help",
  },
  {
    id: "page-shipping",
    type: "page",
    title: "Shipping & Returns",
    description: "Delivery, returns, and shipping information.",
    href: "/shipping",
    category: "Page",
    keywords: "shipping delivery returns refund",
  },
  {
    id: "page-terms",
    type: "page",
    title: "Terms & Conditions",
    description: "Terms of use for the One Chance website.",
    href: "/terms",
    category: "Page",
    keywords: "terms conditions legal",
  },
  {
    id: "page-privacy",
    type: "page",
    title: "Privacy Policy",
    description: "How we handle your data.",
    href: "/privacy",
    category: "Page",
    keywords: "privacy policy data cookies gdpr",
  },
  {
    id: "page-characters",
    type: "page",
    title: "Characters",
    description: "Meet the characters of One Chance.",
    href: "/characters",
    category: "Page",
    keywords: "characters cast personas avatars",
  },
];

export const staticSearchItems: SearchItem[] = [
  ...blogItems,
  ...comicItems,
  ...announcementItems,
  ...faqItems,
  ...pageItems,
];

export function filterSearch(items: SearchItem[], query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  return items.filter((item) =>
    tokens.every((t) => item.keywords.includes(t) || item.title.toLowerCase().includes(t))
  );
}

export function groupByType(items: SearchItem[]): Record<SearchItemType, SearchItem[]> {
  const groups: Record<SearchItemType, SearchItem[]> = {
    product: [],
    post: [],
    comic: [],
    announcement: [],
    faq: [],
    page: [],
  };
  for (const item of items) groups[item.type].push(item);
  return groups;
}

export const typeLabels: Record<SearchItemType, string> = {
  product: "Products",
  post: "Blog Posts",
  comic: "Comics",
  announcement: "Announcements",
  faq: "FAQs",
  page: "Pages",
};
