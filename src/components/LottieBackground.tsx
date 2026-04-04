"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "@lottielab/lottie-player/react";
import bgData from "../../public/lottie/bg-base.json";

const MOBILE_MAX_WIDTH = 767;

type Landmark = {
  transform: string;
  href: string;
  width: number;
  height: number;
  label?: string;
  description?: string;
};

const LANDMARKS: Landmark[] = [
  {
    transform: "matrix(0.9476, 0, 0, 0.9476, 391.7526, 1087.8248)",
    href: "/lottie/images/5tNFQBVxVizZ3bqzr6TPP7N2jbno9Z0.png",
    width: 773,
    height: 554,
    label: "National Stadium",
    description:
      "Hosting stadium of the the 1973 All-Africa Games and the 1980 African Cup of Nations.",
  },
  {
    transform: "matrix(0.8196, 0, 0, 0.8196, 57.5006, 1350.3082)",
    href: "/lottie/images/5tNBRb9k4XvHhDyTJLrx5Xj78RgkEV0.png",
    width: 653,
    height: 591,
    label: "Lagos Civic Center",
    description:
      "Glamorous waterfront venue on Victoria Island for all things fancy and fun",
  },
  {
    transform: "matrix(0.8, 0, 0, 0.8, 521.9, 1717.49)",
    href: "/lottie/images/5tQwVYCJN4x4YiDsZxgQLdGVXGv7Pp0.png",
    width: 439,
    height: 380,
    label: "CBN - Central Bank of Nigeria",
    description: "Nigeria's financial fortress",
  },
  {
    transform: "matrix(0.83, 0, 0, 0.83, -95.105, 1869.495)",
    href: "/lottie/images/5tPika29cLUFQc3vkb5C7eVMZg6Qvz0.png",
    width: 1087,
    height: 847,
    label: "Cathedral Church of Christ",
    description:
      "Lagos's oldest Anglican cathedral with stunning Gothic vibes",
  },
  {
    transform: "matrix(0.88, 0, 0, 0.88, 983.56, 2375.64)",
    href: "/lottie/images/5tPKC9DSj1p4ePUvtSTTNrWRJetatY0.png",
    width: 326,
    height: 369,
    label: "Aro Meta (3 Wise Men)",
    description:
      "An art deco statue of the ancestors welcoming you to Lagos.",
  },
  {
    transform: "matrix(0.67, 0, 0, 0.67, 1270.44, 1483.995)",
    href: "/lottie/images/5tNreFcFZRndsP66bby5TqFHHRHmWm0.png",
    width: 562,
    height: 389,
    label: "National Theatre",
    description:
      "A cultural icon shaped like a military hat and spotlighting Nigerian arts.",
  },
  {
    transform: "matrix(0.7, 0, 0, 0.7, 1484.2, 1947)",
    href: "/lottie/images/5tNLWNn4ADxrmgFW8JUT8gWvBhAVWi0.png",
    width: 408,
    height: 500,
    label: "1004 apartments",
    description:
      "Originally built in the 1970s as high-rise residential quarters for federal legislators",
  },
  {
    transform: "matrix(0.5, 0, 0, 0.5, 1165.75, 1718.6)",
    href: "/lottie/images/5tQm2RJyRBcVGeqjUpFTStJiagc6Zz0.png",
    width: 573,
    height: 514,
  },
  {
    transform: "matrix(0.8, 0, 0, 0.8, 1546.6, 2344.2)",
    href: "/lottie/images/5tQChrPArvYY8dzFoW3AU2KUV4ueZP0.png",
    width: 436,
    height: 312,
  },
  {
    transform: "matrix(0.8, 0, 0, 0.8, 697.5, 2572.5)",
    href: "/lottie/images/5tPJqD1y1nwGyi2gpbKdwStqPHs5tf0.png",
    width: 514,
    height: 646,
  },
  {
    transform: "matrix(0.8, 0, 0, 0.8, 1872.9, 1712.1)",
    href: "/lottie/images/5tNQoNDtscGo3nQbahymjzQNurM8xC0.png",
    width: 489,
    height: 391,
  },
  {
    transform: "matrix(0.46, 0, 0, 0.46, 1630.14, 2686.52)",
    href: "/lottie/images/5tPoVZseRWyJC6hGZskLmraUz6Xjy50.png",
    width: 82,
    height: 76,
  },
  {
    transform: "matrix(0.75, 0, 0, 0.75, 356.005, 2565.5)",
    href: "/lottie/images/5tPqHfU5aFyiirsSvfLpYtvi59uFby0.png",
    width: 367,
    height: 340,
  },
  {
    transform: "matrix(0.88, 0, 0, 0.88, 1144.9, 2110.76)",
    href: "/lottie/images/5tPW3JFXsVZzVdLp19Maspjdhfq9n60.png",
    width: 65,
    height: 46,
  },
  {
    transform: "matrix(0.74, 0, 0, 0.74, 1689.68, 2530.86)",
    href: "/lottie/images/5tPqDgHb7dQTgq7ghPuJd8ntXxJ8mg0.png",
    width: 278,
    height: 522,
    label: "Lekki-Ikoyi Link Bridge",
    description: "West Africa's first cable-stayed bridge",
  },
  {
    // Second instance — different position in the cityscape
    transform: "matrix(0.74, 0, 0, 0.74, 2747.14, 833.86)",
    href: "/lottie/images/5tPqDgHb7dQTgq7ghPuJd8ntXxJ8mg0.png",
    width: 278,
    height: 522,
    label: "Lekki-Ikoyi Link Bridge",
    description: "West Africa's first cable-stayed bridge",
  },
];

const STAGGER_STEP = 0.05;

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= MOBILE_MAX_WIDTH;
}

export default function LottieBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<any>(null);
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  const [tooltip, setTooltip] = useState<{
    label: string;
    description: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const check = () => {
      setMobile(isMobile());
      setViewportWidth(window.innerWidth);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handlePointerMove = (
    e: React.PointerEvent<SVGImageElement>,
    label: string,
    description: string,
  ) => {
    setTooltip({ label, description, x: e.clientX, y: e.clientY });
  };

  const handlePointerLeave = () => setTooltip(null);

  const isInteractive = (lm: Landmark) => !!lm.label;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none"
      style={{
        zIndex: 0,
        position: mounted && mobile ? "absolute" : "relative",
        inset: mounted && mobile ? 0 : "auto",
        width: "100%",
        height: mounted && mobile ? "100%" : "auto",
        aspectRatio: mounted && mobile ? "auto" : "1920 / 3000",
      }}
    >
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: Math.min(tooltip.x, viewportWidth - 300),
              top: tooltip.y - 120,
              pointerEvents: "none",
              backgroundColor: "#ffffff",
              color: "#111111",
              padding: "16px 20px",
              borderRadius: "4px",
              maxWidth: "280px",
              zIndex: 9999,
              boxShadow:
                "0px 8px 30px rgba(0,0,0,0.12), 0px 2px 10px rgba(0,0,0,0.05)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                paddingBottom: "6px",
              }}
            >
              {tooltip.label}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 400,
                color: "#333333",
                lineHeight: "1.4",
              }}
            >
              {tooltip.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {mounted && (
        <Lottie
          ref={lottieRef}
          lottie={bgData as any}
          autoplay
          loop
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        />
      )}

      <svg
        viewBox="0 0 1920 3000"
        preserveAspectRatio={
          mounted && mobile ? "xMidYMid slice" : "xMidYMid meet"
        }
        className="absolute inset-0 z-10 w-full h-full pointer-events-none"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {LANDMARKS.map((lm, i) => (
          <g key={i} transform={lm.transform}>
            <motion.image
              className="pointer-events-auto"
              href={lm.href}
              width={lm.width}
              height={lm.height}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.08,
                filter: "brightness(1.1)",
                cursor: isInteractive(lm) ? "pointer" : "default",
              }}
              viewport={{ once: true, margin: "0px" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: i * STAGGER_STEP,
              }}
              style={{ transformOrigin: "center" }}
              {...(isInteractive(lm) && {
                onPointerMove: (e: React.PointerEvent<SVGImageElement>) =>
                  handlePointerMove(e, lm.label!, lm.description!),
                onPointerLeave: handlePointerLeave,
              })}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
