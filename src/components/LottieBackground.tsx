"use client";

import { useEffect, useRef, useState } from "react";

const MOBILE_MAX_WIDTH = 767;

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= MOBILE_MAX_WIDTH;
}

type LottiePlayerEl = HTMLElement & {
  animation?: { resize?: () => void };
};

export default function LottieBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLElement | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(isMobile());
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    let cancelled = false;

    import("@lottielab/lottie-player").then(() => {
      if (cancelled || !containerRef.current) return;
      if (containerRef.current.querySelector("lottie-player")) return;

      const player = document.createElement("lottie-player");
      playerRef.current = player;
      player.setAttribute("src", "https://cdn.lottielab.com/l/5r47KJVgYxj2zz.json");
      player.setAttribute("autoplay", "");
      player.setAttribute("loop", "");
      player.style.display = "block";
      containerRef.current.appendChild(player);
    });

    return () => {
      cancelled = true;
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const el = player as LottiePlayerEl;

    if (mobile) {
      player.setAttribute("preserveAspectRatio", "xMidYMid slice");
      player.style.width = "100%";
      player.style.height = "100%";
      player.style.position = "absolute";
      player.style.top = "0";
      player.style.left = "0";
    } else {
      player.setAttribute("preserveAspectRatio", "xMidYMid meet");
      player.style.width = "100%";
      player.style.height = "auto";
      player.style.position = "";
      player.style.top = "";
      player.style.left = "";
    }
    el.animation?.resize?.();
  }, [mobile]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none"
      style={{
        zIndex: 0,
        ...(mobile
          ? { position: "absolute" as const, inset: 0, width: "100%", height: "100%" }
          : { position: "relative" as const, width: "100%" }
        ),
      }}
    />
  );
}
