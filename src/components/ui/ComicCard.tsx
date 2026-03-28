"use client";

import Image from "next/image";
import Link from "next/link";
import type { Comic } from "@/lib/blog";

interface ComicCardProps {
  comic: Comic;
}

export default function ComicCard({ comic }: ComicCardProps) {
  return (
    <Link href={`/updates/${comic.slug}`} className="flex flex-col no-underline" style={{ gap: 12, textDecoration: "none" }}>
      {/* Image */}
      <div className="relative" style={{ aspectRatio: "4/3", background: "var(--color-light-bg)", overflow: "hidden" }}>
        <Image
          src={comic.image}
          alt={comic.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Episode tag */}
        <span
          className="absolute font-barlow font-bold"
          style={{
            top: 12,
            left: 12,
            padding: "4px 12px",
            background: "var(--color-dark)",
            color: "white",
            fontSize: 11,
            letterSpacing: "0.02em",
          }}
        >
          {comic.episode}
        </span>
      </div>

      {/* Title */}
      <div>
        <p
          className="font-barlow-condensed font-extrabold uppercase"
          style={{
            fontSize: 18,
            color: "var(--color-dark)",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
          }}
        >
          {comic.title}
        </p>
        <p
          className="font-barlow"
          style={{
            fontSize: 14,
            color: "var(--color-text-muted)",
            marginTop: 2,
          }}
        >
          {comic.subtitle}
        </p>
      </div>
    </Link>
  );
}
