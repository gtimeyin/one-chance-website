"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className="w-full"
      style={{
        maxWidth: 1280,
        padding: "20px 0",
        margin: "0 auto",
      }}
    >
      <ol className="flex items-center gap-2 font-barlow" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
            {item.href ? (
              <Link
                href={item.href}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-dark)",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
