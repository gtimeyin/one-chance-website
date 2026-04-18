import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Page Not Found - One Chance Board Game",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Page Not Found" },
            ]}
          />
        </div>

        <section
          className="flex w-full flex-col items-center justify-center bg-white min-h-[90vh]"
          style={{ padding: "clamp(48px, 6vw, 96px) 24px" }}
        >
          <div className="flex w-full max-w-[560px] flex-col items-center gap-8 text-center">
            <Image
              src="/loader/2bobo.png"
              alt=""
              width={160}
              height={160}
              className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] object-contain"
              priority
            />

            <div className="flex flex-col items-center gap-3">
              <h1 className="font-['Barlow_Condensed'] text-[96px] sm:text-[128px] font-[800] leading-[0.9] text-neutral-800 -tracking-[0.02em]">
                404
              </h1>
              <h2 className="font-['Barlow_Condensed'] text-[32px] sm:text-[40px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
                Page Not Found
              </h2>
              <p className="font-['Barlow'] text-[16px] text-neutral-500 max-w-[420px]">
                One chance! The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 h-10 bg-[#fccd21] hover:bg-[#e6b91d] transition-colors font-['Barlow'] text-[14px] font-[700] text-neutral-800 uppercase tracking-[0.05em] no-underline"
              style={{ textDecoration: "none" }}
            >
              Go Back Home
            </Link>
          </div>
        </section>
      </div>
      <FooterShop />
    </div>
  );
}
