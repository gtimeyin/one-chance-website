"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  FeatherArrowLeft,
  FeatherArrowRight,
  FeatherAlignJustify,
  FeatherLayout,
  FeatherX,
} from "@subframe/core";
import type { Comic, ComicPanel } from "@/lib/blog";

type Mode = "cover" | "vertical" | "horizontal";

interface ComicViewerProps {
  comic: Comic;
}

export default function ComicViewer({ comic }: ComicViewerProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("cover");

  // Fall back to the grid image (or thumbnail) when panels aren't uploaded yet
  // so the viewer is still testable end-to-end.
  const panels = useMemo<ComicPanel[]>(() => {
    if (comic.panels && comic.panels.length > 0) return comic.panels;
    const fallback = comic.gridImage || comic.image;
    return fallback ? [{ src: fallback }] : [];
  }, [comic]);

  const handleClose = () => router.push("/updates");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full text-white" style={{ background: "#0a0a0a" }}>
      {mode === "cover" && (
        <CoverSplash
          comic={comic}
          onEnter={(m) => setMode(m)}
          onClose={handleClose}
        />
      )}
      {mode === "vertical" && (
        <VerticalReader
          panels={panels}
          comic={comic}
          onSwitchMode={() => setMode("horizontal")}
          onClose={handleClose}
        />
      )}
      {mode === "horizontal" && (
        <HorizontalReader
          panels={panels}
          comic={comic}
          onSwitchMode={() => setMode("vertical")}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cover splash                                                       */
/* ------------------------------------------------------------------ */

function CoverSplash({
  comic,
  onEnter,
  onClose,
}: {
  comic: Comic;
  onEnter: (mode: Mode) => void;
  onClose: () => void;
}) {
  const cover = comic.gridImage || comic.image;
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden"
    >
      {/* Blurred backdrop layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(48px) brightness(0.35)",
          transform: "scale(1.15)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.9) 90%)",
        }}
      />

      {/* Close */}
      <TopBar onClose={onClose} title={comic.episode} />

      {/* Content */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-[2] flex w-full max-w-[1200px] flex-col items-center"
        style={{ padding: "0 clamp(20px, 4vw, 48px)", gap: 32 }}
      >
        <span className="type-eyebrow" style={{ color: "var(--color-yellow)" }}>
          {comic.episode}
        </span>

        <h1
          className="type-display text-center uppercase"
          style={{ color: "white" }}
        >
          {comic.title}
        </h1>

        {comic.subtitle && (
          <p
            className="type-body-lg text-center"
            style={{ color: "rgba(255,255,255,0.7)", maxWidth: 680 }}
          >
            {comic.subtitle}
          </p>
        )}

        {/* Cover art card */}
        <motion.div
          initial={{ y: 16, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full"
          style={{
            maxWidth: 640,
            aspectRatio: "3 / 4",
            boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Image
            src={cover}
            alt={comic.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 640px"
            style={{ objectFit: "cover" }}
          />
        </motion.div>

        {/* Mode picker */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center"
          style={{ gap: 12, marginTop: 12 }}
        >
          <ModeButton
            label="Read vertically"
            hint="Scroll to advance"
            icon={<FeatherAlignJustify />}
            onClick={() => onEnter("vertical")}
            primary
          />
          <ModeButton
            label="Read as pages"
            hint="Arrow keys or swipe"
            icon={<FeatherLayout />}
            onClick={() => onEnter("horizontal")}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function ModeButton({
  label,
  hint,
  icon,
  onClick,
  primary,
}: {
  label: string;
  hint: string;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer border-none flex items-center transition-all"
      style={{
        gap: 12,
        padding: "16px 24px",
        background: primary ? "var(--color-yellow)" : "rgba(255,255,255,0.08)",
        color: primary ? "var(--color-dark)" : "white",
        border: primary ? "none" : "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <span style={{ fontSize: 20, display: "flex" }}>{icon}</span>
      <span className="flex flex-col items-start" style={{ gap: 2 }}>
        <span
          className="font-barlow-condensed font-bold uppercase"
          style={{ fontSize: 14, letterSpacing: "0.06em", lineHeight: 1 }}
        >
          {label}
        </span>
        <span
          className="font-barlow-body"
          style={{
            fontSize: 11,
            opacity: 0.7,
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
        >
          {hint}
        </span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared UI                                                          */
/* ------------------------------------------------------------------ */

function TopBar({
  onClose,
  title,
  onSwitchMode,
  modeLabel,
  progress,
  autoHide,
}: {
  onClose: () => void;
  title: string;
  onSwitchMode?: () => void;
  modeLabel?: string;
  progress?: number; // 0..1
  autoHide?: boolean;
}) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!autoHide) return;
    let timer: ReturnType<typeof setTimeout>;
    const wake = () => {
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 2600);
    };
    wake();
    window.addEventListener("mousemove", wake);
    window.addEventListener("touchstart", wake);
    window.addEventListener("keydown", wake);
    window.addEventListener("wheel", wake, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("touchstart", wake);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("wheel", wake);
    };
  }, [autoHide]);

  return (
    <AnimatePresence>
      {(!autoHide || visible) && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 right-0 z-[80] flex w-full items-center justify-between"
          style={{
            padding: "16px clamp(16px, 4vw, 32px)",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0))",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comic"
            className="flex cursor-pointer items-center border-none"
            style={{
              gap: 8,
              padding: "8px 12px",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              backdropFilter: "blur(12px)",
            }}
          >
            <FeatherX style={{ fontSize: 18 }} />
            <span
              className="font-barlow-condensed font-bold uppercase"
              style={{ fontSize: 12, letterSpacing: "0.08em" }}
            >
              Close
            </span>
          </button>

          <span
            className="font-barlow-condensed font-bold uppercase truncate"
            style={{
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "50%",
            }}
          >
            {title}
          </span>

          {onSwitchMode ? (
            <button
              type="button"
              onClick={onSwitchMode}
              className="flex cursor-pointer items-center border-none"
              style={{
                gap: 8,
                padding: "8px 12px",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                backdropFilter: "blur(12px)",
              }}
            >
              <span
                className="font-barlow-condensed font-bold uppercase"
                style={{ fontSize: 12, letterSpacing: "0.08em" }}
              >
                {modeLabel}
              </span>
            </button>
          ) : (
            <span style={{ width: 60 }} />
          )}

          {typeof progress === "number" && (
            <div
              className="absolute bottom-0 left-0"
              style={{
                height: 2,
                width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
                background: "var(--color-yellow)",
                transition: "width 200ms linear",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Vertical reader                                                    */
/* ------------------------------------------------------------------ */

function VerticalReader({
  panels,
  comic,
  onSwitchMode,
  onClose,
}: {
  panels: ComicPanel[];
  comic: Comic;
  onSwitchMode: () => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10] overflow-y-auto"
      style={{ background: "#0a0a0a", overscrollBehavior: "contain" }}
    >
      <TopBar
        onClose={onClose}
        title={`${comic.episode} · ${comic.title}`}
        onSwitchMode={onSwitchMode}
        modeLabel="Switch to pages"
        progress={progress}
        autoHide
      />

      <div className="flex w-full flex-col items-center" style={{ padding: "88px 16px 96px", gap: 32 }}>
        {panels.map((panel, i) => (
          <VerticalPanel key={i} panel={panel} index={i} total={panels.length} />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
          style={{ gap: 20, paddingTop: 32 }}
        >
          <span
            className="type-eyebrow"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            End of episode
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-barlow-condensed font-bold uppercase cursor-pointer border-none"
            style={{
              padding: "14px 28px",
              background: "var(--color-yellow)",
              color: "var(--color-dark)",
              fontSize: 14,
              letterSpacing: "0.08em",
            }}
          >
            Back to Updates
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function VerticalPanel({
  panel,
  index,
  total,
}: {
  panel: ComicPanel;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.7]);

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, opacity, maxWidth: 1100, width: "100%" }}
      className="relative"
    >
      <div
        className="relative w-full"
        style={{
          background: "#1a1a1a",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <ComicImage src={panel.src} alt={panel.caption || `Panel ${index + 1}`} priority={index < 2} />
      </div>
      <div
        className="flex items-center justify-between"
        style={{ padding: "12px 4px 0", gap: 12 }}
      >
        {panel.caption ? (
          <p
            className="font-barlow-body"
            style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", flex: 1 }}
          >
            {panel.caption}
          </p>
        ) : (
          <span />
        )}
        <span
          className="font-barlow-condensed"
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.08em",
          }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Horizontal reader                                                  */
/* ------------------------------------------------------------------ */

function HorizontalReader({
  panels,
  comic,
  onSwitchMode,
  onClose,
}: {
  panels: ComicPanel[];
  comic: Comic;
  onSwitchMode: () => void;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const total = panels.length;

  const next = () => {
    if (index < total - 1) {
      setDirection(1);
      setIndex(index + 1);
    }
  };
  const prev = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex(index - 1);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "Home") setIndex(0);
      else if (e.key === "End") setIndex(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 48) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };

  const panel = panels[index];
  const progress = total > 1 ? index / (total - 1) : 1;

  return (
    <div
      className="fixed inset-0 z-[10] flex flex-col"
      style={{ background: "#0a0a0a" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <TopBar
        onClose={onClose}
        title={`${comic.episode} · ${comic.title}`}
        onSwitchMode={onSwitchMode}
        modeLabel="Switch to scroll"
        progress={progress}
      />

      {/* Prev / next click zones (invisible, cover left/right thirds) */}
      <button
        type="button"
        onClick={prev}
        disabled={index === 0}
        aria-label="Previous panel"
        className="absolute cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ left: 0, top: 0, width: "20%", height: "100%", background: "transparent", zIndex: 20 }}
      />
      <button
        type="button"
        onClick={next}
        disabled={index >= total - 1}
        aria-label="Next panel"
        className="absolute cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ right: 0, top: 0, width: "20%", height: "100%", background: "transparent", zIndex: 20 }}
      />

      {/* Visible arrow chips */}
      <NavArrow direction="left" onClick={prev} disabled={index === 0} />
      <NavArrow direction="right" onClick={next} disabled={index >= total - 1} />

      {/* Panel stage */}
      <div className="flex flex-1 items-center justify-center overflow-hidden" style={{ padding: "64px 16px 64px" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ x: direction * 60, opacity: 0, scale: 0.98 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -direction * 60, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full w-full items-center justify-center"
            style={{ maxWidth: 1100 }}
          >
            <ComicImage src={panel.src} alt={panel.caption || `Panel ${index + 1}`} priority contain />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div
        className="flex items-center justify-center"
        style={{ padding: "0 16px 24px", gap: 6 }}
      >
        {panels.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            aria-label={`Go to panel ${i + 1}`}
            className="cursor-pointer border-none"
            style={{
              width: i === index ? 24 : 8,
              height: 8,
              background: i === index ? "var(--color-yellow)" : "rgba(255,255,255,0.25)",
              transition: "width 240ms, background 240ms",
            }}
          />
        ))}
      </div>

      {panel.caption && (
        <div className="flex items-center justify-center" style={{ padding: "0 24px 24px" }}>
          <p
            className="font-barlow-body text-center"
            style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", maxWidth: 720 }}
          >
            {panel.caption}
          </p>
        </div>
      )}
    </div>
  );
}

function NavArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === "left" ? FeatherArrowLeft : FeatherArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="absolute cursor-pointer border-none flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform"
      style={{
        [direction === "left" ? "left" : "right"]: 24,
        top: "50%",
        transform: "translateY(-50%)",
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.1)",
        color: "white",
        backdropFilter: "blur(12px)",
        zIndex: 30,
      }}
    >
      <Icon style={{ fontSize: 22 }} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Image with graceful fallback                                       */
/* ------------------------------------------------------------------ */

function ComicImage({
  src,
  alt,
  priority,
  contain,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  contain?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="relative flex w-full items-center justify-center"
        style={{
          aspectRatio: contain ? undefined : "4 / 5",
          height: contain ? "100%" : undefined,
          background:
            "repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 12px, #222 12px, #222 24px)",
          color: "rgba(255,255,255,0.35)",
          padding: 24,
        }}
      >
        <span
          className="font-barlow-condensed text-center"
          style={{ fontSize: 13, letterSpacing: "0.06em" }}
        >
          Drop the image at {src.replace(/^\/+/, "")}
        </span>
      </div>
    );
  }
  return (
    <div
      className="relative w-full"
      style={
        contain
          ? { height: "100%" }
          : { aspectRatio: "4 / 5" }
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 1100px"
        style={{ objectFit: contain ? "contain" : "cover" }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
