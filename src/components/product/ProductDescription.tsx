"use client";

import type { WooProduct } from "@/lib/woocommerce";

interface ProductDescriptionProps {
  product: WooProduct;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  // Hardcoded values from the screenshot if they aren't in the product meta
  const additionalInfo = {
    players: "2 - 12",
    dimension: "23cm * 23cm * 5cm",
    playTime: "30 - 90 mins",
    weight: "0.75kg",
  };

  return (
    <section className="w-full bg-white" style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)" }}>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]" style={{ maxWidth: 1280, gap: "clamp(40px, 8vw, 100px)" }}>
        
        {/* Left Column: Description */}
        <div>
          <h2 
            className="font-barlow-condensed font-extrabold uppercase" 
            style={{ fontSize: 32, color: "var(--color-dark)", marginBottom: 32 }}
          >
            Description
          </h2>
          <div 
            className="font-barlow" 
            style={{ 
              fontSize: 18, 
              color: "rgba(0,0,0,0.7)", 
              lineHeight: 1.6,
              maxWidth: 600
            }}
          >
            {/* Using a default if description is empty for now to match Shop.png */}
            <div dangerouslySetInnerHTML={{ __html: product.description || "One Chance is an intense and exciting experience. It is also fun and highly educational. The very first authentically Nigerian board game. One Chance packs the highs and lows of being Nigerian into a very Intense and exciting experience for everyone. <br/><br/><i>It's like monopoly but better!</i>" }} />
          </div>
        </div>

        {/* Right Column: Additional Information */}
        <div>
          <h2 
            className="font-barlow-condensed font-extrabold uppercase" 
            style={{ fontSize: 24, color: "var(--color-dark)", marginBottom: 40 }}
          >
            Additional Information
          </h2>
          
          <div className="grid grid-cols-2 gap-y-10 gap-x-8">
            <div>
              <p className="font-barlow font-medium uppercase" style={{ fontSize: 13, color: "rgba(0,0,0,0.4)", marginBottom: 8, letterSpacing: "0.05em" }}>
                Players
              </p>
              <p className="font-barlow font-bold" style={{ fontSize: 20, color: "var(--color-dark)" }}>
                {additionalInfo.players}
              </p>
            </div>
            <div>
              <p className="font-barlow font-medium uppercase" style={{ fontSize: 13, color: "rgba(0,0,0,0.4)", marginBottom: 8, letterSpacing: "0.05em" }}>
                Dimension
              </p>
              <p className="font-barlow font-bold" style={{ fontSize: 20, color: "var(--color-dark)" }}>
                {additionalInfo.dimension}
              </p>
            </div>
            <div>
              <p className="font-barlow font-medium uppercase" style={{ fontSize: 13, color: "rgba(0,0,0,0.4)", marginBottom: 8, letterSpacing: "0.05em" }}>
                Play Time
              </p>
              <p className="font-barlow font-bold" style={{ fontSize: 20, color: "var(--color-dark)" }}>
                {additionalInfo.playTime}
              </p>
            </div>
            <div>
              <p className="font-barlow font-medium uppercase" style={{ fontSize: 13, color: "rgba(0,0,0,0.4)", marginBottom: 8, letterSpacing: "0.05em" }}>
                Weight
              </p>
              <p className="font-barlow font-bold" style={{ fontSize: 20, color: "var(--color-dark)" }}>
                {additionalInfo.weight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
