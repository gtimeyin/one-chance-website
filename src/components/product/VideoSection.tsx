"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

interface VideoSectionProps {
  videoUrl: string;
  headline?: string;
}

const DEFAULT_HEADLINE =
  "HEY! READING IS THE WORST WAY TO LEARN HOW TO PLAY A GAME.\nWATCH THIS INSTEAD";

function getEmbedUrl(url: string): { type: "iframe" | "video"; src: string } | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      if (id) return { type: "iframe", src: `https://www.youtube.com/embed/${id}?autoplay=1` };
    }
    if (host === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "");
      if (id) return { type: "iframe", src: `https://www.youtube.com/embed/${id}?autoplay=1` };
    }
    if (host === "vimeo.com") {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      if (id) return { type: "iframe", src: `https://player.vimeo.com/video/${id}?autoplay=1` };
    }
    if (/\.(mp4|webm|ogg)$/i.test(parsed.pathname)) {
      return { type: "video", src: url };
    }
    return { type: "iframe", src: url };
  } catch {
    return null;
  }
}

export default function VideoSection({ videoUrl, headline }: VideoSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [playing, setPlaying] = useState(false);

  const embed = getEmbedUrl(videoUrl);
  if (!embed) return null;

  const text = (headline || DEFAULT_HEADLINE).split("\n");

  return (
    <section
      ref={ref}
      className="w-full"
      style={{
        padding: "clamp(60px, 6vw, 96px) clamp(20px, 4vw, 60px)",
        background: "#FFD600",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 1280 }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-barlow-condensed font-extrabold uppercase"
          style={{
            fontSize: "clamp(32px, 5vw, 64px)",
            color: "black",
            letterSpacing: "-0.02em",
            lineHeight: "100%",
            marginBottom: 48,
            maxWidth: 800,
          }}
        >
          {text.map((line, i) => (
            <span key={i}>
              {line}
              {i < text.length - 1 && <br />}
            </span>
          ))}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full flex items-center justify-center"
          style={{
            aspectRatio: "16/9",
            background: "black",
            maxWidth: 1000,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            cursor: playing ? "default" : "pointer",
          }}
          onClick={() => !playing && setPlaying(true)}
        >
          {playing ? (
            embed.type === "iframe" ? (
              <iframe
                src={embed.src}
                title="Product video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: 0 }}
              />
            ) : (
              <video
                src={embed.src}
                controls
                autoPlay
                style={{ width: "100%", height: "100%" }}
              />
            )
          ) : (
            <div className="flex items-center gap-3" style={{ color: "white" }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "var(--color-yellow)",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--color-dark)">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span
                className="font-barlow-condensed font-bold uppercase"
                style={{ fontSize: 16, letterSpacing: "0.05em" }}
              >
                WATCH HOW TO PLAY
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
