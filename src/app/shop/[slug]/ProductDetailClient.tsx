"use client";

import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import WhatsInTheBox from "@/components/product/WhatsInTheBox";
import VideoSection from "@/components/product/VideoSection";
import QuickStartGuide, { type QuickStartStep } from "@/components/product/QuickStartGuide";
import TestimonialsSection from "@/components/product/TestimonialsSection";
import RelatedProducts from "@/components/product/RelatedProducts";
import FAQs from "@/components/FAQs";
import ProductDescription from "@/components/product/ProductDescription";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import { getMetaJson, getMetaValue, type WooProduct, type WooReview } from "@/lib/woocommerce";

interface FaqItem {
  question: string;
  answer: string;
}

interface ProductDetailClientProps {
  product: WooProduct;
  relatedProducts: WooProduct[];
  reviews: WooReview[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  reviews,
}: ProductDetailClientProps) {
  const boxItems = getMetaJson<string[]>(product, "oc_box_items") ?? [];
  const videoUrl = getMetaValue(product, "oc_video_url");
  const videoHeadline = getMetaValue(product, "oc_video_headline") ?? undefined;
  const quickStartSteps = getMetaJson<QuickStartStep[]>(product, "oc_quick_start_steps") ?? [];
  const quickStartImage = getMetaValue(product, "oc_quick_start_image") ?? undefined;
  const faqs = getMetaJson<FaqItem[]>(product, "oc_faqs") ?? [];

  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div className="relative z-[1]" style={{ paddingTop: 56, background: "white" }}>
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

        <ProductDescription product={product} />

        <WhatsInTheBox items={boxItems} />
        {videoUrl && <VideoSection videoUrl={videoUrl} headline={videoHeadline} />}
        <QuickStartGuide steps={quickStartSteps} boardImage={quickStartImage} />
        <TestimonialsSection
          productId={product.id}
          productName={product.name}
          reviews={reviews}
        />
        <RelatedProducts products={relatedProducts} />

        {faqs.length > 0 && <FAQs faqs={faqs} />}
      </div>
      <FooterShop reveal />
    </div>
  );
}
