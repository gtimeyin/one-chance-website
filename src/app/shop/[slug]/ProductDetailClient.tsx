"use client";

import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import WhatsInTheBox from "@/components/product/WhatsInTheBox";
import VideoSection from "@/components/product/VideoSection";
import QuickStartGuide from "@/components/product/QuickStartGuide";
import TestimonialsSection from "@/components/product/TestimonialsSection";
import RelatedProducts from "@/components/product/RelatedProducts";
import FAQs from "@/components/FAQs";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import type { WooProduct } from "@/lib/woocommerce";

interface ProductDetailClientProps {
  product: WooProduct;
  relatedProducts: WooProduct[];
}

const productFaqs = [
  {
    question: "What is the recommended age range for players of the game?",
    answer: "One Chance is recommended for players aged 12 and above.",
  },
  {
    question: "Are there multiple modes of playing the game?",
    answer: "Yes! One Chance can be played in multiple ways depending on your group size and time.",
  },
  {
    question: "How many players can play the game at once?",
    answer: "One Chance supports 2 to 6 players per game session.",
  },
  {
    question: "How does the game end?",
    answer: "The game ends when a player successfully navigates all challenges and accumulates the most wealth.",
  },
  {
    question: "Where can one find the game to play?",
    answer: "One Chance is available for purchase through our website and select retail partners.",
  },
  {
    question: "Can the game be customized or personalized in any way?",
    answer: "We offer customization options for bulk orders, including personalized cards and branding.",
  },
  {
    question: "Is the game available for bulk purchases?",
    answer: "Absolutely! We offer special pricing for bulk purchases.",
  },
];

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        {/* Breadcrumb */}
        <div style={{ padding: "0 clamp(20px, 4vw, 60px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: product.name },
            ]}
          />
        </div>

        {/* Product Hero */}
        <section
          style={{
            padding: "0 clamp(20px, 4vw, 60px) clamp(40px, 6vw, 80px)",
          }}
        >
          <div
            className="mx-auto grid grid-cols-1 md:grid-cols-2"
            style={{ maxWidth: 1280, gap: "clamp(24px, 4vw, 60px)" }}
          >
            <ProductImageGallery product={product} />
            <ProductInfo product={product} />
          </div>
        </section>

        {/* Sections */}
        <WhatsInTheBox />
        <VideoSection />
        <QuickStartGuide />
        <TestimonialsSection />
        <RelatedProducts products={relatedProducts} />

        {/* FAQ */}
        <FAQs
          heading="WE HAVE ANSWERS"
          faqs={productFaqs}
        />
      </div>
      <FooterShop />
    </div>
  );
}
