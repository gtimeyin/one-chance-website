"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FeatherSearch, FeatherX, FeatherArrowRight } from "@subframe/core";
import {
  filterSearch,
  groupByType,
  staticSearchItems,
  typeLabels,
  type SearchItem,
  type SearchItemType,
} from "@/lib/search";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const PREVIEW_LIMIT = 5;
const RESULT_ORDER: SearchItemType[] = [
  "product",
  "post",
  "comic",
  "announcement",
  "page",
  "faq",
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [productItems, setProductItems] = useState<SearchItem[] | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (productItems !== null || productsLoading) return;
    setProductsLoading(true);
    fetch("/api/search/products")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: { items: SearchItem[] }) => setProductItems(data.items))
      .catch(() => setProductsError(true))
      .finally(() => setProductsLoading(false));
  }, [isOpen, productItems, productsLoading]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const allItems = useMemo(
    () => [...(productItems ?? []), ...staticSearchItems],
    [productItems]
  );

  const grouped = useMemo(() => {
    const filtered = filterSearch(allItems, query);
    return groupByType(filtered);
  }, [allItems, query]);

  const totalMatches = useMemo(
    () => Object.values(grouped).reduce((sum, list) => sum + list.length, 0),
    [grouped]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 320 }}
          className="fixed inset-0 z-[70] flex h-full w-full flex-col"
          style={{ background: "white" }}
          role="dialog"
          aria-label="Search"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="fixed flex cursor-pointer items-center justify-center border-none bg-transparent z-[80]"
            style={{
              top: "clamp(20px, 4vw, 40px)",
              right: "clamp(20px, 4vw, 40px)",
              color: "var(--color-dark)",
              padding: 8,
            }}
          >
            <FeatherX style={{ fontSize: 32 }} />
          </button>

          <div
            className="flex w-full flex-1 justify-center overflow-y-auto"
            style={{ padding: "clamp(80px, 12vh, 160px) clamp(20px, 4vw, 48px) 64px" }}
          >
            <div className="flex w-full max-w-[720px] flex-col" style={{ gap: 32 }}>
              <form
                onSubmit={handleSubmit}
                className="flex items-center"
                style={{
                  gap: 16,
                  borderBottom: "2px solid var(--color-dark)",
                  paddingBottom: 16,
                }}
              >
                <FeatherSearch
                  style={{
                    fontSize: 28,
                    color: "var(--color-dark)",
                    flexShrink: 0,
                  }}
                />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, updates, pages…"
                  className="font-barlow-condensed flex-1 border-none bg-transparent outline-none"
                  style={{
                    fontSize: "clamp(24px, 4vw, 40px)",
                    fontWeight: 500,
                    color: "var(--color-dark)",
                  }}
                  autoComplete="off"
                  aria-label="Search query"
                />
              </form>

              <div className="flex flex-col">
                  {query.trim() === "" ? (
                    <EmptyState loading={productsLoading} error={productsError} />
                  ) : totalMatches === 0 ? (
                    <NoResults query={query} />
                  ) : (
                    <div className="flex flex-col" style={{ gap: 32 }}>
                      {RESULT_ORDER.map((type) => {
                        const items = grouped[type];
                        if (!items.length) return null;
                        return (
                          <ResultGroup
                            key={type}
                            label={typeLabels[type]}
                            items={items.slice(0, PREVIEW_LIMIT)}
                            totalCount={items.length}
                            onSelect={onClose}
                          />
                        );
                      })}

                      <div
                        className="flex w-full items-center justify-between"
                        style={{
                          borderTop: "1px solid var(--color-border-light)",
                          paddingTop: 16,
                        }}
                      >
                        <span
                          className="font-barlow-condensed"
                          style={{ fontSize: 16, color: "var(--color-text-muted)" }}
                        >
                          {totalMatches} {totalMatches === 1 ? "result" : "results"}
                        </span>
                        <button
                          onClick={handleSubmit}
                          className="font-barlow-condensed flex cursor-pointer items-center border-none uppercase"
                          style={{
                            gap: 8,
                            fontSize: 16,
                            fontWeight: 700,
                            color: "var(--color-dark)",
                            background: "var(--color-yellow)",
                            padding: "10px 16px",
                            letterSpacing: "0.05em",
                          }}
                        >
                          See all results
                          <FeatherArrowRight style={{ fontSize: 16 }} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ResultGroup({
  label,
  items,
  totalCount,
  onSelect,
}: {
  label: string;
  items: SearchItem[];
  totalCount: number;
  onSelect: () => void;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      <div className="flex items-center" style={{ gap: 12 }}>
        <h3
          className="font-barlow-condensed font-bold uppercase"
          style={{
            fontSize: 15,
            letterSpacing: "0.08em",
            color: "var(--color-text-muted)",
          }}
        >
          {label}
        </h3>
        {totalCount > items.length && (
          <span
            className="font-barlow-condensed"
            style={{ fontSize: 12, color: "var(--color-text-muted)" }}
          >
            ({items.length} of {totalCount})
          </span>
        )}
      </div>
      <div className="flex flex-col">
        {items.map((item) => (
          <ResultRow key={item.id} item={item} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function ResultRow({
  item,
  onSelect,
}: {
  item: SearchItem;
  onSelect: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className="flex items-center no-underline transition-colors"
      style={{
        gap: 16,
        padding: "12px 8px",
        borderBottom: "1px solid var(--color-border-light)",
      }}
    >
      {item.image ? (
        <div
          className="relative shrink-0"
          style={{
            width: 56,
            height: 56,
            background: "var(--color-light-bg)",
            overflow: "hidden",
          }}
        >
          <Image
            src={item.image}
            alt=""
            fill
            sizes="56px"
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : (
        <div
          className="flex shrink-0 items-center justify-center"
          style={{
            width: 56,
            height: 56,
            background: "var(--color-light-bg)",
            color: "var(--color-text-muted)",
          }}
        >
          <FeatherSearch style={{ fontSize: 20 }} />
        </div>
      )}
      <div className="flex flex-1 flex-col" style={{ gap: 4, minWidth: 0 }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <span
            className="font-barlow-condensed font-bold truncate"
            style={{ fontSize: 16, color: "var(--color-dark)" }}
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
                padding: "2px 6px",
              }}
            >
              {item.category}
            </span>
          )}
        </div>
        {item.description && (
          <span
            className="font-barlow-condensed line-clamp-1"
            style={{ fontSize: 15, color: "var(--color-text-muted)" }}
          >
            {item.description}
          </span>
        )}
      </div>
      <FeatherArrowRight
        style={{ fontSize: 18, color: "var(--color-text-muted)", flexShrink: 0 }}
      />
    </Link>
  );
}

function EmptyState({
  loading,
  error,
}: {
  loading: boolean;
  error: boolean;
}) {
  return (
    <div
      className="flex w-full flex-col items-center justify-center"
      style={{ padding: "48px 16px", gap: 8 }}
    >
      <FeatherSearch
        style={{ fontSize: 32, color: "var(--color-text-muted)" }}
      />
      <p
        className="font-barlow-condensed"
        style={{ fontSize: 16, color: "var(--color-text-muted)" }}
      >
        Start typing to search products, updates, comics, FAQs and more.
      </p>
      {loading && (
        <p
          className="font-barlow-condensed"
          style={{ fontSize: 12, color: "var(--color-text-muted)" }}
        >
          Loading product catalog…
        </p>
      )}
      {error && (
        <p
          className="font-barlow-condensed"
          style={{ fontSize: 12, color: "var(--color-red)" }}
        >
          Couldn&apos;t load products — other results will still work.
        </p>
      )}
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div
      className="flex w-full flex-col items-center justify-center"
      style={{ padding: "48px 16px", gap: 8 }}
    >
      <p
        className="font-barlow-condensed font-bold"
        style={{ fontSize: 18, color: "var(--color-dark)" }}
      >
        No results for &ldquo;{query}&rdquo;
      </p>
      <p
        className="font-barlow-condensed"
        style={{ fontSize: 16, color: "var(--color-text-muted)" }}
      >
        Try a different keyword or browse the{" "}
        <Link
          href="/shop"
          className="underline"
          style={{ color: "var(--color-dark)" }}
        >
          shop
        </Link>
        .
      </p>
    </div>
  );
}
