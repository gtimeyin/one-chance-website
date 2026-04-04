"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/ui/components/Button";

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
        padding: "clamp(60px, 8vw, 128px) 24px",
      }}
    >
      <div className="flex w-full max-w-[1280px] flex-col items-start" style={{ gap: 48 }}>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-display-title-bold font-display-title-bold text-default-font uppercase -tracking-[3px]"
        >
          Gallery
        </motion.span>

        <div className="flex w-full min-w-full flex-wrap items-start gap-6 mobile:flex-col mobile:gap-6">
          {/* Left column: text + large image */}
          <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-col items-start gap-2 self-stretch">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-start gap-4 pb-9"
            >
              <span className="text-large-body-default font-large-body-default text-default-font">
                One Chance was made for those nights — the ones that end with
                everyone arguing about who cheated, and nobody wanting to stop.
              </span>
              <Button
                onClick={() => { window.location.href = "/shop"; }}
              >
                Grab your copy
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative w-full min-w-[320px] grow shrink-0 basis-0 overflow-hidden"
              style={{ minHeight: 400 }}
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
          <div className="flex min-w-[320px] grow shrink-0 basis-0 flex-col items-start gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative h-96 w-full overflow-hidden"
            >
              <Image
                src={galleryImages[1].src}
                alt={galleryImages[1].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            <div className="flex h-fit w-full flex-col items-start gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative h-[240px] w-full min-w-0 overflow-hidden"
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
                className="relative h-64 w-full min-w-0 overflow-hidden"
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
