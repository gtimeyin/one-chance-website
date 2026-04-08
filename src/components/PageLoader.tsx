"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  settled,
}: {
  finalCharacter: string;
  settled: boolean;
}) {
  const [currentImg, setCurrentImg] = useState(allCharacters[0]);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (settled) {
      setCurrentImg(finalCharacter);
      if (intervalRef.current) clearTimeout(intervalRef.current);
      return;
    }

    setCurrentImg(allCharacters[Math.floor(Math.random() * allCharacters.length)]);

    const tick = () => {
      setCurrentImg((prev) => {
        const others = allCharacters.filter((c) => c !== prev);
        return others[Math.floor(Math.random() * others.length)];
      });
      intervalRef.current = setTimeout(tick, 80 + Math.random() * 40);
    };

    intervalRef.current = setTimeout(tick, 80);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [settled, finalCharacter]);

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

async function runHealthCheck(): Promise<boolean> {
  try {
    const res = await fetch("/api/health", { cache: "no-store" });
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

const MIN_DISPLAY_MS = 1600;
const MAX_WAIT_MS = 8000;

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [slideUp, setSlideUp] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [settledSlots, setSettledSlots] = useState([false, false, false]);
  const slotsRef = useRef<string[]>([]);
  const mountTimeRef = useRef(0);

  // Defer randomization to after mount
  useEffect(() => {
    slotsRef.current = shuffle(allCharacters).slice(0, 3);
    mountTimeRef.current = Date.now();
    setMounted(true);
  }, []);

  // Run health check + enforce minimum display time
  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;

    const check = async () => {
      const healthPromise = runHealthCheck();
      const minWait = new Promise((r) => setTimeout(r, MIN_DISPLAY_MS));

      // Wait for both: health check AND minimum display time
      const [healthy] = await Promise.all([healthPromise, minWait]);

      if (cancelled) return;

      // Even if health check fails, don't block forever
      setReady(true);
    };

    check();

    // Timeout fallback — proceed after MAX_WAIT_MS regardless
    const timeout = setTimeout(() => {
      if (!cancelled) setReady(true);
    }, MAX_WAIT_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [mounted]);

  // Animate progress bar — goes to 80% quickly, then waits for ready to hit 100%
  useEffect(() => {
    if (!mounted) return;
    const start = Date.now();

    const frame = () => {
      const elapsed = Date.now() - start;

      if (ready) {
        setProgress(100);
        return;
      }

      // Ease to 80% over 2s, then slow crawl
      const fastPhase = Math.min(elapsed / 2000, 1);
      const eased = (1 - Math.pow(1 - fastPhase, 3)) * 80;
      const slowExtra = fastPhase >= 1 ? Math.min((elapsed - 2000) / 30000, 1) * 15 : 0;

      setProgress(eased + slowExtra);
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }, [mounted, ready]);

  // Settle slots one by one when ready, then slide up
  const settleSlot = useCallback((index: number) => {
    setSettledSlots((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!ready) return;

    // Ease-settle each slot with staggered delays
    const timers = [
      setTimeout(() => settleSlot(0), 100),
      setTimeout(() => settleSlot(1), 350),
      setTimeout(() => settleSlot(2), 600),
      setTimeout(() => setSlideUp(true), 1100),
      setTimeout(() => setDismissed(true), 1800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [ready, settleSlot]);

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
                settled={settledSlots[i]}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-64 sm:w-80 h-4 bg-neutral-100 overflow-hidden">
            <div
              className="h-full bg-neutral-800 transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
