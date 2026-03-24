"use client";

import { useEffect, useRef } from "react";

export default function LottieBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("@lottielab/lottie-player").then(() => {
      if (containerRef.current && !containerRef.current.querySelector("lottie-player")) {
        const player = document.createElement("lottie-player");
        player.setAttribute("src", "https://cdn.lottielab.com/l/5r47KJVgYxj2zz.json");
        player.setAttribute("autoplay", "");
        player.setAttribute("loop", "");
        player.style.width = "100%";
        player.style.height = "auto";
        player.style.display = "block";
        containerRef.current.appendChild(player);
      }
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
