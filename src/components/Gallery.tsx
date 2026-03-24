"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const galleryImages = [
  { src: "/images/gallery-playing.png", alt: "Friends playing One Chance" },
  { src: "/images/gallery-kids.jpg", alt: "Kids enjoying One Chance" },
  { src: "/images/gallery-box.jpg", alt: "One Chance game box" },
  { src: "/images/gallery-closeup.jpg", alt: "Close-up of game board" },
];

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="gallery"
      ref={ref}
      className="flex flex-col items-center justify-center w-full"
      style={{
        backgroundColor: "white",
        padding: "clamp(60px, 10vw, 200px) clamp(18px, 3vw, 0px)",
        overflow: "visible",
      }}
    >
      <div className="flex flex-col" style={{ gap: 71, maxWidth: 1300, width: "100%" }}>
        {/* Left column: title + description */}
        <div className="flex flex-col md:flex-row" style={{ gap: 20, width: "100%" }}>
          {/* Left: Title and text */}
          <div className="flex flex-col flex-1" style={{ gap: 39 }}>
            <div className="flex flex-col" style={{ gap: 24 }}>
              <div className="flex flex-col" style={{ gap: 64 }}>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                  className="font-barlow-condensed uppercase"
                  style={{
                    fontSize: "clamp(40px, 6vw, 96px)",
                    lineHeight: "82px",
                    letterSpacing: "-3px",
                    fontWeight: 800,
                    color: "rgb(39, 48, 46)",
                  }}
                >
                  Gallery
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-barlow"
                  style={{
                    fontSize: 24,
                    lineHeight: "34px",
                    maxWidth: 640,
                    color: "rgb(39, 48, 46)",
                  }}
                >
                  With One Chance, every moment is an opportunity for connection.
                  Whether it&apos;s game night, a road trip, or a cozy evening at
                  home, ignite laughter and share your Nigerian experience with
                  your people.
                </motion.p>
              </div>
            </div>

            {/* First large image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative w-full overflow-hidden"
              style={{
                height: "clamp(387px, 50vw, 722px)",
                borderRadius: 0,
              }}
            >
              <Image
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>

          {/* Right column: stacked images */}
          <div className="flex flex-col flex-1" style={{ gap: 20 }}>
            {/* Top right - bordered image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative w-full overflow-hidden"
              style={{
                height: "clamp(296px, 40vw, 640px)",
                border: "1px solid white",
              }}
            >
              <Image
                src={galleryImages[1].src}
                alt={galleryImages[1].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Bottom right - two images side by side */}
            <div className="flex" style={{ gap: 20, height: "clamp(98px, 20vw, 400px)" }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative flex-1 overflow-hidden"
              >
                <Image
                  src={galleryImages[2].src}
                  alt={galleryImages[2].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="relative flex-1 overflow-hidden"
              >
                <Image
                  src={galleryImages[3].src}
                  alt={galleryImages[3].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
