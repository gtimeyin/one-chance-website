"use client";

import Image from "next/image";
import type { Video } from "@/lib/videos";

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  const date = formatDate(video.published);

  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group flex flex-col text-left w-full"
      style={{ gap: 12, background: "none", border: "none", padding: 0, cursor: "pointer" }}
    >
      {/* Thumbnail — Shorts are portrait, long-form is landscape */}
      <div className="relative" style={{ aspectRatio: video.format === "short" ? "9/16" : "16/9", background: "var(--color-light-bg)", overflow: "hidden" }}>
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Dark hover wash */}
        <div
          className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: "rgba(18, 27, 25, 0.35)" }}
        />
        {/* Shorts badge */}
        {video.format === "short" && (
          <span
            className="absolute font-barlow-condensed font-bold uppercase"
            style={{
              top: 12,
              left: 12,
              padding: "4px 10px",
              background: "var(--color-dark)",
              color: "white",
              fontSize: 11,
              letterSpacing: "0.04em",
            }}
          >
            Short
          </span>
        )}
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ width: 42, height: 42, background: "var(--color-yellow)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-dark)" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
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
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {video.title}
        </p>
        {date && (
          <p
            className="font-barlow-condensed"
            style={{ fontSize: 15, color: "var(--color-text-muted)", marginTop: 2 }}
          >
            {date}
          </p>
        )}
      </div>
    </button>
  );
}
