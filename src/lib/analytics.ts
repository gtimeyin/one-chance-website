"use client";

import { sendGAEvent } from "@next/third-parties/google";

const CONSENT_KEY = "oc_analytics_consent";

export type ConsentState = "granted" | "denied" | "unset";

export function getStoredConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  const value = window.localStorage.getItem(CONSENT_KEY);
  if (value === "granted" || value === "denied") return value;
  return "unset";
}

export function setStoredConsent(value: Exclude<ConsentState, "unset">): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(
    new CustomEvent<ConsentState>("oc-consent-change", { detail: value }),
  );
}

export function subscribeConsent(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("oc-consent-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("oc-consent-change", cb);
    window.removeEventListener("storage", cb);
  };
}

function track(name: string, params: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (getStoredConsent() !== "granted") return;
  sendGAEvent("event", name, params);
}

type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
};

function toGAItem(item: CartItem) {
  return {
    item_id: String(item.productId),
    item_name: item.name,
    item_category: item.category,
    price: item.price,
    quantity: item.quantity,
  };
}

export function trackAddToCart(item: CartItem): void {
  track("add_to_cart", {
    currency: "NGN",
    value: item.price * item.quantity,
    items: [toGAItem(item)],
  });
}

export function trackBeginCheckout(items: CartItem[], total: number): void {
  track("begin_checkout", {
    currency: "NGN",
    value: total,
    items: items.map(toGAItem),
  });
}

export function trackSignUp(method: string, hasReferral: boolean): void {
  track("sign_up", { method, has_referral: hasReferral });
}
