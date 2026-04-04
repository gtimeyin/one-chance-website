"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "@lottielab/lottie-player/react";
import bgData from "../../public/lottie/bg-base.json";

const MOBILE_MAX_WIDTH = 767;

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= MOBILE_MAX_WIDTH;
}

export default function LottieBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<any>(null);
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [tooltip, setTooltip] = useState<{
    id: string;
    main: string;
    sub: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const check = () => setMobile(isMobile());
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handlePointerMove = (
    e: React.PointerEvent,
    main: string,
    sub: string,
  ) => {
    // Offset slightly so cursor does not obscure tooltip
    setTooltip({ id: main, main, sub, x: e.clientX, y: e.clientY });
  };

  const handlePointerLeave = () => {
    setTooltip(null);
  };

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
              left: Math.min(
                tooltip.x,
                typeof window !== "undefined"
                  ? window.innerWidth - 300
                  : tooltip.x,
              ),
              top: tooltip.y - 120, // Offset above the cursor
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
              {tooltip.main}
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
              {tooltip.sub}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Base Animation Player (Keeps train jumping/looping perfectly!) */}
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

      {/* Interactive Framer Overlay */}
      <svg
        viewBox={`0 0 1920 3000`}
        preserveAspectRatio={
          mounted && mobile ? "xMidYMid slice" : "xMidYMid meet"
        }
        className="absolute inset-0 z-10 w-full h-full pointer-events-none"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <g transform="matrix(0.94760, 0.00000, 0.00000, 0.94760, 391.75260, 1087.82480)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tNFQBVxVizZ3bqzr6TPP7N2jbno9Z0.png"}
            width={773}
            height={554}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "pointer",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0,
            }}
            style={{ transformOrigin: "center" }}
            onPointerMove={(e) =>
              handlePointerMove(
                e as any,
                `National Stadium`,
                `Hosting stadium of the the 1973 All-Africa Games and the 1980 African Cup of Nations.`,
              )
            }
            onPointerLeave={handlePointerLeave}
          />
        </g>
        <g transform="matrix(0.81960, 0.00000, 0.00000, 0.81960, 57.50060, 1350.30820)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tNBRb9k4XvHhDyTJLrx5Xj78RgkEV0.png"}
            width={653}
            height={591}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "pointer",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.05,
            }}
            style={{ transformOrigin: "center" }}
            onPointerMove={(e) =>
              handlePointerMove(
                e as any,
                `Lagos Civic Center`,
                `Glamorous waterfront venue on Victoria Island for all things fancy and fun`,
              )
            }
            onPointerLeave={handlePointerLeave}
          />
        </g>
        <g transform="matrix(0.80000, 0.00000, 0.00000, 0.80000, 521.90000, 1717.49000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tQwVYCJN4x4YiDsZxgQLdGVXGv7Pp0.png"}
            width={439}
            height={380}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "pointer",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            style={{ transformOrigin: "center" }}
            onPointerMove={(e) =>
              handlePointerMove(
                e as any,
                `CBN - Central Bank of Nigeria`,
                `Nigeria's financial fortress`,
              )
            }
            onPointerLeave={handlePointerLeave}
          />
        </g>
        <g transform="matrix(0.83000, 0.00000, 0.00000, 0.83000, -95.10500, 1869.49500)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tPika29cLUFQc3vkb5C7eVMZg6Qvz0.png"}
            width={1087}
            height={847}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "pointer",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.15000000000000002,
            }}
            style={{ transformOrigin: "center" }}
            onPointerMove={(e) =>
              handlePointerMove(
                e as any,
                `Cathedral Church of Christ`,
                `Lagos’s oldest Anglican cathedral with stunning Gothic vibes`,
              )
            }
            onPointerLeave={handlePointerLeave}
          />
        </g>
        <g transform="matrix(0.88000, 0.00000, 0.00000, 0.88000, 983.56000, 2375.64000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tPKC9DSj1p4ePUvtSTTNrWRJetatY0.png"}
            width={326}
            height={369}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "pointer",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.2,
            }}
            style={{ transformOrigin: "center" }}
            onPointerMove={(e) =>
              handlePointerMove(
                e as any,
                `Aro Meta (3 Wise Men)`,
                `An art deco statue of the ancestors welcoming you to Lagos.`,
              )
            }
            onPointerLeave={handlePointerLeave}
          />
        </g>
        <g transform="matrix(0.67000, 0.00000, 0.00000, 0.67000, 1270.44000, 1483.99500)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tNreFcFZRndsP66bby5TqFHHRHmWm0.png"}
            width={562}
            height={389}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "pointer",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.25,
            }}
            style={{ transformOrigin: "center" }}
            onPointerMove={(e) =>
              handlePointerMove(
                e as any,
                `National Theatre`,
                `A cultural icon shaped like a military hat and spotlighting Nigerian arts.`,
              )
            }
            onPointerLeave={handlePointerLeave}
          />
        </g>
        <g transform="matrix(0.70000, 0.00000, 0.00000, 0.70000, 1484.20000, 1947.00000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tNLWNn4ADxrmgFW8JUT8gWvBhAVWi0.png"}
            width={408}
            height={500}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "pointer",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.30000000000000004,
            }}
            style={{ transformOrigin: "center" }}
            onPointerMove={(e) =>
              handlePointerMove(
                e as any,
                `1004 apartments`,
                `Originally built in the 1970s as high-rise residential quarters for federal legislators`,
              )
            }
            onPointerLeave={handlePointerLeave}
          />
        </g>
        <g transform="matrix(0.50000, 0.00000, 0.00000, 0.50000, 1165.75000, 1718.60000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tQm2RJyRBcVGeqjUpFTStJiagc6Zz0.png"}
            width={573}
            height={514}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "default",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.35000000000000003,
            }}
            style={{ transformOrigin: "center" }}
          />
        </g>
        <g transform="matrix(0.80000, 0.00000, 0.00000, 0.80000, 1546.60000, 2344.20000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tQChrPArvYY8dzFoW3AU2KUV4ueZP0.png"}
            width={436}
            height={312}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "default",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.4,
            }}
            style={{ transformOrigin: "center" }}
          />
        </g>
        <g transform="matrix(0.80000, 0.00000, 0.00000, 0.80000, 697.50000, 2572.50000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tPJqD1y1nwGyi2gpbKdwStqPHs5tf0.png"}
            width={514}
            height={646}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "default",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.45,
            }}
            style={{ transformOrigin: "center" }}
          />
        </g>
        <g transform="matrix(0.80000, 0.00000, 0.00000, 0.80000, 1872.90000, 1712.10000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tNQoNDtscGo3nQbahymjzQNurM8xC0.png"}
            width={489}
            height={391}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "default",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.5,
            }}
            style={{ transformOrigin: "center" }}
          />
        </g>
        <g transform="matrix(0.46000, 0.00000, 0.00000, 0.46000, 1630.14000, 2686.52000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tPoVZseRWyJC6hGZskLmraUz6Xjy50.png"}
            width={82}
            height={76}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "default",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.55,
            }}
            style={{ transformOrigin: "center" }}
          />
        </g>
        <g transform="matrix(0.75000, 0.00000, 0.00000, 0.75000, 356.00500, 2565.50000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tPqHfU5aFyiirsSvfLpYtvi59uFby0.png"}
            width={367}
            height={340}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "default",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.6000000000000001,
            }}
            style={{ transformOrigin: "center" }}
          />
        </g>
        <g transform="matrix(0.88000, 0.00000, 0.00000, 0.88000, 1144.90000, 2110.76000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tPW3JFXsVZzVdLp19Maspjdhfq9n60.png"}
            width={65}
            height={46}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "default",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.65,
            }}
            style={{ transformOrigin: "center" }}
          />
        </g>
        <g transform="matrix(0.74000, 0.00000, 0.00000, 0.74000, 1689.68000, 2530.86000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tPqDgHb7dQTgq7ghPuJd8ntXxJ8mg0.png"}
            width={278}
            height={522}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "pointer",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.7000000000000001,
            }}
            style={{ transformOrigin: "center" }}
            onPointerMove={(e) =>
              handlePointerMove(
                e as any,
                `Lekki-Ikoyi Link Bridge`,
                `West Africa’s first cable-stayed bridge`,
              )
            }
            onPointerLeave={handlePointerLeave}
          />
        </g>
        <g transform="matrix(0.74000, 0.00000, 0.00000, 0.74000, 2747.14000, 833.86000)">
          <motion.image
            className="pointer-events-auto"
            href={"/lottie/images/5tPqDgHb7dQTgq7ghPuJd8ntXxJ8mg0.png"}
            width={278}
            height={522}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1.0, scale: 1 }}
            whileHover={{
              scale: 1.08,
              filter: "brightness(1.1)",
              cursor: "pointer",
            }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.75,
            }}
            style={{ transformOrigin: "center" }}
            onPointerMove={(e) =>
              handlePointerMove(
                e as any,
                `Lekki-Ikoyi Link Bridge`,
                `West Africa’s first cable-stayed bridge`,
              )
            }
            onPointerLeave={handlePointerLeave}
          />
        </g>
      </svg>
    </div>
  );
}
