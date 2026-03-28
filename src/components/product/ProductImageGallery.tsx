"use client";

import { useState } from "react";
import Image from "next/image";
import type { WooProduct } from "@/lib/woocommerce";
import { getPlaceholderImage } from "@/lib/utils";

interface ProductImageGalleryProps {
  product: WooProduct;
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const images = product.images.length > 0
    ? product.images
    : [{ id: 0, src: getPlaceholderImage(600, 600, product.name), name: product.name, alt: product.name }];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      {/* Main Image */}
      <div
        className="relative w-full"
        style={{
          flex: 1,
          minHeight: 300,
          background: "var(--color-yellow)",
          overflow: "hidden",
        }}
      >
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt || product.name}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setSelectedIndex(i)}
              className="relative shrink-0 cursor-pointer p-0 bg-transparent overflow-hidden"
              style={{
                width: 90,
                height: 90,
                border: i === selectedIndex ? "3px solid #3182CE" : "none",
                opacity: i === selectedIndex ? 1 : 0.6,
              }}
            >
              <Image
                src={img.src}
                alt={img.alt || `${product.name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="90px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
