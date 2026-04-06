"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const allCharacters = [
  "/loader/2bobo.png",
  "/loader/chief.png",
  "/loader/chioma.png",
  "/loader/femi.png",
  "/loader/iya bose.png",
  "/loader/madam.png",
  "/loader/obi.png",
  "/loader/precious.png",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SlotColumn({
  finalCharacter,
  settleDelay,
}: {
  finalCharacter: string;
  settleDelay: number;
}) {
  const [currentImg, setCurrentImg] = useState(allCharacters[0]);
  const [settled, setSettled] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const baseSpeed = 80;
    const startTime = Date.now();
    const settleAt = startTime + settleDelay;
    const easeStart = settleAt - 600;

    // Set a random initial image
    setCurrentImg(allCharacters[Math.floor(Math.random() * allCharacters.length)]);

    const tick = () => {
      const now = Date.now();

      if (now >= settleAt) {
        setCurrentImg(finalCharacter);
        setSettled(true);
        return;
      }

      setCurrentImg((prev) => {
        const others = allCharacters.filter((c) => c !== prev);
        return others[Math.floor(Math.random() * others.length)];
      });

      let nextDelay = baseSpeed;
      if (now >= easeStart) {
        const progress = (now - easeStart) / (settleAt - easeStart);
        nextDelay = baseSpeed + progress * progress * progress * 320;
      }

      intervalRef.current = setTimeout(tick, nextDelay);
    };

    intervalRef.current = setTimeout(tick, baseSpeed);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [finalCharacter, settleDelay]);

  return (
    <div className="flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 overflow-hidden">
      <div>
        <Image
          src={currentImg}
          alt="character"
          width={120}
          height={120}
          className="w-20 h-20 sm:w-[120px] sm:h-[120px] object-contain rounded-full"
        />
      </div>
    </div>
  );
}

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [slideUp, setSlideUp] = useState(false);
  const [mounted, setMounted] = useState(false);
  const slotsRef = useRef<string[]>([]);

  // Defer all randomization to after mount to avoid hydration mismatch
  useEffect(() => {
    slotsRef.current = shuffle(allCharacters).slice(0, 3);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const start = Date.now();
    const duration = 2200;
    const frame = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased * 100);
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const lastSettleDelay = 800 + 2 * 400;
    const slideTimer = setTimeout(() => setSlideUp(true), lastSettleDelay + 500);
    const dismissTimer = setTimeout(() => setDismissed(true), lastSettleDelay + 1300);
    return () => {
      clearTimeout(slideTimer);
      clearTimeout(dismissTimer);
    };
  }, [mounted]);

  if (dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)]"
      style={{
        backgroundColor: "rgb(252, 205, 33)",
        transform: slideUp ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      {mounted && (
        <>
          {/* Slot machine reels */}
          <div className="flex items-center gap-3 sm:gap-5 mb-10">
            {slotsRef.current.map((char, i) => (
              <SlotColumn
                key={i}
                finalCharacter={char}
                settleDelay={800 + i * 400}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-64 sm:w-80 h-4 bg-neutral-100 overflow-hidden">
            <div
              className="h-full bg-neutral-800 transition-[width] duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
