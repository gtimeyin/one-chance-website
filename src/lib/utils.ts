import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Currencies typically rendered without decimal places.
const ZERO_DECIMAL_CURRENCIES = new Set(["NGN", "JPY", "KRW", "VND", "CLP"]);

export function formatPrice(
  price: number | string,
  currency = "NGN",
  locale = "en-US"
): string {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  const noDecimals = ZERO_DECIMAL_CURRENCIES.has(currency);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: noDecimals ? 0 : 2,
    maximumFractionDigits: noDecimals ? 0 : 2,
  }).format(numericPrice);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getPlaceholderImage(
  width = 400,
  height = 400,
  text = "One Chance"
): string {
  return `https://placehold.co/${width}x${height}/FCCD21/121B19?text=${encodeURIComponent(text)}`;
}

export function getImageSrc(
  images: { src: string }[] | undefined,
  fallback?: string
): string {
  if (images && images.length > 0 && images[0].src) {
    return images[0].src;
  }
  return fallback || getPlaceholderImage();
}

export const isClient = typeof window !== "undefined";
