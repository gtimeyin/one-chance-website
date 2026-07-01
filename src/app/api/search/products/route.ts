import { getProducts } from "@/lib/woocommerce";
import { listComics } from "@/lib/comics-data";
import { productToSearchItem, type SearchItem } from "@/lib/search";

export const revalidate = 300;

export async function GET() {
  const [products, comics] = await Promise.all([
    getProducts({ per_page: 100 }),
    listComics(),
  ]);

  const items: SearchItem[] = [
    ...products.map(productToSearchItem),
    ...comics.map((c) => ({
      id: `comic-${c.slug}`,
      type: "comic" as const,
      title: c.title,
      description: `${c.episode} — ${c.subtitle}`.trim(),
      href: `/comics/${c.slug}`,
      image: c.image || c.gridImage || undefined,
      category: "Comic",
      keywords: `${c.title} ${c.subtitle} ${c.episode}`.toLowerCase(),
    })),
  ];

  return Response.json({ items });
}
