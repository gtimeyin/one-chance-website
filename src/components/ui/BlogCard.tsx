"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      {/* Image */}
      <div className="relative" style={{ aspectRatio: "4/3", background: "var(--color-light-bg)", overflow: "hidden" }}>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Category tag */}
        <span
          className="absolute font-barlow font-bold"
          style={{
            bottom: 12,
            left: 12,
            padding: "4px 12px",
            background: post.categoryColor,
            color: "white",
            fontSize: 11,
            letterSpacing: "0.03em",
          }}
        >
          {post.category}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1"
          style={{ fontSize: 11, color: "var(--color-text-muted)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="font-barlow">{post.readTime}</span>
        </div>
      </div>

      {/* Title */}
      <Link
        href={`/updates/${post.slug}`}
        className="font-barlow-condensed font-extrabold uppercase no-underline"
        style={{
          fontSize: 18,
          color: "var(--color-dark)",
          textDecoration: "none",
          lineHeight: 1.2,
          letterSpacing: "-0.5px",
        }}
      >
        {post.title}
      </Link>

      {/* Description */}
      <p className="font-barlow" style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.5 }}>
        {post.description}
      </p>

      {/* Author + Date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="rounded-full flex items-center justify-center font-barlow font-bold"
            style={{
              width: 24,
              height: 24,
              background: post.categoryColor,
              color: "white",
              fontSize: 10,
            }}
          >
            {post.author.name.charAt(0)}
          </div>
          <div>
            <p className="font-barlow font-semibold" style={{ fontSize: 11, color: "var(--color-dark)" }}>
              {post.author.name}
            </p>
            <p className="font-barlow" style={{ fontSize: 10, color: "var(--color-text-muted)" }}>
              {post.date}
            </p>
          </div>
        </div>
        <Link
          href={`/updates/${post.slug}`}
          style={{ color: "var(--color-dark)", textDecoration: "none" }}
          aria-label={`Read ${post.title}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
