"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import VideoCard from "@/components/ui/VideoCard";
import { CHANNEL_URL, type Video, type VideoFormat } from "@/lib/videos";

type Filter = "all" | VideoFormat;

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "long", label: "Long form" },
  { key: "short", label: "Shorts" },
];

export default function VideosGallery({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState<Video | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-50px" });

  const close = useCallback(() => setActive(null), []);

  // Feature the newest long-form upload (landscape suits a wide hero); fall
  // back to the newest video of any kind. The rest fill the grid below.
  const featured = videos.find((v) => v.format === "long") ?? videos[0] ?? null;
  const rest = featured ? videos.filter((v) => v.id !== featured.id) : videos;

  const counts: Record<Filter, number> = {
    all: rest.length,
    long: rest.filter((v) => v.format === "long").length,
    short: rest.filter((v) => v.format === "short").length,
  };
  const shown = filter === "all" ? rest : rest.filter((v) => v.format === filter);

  // Hero uses a hi-res still; not every upload has maxres, so fall back on error.
  const [heroSrc, setHeroSrc] = useState(
    featured ? `https://i.ytimg.com/vi/${featured.id}/maxresdefault.jpg` : "",
  );

  // Lock body scroll and wire up Escape-to-close while the lightbox is open.
  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close]);

  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />

      <div className="relative z-[1]" style={{ paddingTop: 24, background: "white" }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 60px)" }}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Videos" }]} />
        </div>

        <section style={{ padding: "clamp(20px, 4vw, 40px) clamp(20px, 4vw, 60px) clamp(40px, 6vw, 80px)" }}>
          <div className="mx-auto" style={{ maxWidth: 1280 }}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-end justify-between"
              style={{ marginBottom: 32 }}
            >
              <div>
                <p className="font-barlow-condensed" style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 4 }}>
                  Watch &amp; Play
                </p>
                <h1 className="type-h1 uppercase" style={{ color: "var(--color-dark)" }}>
                  VIDEOS
                </h1>
              </div>
              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-barlow-condensed font-bold uppercase no-underline flex items-center gap-1 shrink-0"
                style={{ fontSize: 12, color: "var(--color-dark)", letterSpacing: "0.05em", textDecoration: "none" }}
              >
                VISIT YOUTUBE
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </motion.div>

            {/* Featured hero */}
            {featured && (
              <motion.button
                type="button"
                onClick={() => setActive(featured)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="group relative block w-full overflow-hidden text-left"
                style={{ marginBottom: 48, background: "var(--color-dark)", border: "none", padding: 0, cursor: "pointer" }}
                aria-label={`Play featured video: ${featured.title}`}
              >
                <div className="relative w-full" style={{ aspectRatio: "16/9", maxHeight: "62vh" }}>
                  {heroSrc && (
                    <Image
                      src={heroSrc}
                      alt={featured.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      onError={() => setHeroSrc(featured.thumbnail)}
                    />
                  )}
                  {/* Gradient scrim for legible overlay text */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(18,27,25,0.92) 0%, rgba(18,27,25,0.35) 45%, rgba(18,27,25,0) 75%)" }}
                  />
                  {/* Overlay content */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between" style={{ padding: "clamp(20px, 4vw, 48px)", gap: 24 }}>
                    <div style={{ maxWidth: 720 }}>
                      <span
                        className="inline-block font-barlow-condensed font-bold uppercase"
                        style={{ background: "var(--color-yellow)", color: "var(--color-dark)", padding: "4px 12px", fontSize: 12, letterSpacing: "0.08em", marginBottom: 16 }}
                      >
                        Featured
                      </span>
                      <h2 className="type-h2 uppercase" style={{ color: "white", marginBottom: 8 }}>
                        {featured.title}
                      </h2>
                      {featured.description && (
                        <p
                          className="font-barlow-body"
                          style={{
                            fontSize: 15,
                            color: "rgba(255,255,255,0.75)",
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {featured.description}
                        </p>
                      )}
                    </div>
                    <span
                      className="shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ width: 64, height: 64, background: "var(--color-yellow)" }}
                    >
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--color-dark)" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.button>
            )}

            {videos.length === 0 ? (
              <p className="font-barlow-condensed" style={{ fontSize: 18, color: "var(--color-text-muted)" }}>
                Videos are taking a break. Catch them straight on{" "}
                <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-dark)", fontWeight: 700 }}>
                  our YouTube channel
                </a>
                .
              </p>
            ) : rest.length === 0 ? null : (
              <>
                {/* Filter tabs */}
                <div className="flex flex-wrap items-center" style={{ gap: 8, marginBottom: 28 }}>
                  {TABS.map((tab) => {
                    const isActive = filter === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setFilter(tab.key)}
                        className="font-barlow-condensed font-bold uppercase transition-colors duration-200"
                        style={{
                          padding: "8px 18px",
                          fontSize: 13,
                          letterSpacing: "0.05em",
                          cursor: "pointer",
                          border: `1px solid ${isActive ? "var(--color-dark)" : "var(--color-border-light)"}`,
                          background: isActive ? "var(--color-dark)" : "transparent",
                          color: isActive ? "white" : "var(--color-dark)",
                        }}
                      >
                        {tab.label}
                        <span style={{ opacity: 0.6, marginLeft: 6 }}>{counts[tab.key]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Grid */}
                {shown.length === 0 ? (
                  <p className="font-barlow-condensed" style={{ fontSize: 18, color: "var(--color-text-muted)" }}>
                    No {filter === "short" ? "Shorts" : "long-form videos"} yet — check back soon.
                  </p>
                ) : (
                  <div
                    ref={gridRef}
                    className="columns-1 sm:columns-2 lg:columns-3"
                    style={{ columnGap: "clamp(16px, 3vw, 32px)" }}
                  >
                    {shown.map((video, i) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={gridInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.05 + (i % 3) * 0.08 }}
                        className="break-inside-avoid"
                        style={{ marginBottom: "clamp(16px, 3vw, 32px)" }}
                      >
                        <VideoCard video={video} onPlay={setActive} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <FooterShop reveal />

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ background: "rgba(10, 10, 10, 0.92)", padding: "clamp(16px, 4vw, 48px)" }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full flex flex-col"
              style={{ maxWidth: active.format === "short" ? 400 : 1100 }}
            >
              {/* Close — kept flush to the player's right edge */}
              <button
                type="button"
                onClick={close}
                aria-label="Close video"
                className="self-end font-barlow-condensed font-bold uppercase flex items-center gap-2"
                style={{ color: "white", background: "none", border: "none", cursor: "pointer", fontSize: 14, letterSpacing: "0.05em", marginBottom: 16 }}
              >
                Close
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="relative w-full" style={{ aspectRatio: active.format === "short" ? "9/16" : "16/9", background: "#000" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0`}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: "none" }}
                />
              </div>
              <p className="font-barlow-condensed font-bold uppercase" style={{ color: "white", fontSize: 18, marginTop: 16, letterSpacing: "-0.3px" }}>
                {active.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
