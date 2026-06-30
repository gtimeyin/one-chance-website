import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import { getProducts } from "@/lib/woocommerce";
import {
  filterSearch,
  groupByType,
  productToSearchItem,
  staticSearchItems,
  typeLabels,
  type SearchItem,
  type SearchItemType,
} from "@/lib/search";

export const metadata = {
  title: "Search",
  description: "Search products, updates, FAQs and pages on One Chance.",
  robots: { index: false, follow: true },
};

const RESULT_ORDER: SearchItemType[] = [
  "product",
  "post",
  "comic",
  "announcement",
  "page",
  "faq",
];

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQ = params.q;
  const query = Array.isArray(rawQ) ? rawQ[0] ?? "" : rawQ ?? "";

  const products = await getProducts({ per_page: 100 });
  const allItems: SearchItem[] = [
    ...products.map(productToSearchItem),
    ...staticSearchItems,
  ];
  const filtered = query.trim() ? filterSearch(allItems, query) : [];
  const grouped = groupByType(filtered);
  const total = filtered.length;

  return (
    <div className="flex flex-col w-full" style={{ background: "white", minHeight: "100vh" }}>
      <SmoothScroll />
      <Navbar />
      <div className="relative z-[1]" style={{ paddingTop: 24, background: "white" }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Search" },
            ]}
          />
        </div>

        <div
          className="flex w-full justify-center"
          style={{ padding: "32px clamp(20px, 4vw, 40px) 64px" }}
        >
          <div
            className="flex w-full max-w-[1280px] flex-col"
            style={{ gap: 32 }}
          >
            <form
              action="/search"
              method="get"
              className="flex w-full items-center"
              style={{
                gap: 16,
                borderBottom: "2px solid var(--color-dark)",
                paddingBottom: 12,
              }}
            >
              <input
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search products, updates, pages…"
                className="font-barlow-condensed flex-1 border-none bg-transparent outline-none"
                style={{
                  fontSize: "clamp(20px, 3vw, 32px)",
                  fontWeight: 500,
                  color: "var(--color-dark)",
                }}
                aria-label="Search query"
                autoComplete="off"
              />
              <button
                type="submit"
                className="font-barlow-condensed cursor-pointer border-none uppercase"
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  background: "var(--color-yellow)",
                  color: "var(--color-dark)",
                  padding: "10px 18px",
                }}
              >
                Search
              </button>
            </form>

            <div className="flex items-baseline" style={{ gap: 12 }}>
              <h1
                className="type-h1 uppercase"
                style={{ color: "var(--color-dark)" }}
              >
                {query.trim()
                  ? `Results for "${query}"`
                  : "Search"}
              </h1>
              {query.trim() && (
                <span
                  className="font-barlow-condensed"
                  style={{ fontSize: 16, color: "var(--color-text-muted)" }}
                >
                  {total} {total === 1 ? "match" : "matches"}
                </span>
              )}
            </div>

            {!query.trim() ? (
              <p
                className="font-barlow-condensed"
                style={{ fontSize: 16, color: "var(--color-text-muted)" }}
              >
                Enter a search term to find products, updates, comics, FAQs and pages.
              </p>
            ) : total === 0 ? (
              <div
                className="flex w-full flex-col"
                style={{ padding: "48px 0", gap: 12 }}
              >
                <p
                  className="font-barlow-condensed font-bold"
                  style={{ fontSize: 20, color: "var(--color-dark)" }}
                >
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p
                  className="font-barlow-condensed"
                  style={{ fontSize: 16, color: "var(--color-text-muted)" }}
                >
                  Try a different keyword, or{" "}
                  <Link href="/shop" className="underline" style={{ color: "var(--color-dark)" }}>
                    browse the shop
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="flex flex-col" style={{ gap: 48 }}>
                {RESULT_ORDER.map((type) => {
                  const items = grouped[type];
                  if (!items.length) return null;
                  return (
                    <ResultSection
                      key={type}
                      label={typeLabels[type]}
                      items={items}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterShop reveal />
    </div>
  );
}

function ResultSection({
  label,
  items,
}: {
  label: string;
  items: SearchItem[];
}) {
  return (
    <section className="flex flex-col" style={{ gap: 16 }}>
      <div className="flex items-baseline" style={{ gap: 12 }}>
        <h2
          className="font-barlow-condensed font-bold uppercase"
          style={{
            fontSize: 16,
            letterSpacing: "0.08em",
            color: "var(--color-text-muted)",
          }}
        >
          {label}
        </h2>
        <span
          className="font-barlow-condensed"
          style={{ fontSize: 12, color: "var(--color-text-muted)" }}
        >
          {items.length}
        </span>
      </div>
      <div className="flex flex-col">
        {items.map((item) => (
          <ResultLink key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function ResultLink({ item }: { item: SearchItem }) {
  return (
    <Link
      href={item.href}
      className="flex items-center no-underline"
      style={{
        gap: 20,
        padding: "16px 8px",
        borderBottom: "1px solid var(--color-border-light)",
      }}
    >
      {item.image ? (
        <div
          className="relative shrink-0"
          style={{
            width: 80,
            height: 80,
            background: "var(--color-light-bg)",
            overflow: "hidden",
          }}
        >
          <Image
            src={item.image}
            alt=""
            fill
            sizes="80px"
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : (
        <div
          className="flex shrink-0 items-center justify-center"
          style={{
            width: 80,
            height: 80,
            background: "var(--color-light-bg)",
            color: "var(--color-text-muted)",
            fontSize: 24,
          }}
        >
          ·
        </div>
      )}
      <div className="flex flex-1 flex-col" style={{ gap: 6, minWidth: 0 }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <span
            className="font-barlow-condensed font-bold"
            style={{ fontSize: 20, color: "var(--color-dark)" }}
          >
            {item.title}
          </span>
          {item.category && (
            <span
              className="font-barlow-condensed uppercase shrink-0"
              style={{
                fontSize: 10,
                letterSpacing: "0.06em",
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-border-light)",
                padding: "2px 8px",
              }}
            >
              {item.category}
            </span>
          )}
        </div>
        {item.description && (
          <span
            className="font-barlow-condensed"
            style={{ fontSize: 16, color: "var(--color-text-muted)", lineHeight: 1.5 }}
          >
            {item.description}
          </span>
        )}
      </div>
    </Link>
  );
}
