"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error boundary]", error);
  }, [error]);

  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Something Went Wrong" },
            ]}
          />
        </div>

        <section
          className="flex w-full flex-col items-center justify-center bg-white min-h-[90vh]"
          style={{ padding: "clamp(48px, 6vw, 96px) 24px" }}
        >
          <div className="flex w-full max-w-[560px] flex-col items-center gap-8 text-center">
            <Image
              src="/loader/chief.png"
              alt=""
              width={160}
              height={160}
              className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] object-contain"
              priority
            />

            <div className="flex flex-col items-center gap-3">
              <h1 className="font-['Barlow_Condensed'] text-[64px] sm:text-[80px] font-[800] leading-[0.9] text-neutral-800 uppercase -tracking-[0.02em]">
                WAHALA!
              </h1>
              <h2 className="font-['Barlow_Condensed'] text-[24px] sm:text-[28px] font-[700] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
                Something Went Wrong
              </h2>
              <p className="font-['Barlow'] text-[16px] text-neutral-500 max-w-[420px]">
                We hit a bump. Try again, or head back home and we&apos;ll sort it out.
              </p>
              {error?.digest && (
                <p className="font-['Barlow'] text-[12px] text-neutral-400 mt-2">
                  Ref: {error.digest}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center px-6 h-10 bg-[#fccd21] hover:bg-[#e6b91d] transition-colors font-['Barlow'] text-[14px] font-[700] text-neutral-800 uppercase tracking-[0.05em] border-0 cursor-pointer"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 h-10 bg-white border border-neutral-300 hover:border-neutral-500 transition-colors font-['Barlow'] text-[14px] font-[700] text-neutral-800 uppercase tracking-[0.05em] no-underline"
                style={{ textDecoration: "none" }}
              >
                Go Back Home
              </Link>
            </div>
          </div>
        </section>
      </div>
      <FooterShop />
    </div>
  );
}
