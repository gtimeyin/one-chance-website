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
          aspectRatio: "1/1",
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
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className="relative shrink-0 cursor-pointer bg-transparent"
              style={{
                width: 72,
                height: 72,
                border: i === selectedIndex ? "2px solid var(--color-yellow)" : "2px solid var(--color-border-light)",
                padding: 0,
              }}
            >
              <Image
                src={img.src}
                alt={img.alt || `${product.name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
