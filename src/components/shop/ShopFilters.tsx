"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Select } from "@/ui/components/Select";
import type { WooCategory } from "@/lib/woocommerce";

export interface SortOption {
  key: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { key: "latest", label: "Latest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "popularity", label: "Popularity" },
  { key: "rating", label: "Top rated" },
];

interface ShopFiltersProps {
  categories: WooCategory[];
  activeCategory: string | null;
  activeSort: string;
}

export default function ShopFilters({
  categories,
  activeCategory,
  activeSort,
}: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value.length > 0) params.set(key, value);
    else params.delete(key);
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      style={{
        gap: 16,
        marginBottom: 32,
        opacity: pending ? 0.6 : 1,
        transition: "opacity 0.15s",
      }}
    >
      <div className="flex flex-wrap items-center" style={{ gap: 8 }}>
        <FilterPill
          label="All"
          active={!activeCategory}
          onClick={() => update("category", null)}
        />
        {categories.map((c) => (
          <FilterPill
            key={c.id}
            label={c.name}
            count={c.count}
            active={activeCategory === c.slug}
            onClick={() => update("category", c.slug)}
          />
        ))}
      </div>

      <div className="flex items-center" style={{ gap: 12 }}>
        <span
          className="font-barlow-condensed"
          style={{ fontSize: 14, color: "var(--color-text-muted)" }}
        >
          Sort by
        </span>
        <Select
          value={activeSort}
          onValueChange={(v) => update("sort", v === "latest" ? null : v)}
          className="min-w-[220px] [&>div]:!h-[46px] [&>div]:!rounded-[4px]"
        >
          {SORT_OPTIONS.map((o) => (
            <Select.Item key={o.key} value={o.key}>
              {o.label}
            </Select.Item>
          ))}
        </Select>
      </div>
    </div>
  );
}

interface FilterPillProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

function FilterPill({ label, count, active, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-barlow-condensed font-medium uppercase cursor-pointer flex items-center"
      style={{
        padding: "12px 24px",
        border: `1px solid ${active ? "var(--color-dark)" : "var(--color-border-light)"}`,
        background: active ? "var(--color-dark)" : "white",
        color: active ? "white" : "var(--color-dark)",
        fontSize: 14,
        letterSpacing: "0.05em",
        gap: 8,
        borderRadius: 999,
      }}
    >
      {label}
      {typeof count === "number" && (
        <span style={{ opacity: 0.6, fontSize: 12 }}>{count}</span>
      )}
    </button>
  );
}
