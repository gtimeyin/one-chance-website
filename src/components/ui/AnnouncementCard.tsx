"use client";

import Image from "next/image";
import Link from "next/link";
import type { Announcement } from "@/lib/blog";

interface AnnouncementCardProps {
  announcement: Announcement;
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Link href={`/updates/${announcement.slug}`} className="flex flex-col no-underline" style={{ gap: 12, textDecoration: "none" }}>
      {/* Image */}
      <div className="relative" style={{ aspectRatio: "4/3", background: "var(--color-light-bg)", overflow: "hidden" }}>
        <Image
          src={announcement.image}
          alt={announcement.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Date tag */}
        <span
          className="absolute font-barlow font-bold"
          style={{
            top: 12,
            left: 12,
            padding: "4px 12px",
            background: "var(--color-red)",
            color: "white",
            fontSize: 11,
          }}
        >
          {announcement.date}
        </span>
      </div>

      {/* Title + Arrow */}
      <div className="flex items-start justify-between">
        <p
          className="font-barlow-condensed font-extrabold uppercase"
          style={{
            fontSize: 18,
            color: "var(--color-dark)",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
          }}
        >
          {announcement.title}
        </p>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-dark)" strokeWidth="2" className="shrink-0" style={{ marginTop: 4 }}>
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>
    </Link>
  );
}
