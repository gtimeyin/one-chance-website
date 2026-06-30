"use client";

import { getAttribute, type WooProduct } from "@/lib/woocommerce-shared";

interface ProductDescriptionProps {
  product: WooProduct;
}

function formatDimensions(d: WooProduct["dimensions"]): string | null {
  if (!d) return null;
  const parts = [d.length, d.width, d.height].filter((v) => v && v.length > 0);
  if (parts.length === 0) return null;
  return parts.join(" × ") + " cm";
}

function formatWeight(weight: string): string | null {
  if (!weight || weight.length === 0) return null;
  return `${weight} kg`;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const info: { label: string; value: string }[] = [];
  const players = getAttribute(product, "Players");
  const playTime = getAttribute(product, "Play Time");
  const dimension = formatDimensions(product.dimensions);
  const weight = formatWeight(product.weight);

  if (players) info.push({ label: "Players", value: players });
  if (dimension) info.push({ label: "Dimension", value: dimension });
  if (playTime) info.push({ label: "Play Time", value: playTime });
  if (weight) info.push({ label: "Weight", value: weight });

  const hasDescription = product.description && product.description.length > 0;
  if (!hasDescription && info.length === 0) return null;

  return (
    <section className="w-full bg-white" style={{ padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)" }}>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]" style={{ maxWidth: 1280, gap: "clamp(40px, 8vw, 100px)" }}>

        {/* Left Column: Description */}
        {hasDescription && (
          <div>
            <h2
              className="font-barlow-condensed font-extrabold uppercase"
              style={{ fontSize: 32, color: "var(--color-dark)", marginBottom: 32 }}
            >
              Description
            </h2>
            <div
              className="font-barlow-condensed"
              style={{
                fontSize: 18,
                color: "rgba(0,0,0,0.7)",
                lineHeight: 1.6,
                maxWidth: 600,
              }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* Right Column: Additional Information */}
        {info.length > 0 && (
          <div>
            <h2
              className="font-barlow-condensed font-extrabold uppercase"
              style={{ fontSize: 24, color: "var(--color-dark)", marginBottom: 40 }}
            >
              Additional Information
            </h2>

            <div className="grid grid-cols-2 gap-y-10 gap-x-8">
              {info.map((item) => (
                <div key={item.label}>
                  <p className="font-barlow-condensed font-medium uppercase" style={{ fontSize: 15, color: "rgba(0,0,0,0.4)", marginBottom: 8, letterSpacing: "0.05em" }}>
                    {item.label}
                  </p>
                  <p className="font-barlow-condensed font-bold" style={{ fontSize: 20, color: "var(--color-dark)" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
