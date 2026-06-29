import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ShopProductGrid from "@/components/shop/ShopProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import { getProducts, getCategories } from "@/lib/woocommerce";
import { getActiveCountry } from "@/lib/currency.server";

export const metadata = {
  title: "Shop",
  description: "Shop the One Chance board game collection. The first authentic Nigerian board game.",
  alternates: { canonical: "/shop" },
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

const SORT_MAP: Record<string, { orderby: string; order: "asc" | "desc" }> = {
  latest: { orderby: "date", order: "desc" },
  "price-asc": { orderby: "price", order: "asc" },
  "price-desc": { orderby: "price", order: "desc" },
  popularity: { orderby: "popularity", order: "desc" },
  rating: { orderby: "rating", order: "desc" },
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category: categorySlug, sort } = await searchParams;
  const activeSort = sort && SORT_MAP[sort] ? sort : "latest";
  const { orderby, order } = SORT_MAP[activeSort];

  const categories = await getCategories();
  const activeCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug) ?? null
    : null;

  const country = await getActiveCountry();
  const products = await getProducts({
    per_page: 100,
    category: activeCategory ? String(activeCategory.id) : undefined,
    orderby,
    order,
    country,
  });

  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div className="relative z-[1]" style={{ paddingTop: 56, background: "white" }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop" },
            ]}
          />
        </div>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <ShopFilters
            categories={categories}
            activeCategory={activeCategory?.slug ?? null}
            activeSort={activeSort}
          />
        </div>
        <ShopProductGrid products={products} />
      </div>
      <FooterShop reveal />
    </div>
  );
}

