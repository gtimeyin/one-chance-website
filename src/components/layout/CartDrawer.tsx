"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/components/CurrencyProvider";
import { trackBeginCheckout } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
}

interface CrossSellItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  regular_price: number;
  on_sale: boolean;
  image: string | null;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export default function CartDrawer({ isOpen }: CartDrawerProps) {
  const items = useCart((s) => s.items);
  const closeCart = useCart((s) => s.closeCart);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const addItem = useCart((s) => s.addItem);
  const currency = useCurrency();
  const router = useRouter();
  // Cart-store price was captured in whatever currency was active when the
  // item was added, so we can't trust it after a country/currency change.
  // Reprice against the active country whenever items or currency change.
  const [repricedPrices, setRepricedPrices] = useState<Record<number, number>>({});
  const [crossSells, setCrossSells] = useState<CrossSellItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (items.length === 0) {
      // Stale state is harmless (nothing iterates it while cart is empty),
      // and avoiding setState here keeps us out of cascading-render lint.
      return;
    }
    const country = (getCookie("oc-country") ?? "NG").toUpperCase();
    const productIds = Array.from(new Set(items.map((i) => i.productId)));

    fetch("/api/checkout/reprice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds, country }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !Array.isArray(data?.prices)) return;
        const map: Record<number, number> = {};
        for (const p of data.prices) map[p.productId] = p.price;
        setRepricedPrices(map);
      })
      .catch(() => { /* keep skeletons on transient failure */ });

    fetch("/api/cart/cross-sells", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds, country }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !Array.isArray(data?.products)) return;
        setCrossSells(data.products);
      })
      .catch(() => { /* silently skip cross-sells on transient failure */ });

    return () => {
      cancelled = true;
    };
  }, [items, currency]);

  function priceFor(productId: number): number | null {
    return repricedPrices[productId] ?? null;
  }
  const allLinesPriced = items.every((i) => repricedPrices[i.productId] != null);
  const total = allLinesPriced
    ? items.reduce((sum, i) => sum + (priceFor(i.productId) ?? 0) * i.quantity, 0)
    : null;

  function handleCheckout() {
    if (items.length === 0 || !allLinesPriced) return;

    trackBeginCheckout(
      items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: priceFor(i.productId) ?? 0,
        quantity: i.quantity,
      })),
      total ?? 0,
    );

    closeCart();
    router.push("/checkout");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70]"
            style={{ background: "rgba(0,0,0,0.5)" }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full z-[80] flex flex-col"
            style={{
              width: "min(400px, 90vw)",
              background: "white",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              <h2
                className="font-barlow-condensed font-extrabold uppercase"
                style={{ fontSize: 20, color: "var(--color-dark)" }}
              >
                YOUR CART
              </h2>
              <button
                onClick={closeCart}
                className="cursor-pointer bg-transparent border-none"
                style={{ fontSize: 24, color: "var(--color-dark)" }}
                aria-label="Close cart"
              >
                &times;
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto" style={{ padding: "16px 24px" }}>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full" style={{ gap: 16 }}>
                  <p className="font-barlow-condensed" style={{ fontSize: 16, color: "var(--color-text-muted)" }}>
                    Your cart is empty
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="font-barlow-condensed font-bold no-underline"
                    style={{
                      padding: "12px 24px",
                      background: "var(--color-yellow)",
                      color: "var(--color-dark)",
                      fontSize: 16,
                      textDecoration: "none",
                    }}
                  >
                    SHOP NOW
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col" style={{ gap: 16 }}>
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-4"
                      style={{
                        padding: "12px 0",
                        borderBottom: "1px solid var(--color-border-light)",
                      }}
                    >
                      <div
                        className="relative shrink-0"
                        style={{
                          width: 80,
                          height: 80,
                          background: "var(--color-light-bg)",
                        }}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p
                            className="font-barlow-condensed font-semibold"
                            style={{
                              fontSize: 16,
                              color: "var(--color-dark)",
                              lineHeight: "1.3",
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            className="font-barlow-condensed font-bold"
                            style={{ fontSize: 16, color: "var(--color-dark)", marginTop: 4, minHeight: 18 }}
                          >
                            {priceFor(item.productId) === null ? (
                              <span
                                aria-hidden
                                style={{
                                  display: "inline-block",
                                  width: 70,
                                  height: 12,
                                  background: "var(--color-border-light)",
                                  borderRadius: 3,
                                }}
                              />
                            ) : (
                              formatPrice(priceFor(item.productId)!, currency)
                            )}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center" style={{ gap: 8 }}>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="cursor-pointer font-barlow-condensed font-bold flex items-center justify-center"
                              style={{
                                width: 28,
                                height: 28,
                                border: "1px solid var(--color-border-light)",
                                background: "white",
                                fontSize: 16,
                                color: "var(--color-dark)",
                              }}
                            >
                              -
                            </button>
                            <span className="font-barlow-condensed font-semibold" style={{ fontSize: 16, color: "var(--color-dark)" }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="cursor-pointer font-barlow-condensed font-bold flex items-center justify-center"
                              style={{
                                width: 28,
                                height: 28,
                                border: "1px solid var(--color-border-light)",
                                background: "white",
                                fontSize: 16,
                                color: "var(--color-dark)",
                              }}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="cursor-pointer bg-transparent border-none font-barlow-condensed"
                            style={{ fontSize: 12, color: "var(--color-red)", textDecoration: "underline" }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {crossSells.length > 0 && (
                <div
                  style={{
                    padding: "20px 24px 4px",
                    borderTop: "1px solid var(--color-border-light)",
                  }}
                >
                  <p
                    className="font-barlow-condensed font-bold uppercase"
                    style={{ fontSize: 12, color: "var(--color-text-muted)", letterSpacing: "0.05em", marginBottom: 12 }}
                  >
                    You might also like
                  </p>
                  <div className="flex flex-col" style={{ gap: 10 }}>
                    {crossSells.map((cs) => (
                      <div key={cs.id} className="flex items-center" style={{ gap: 10 }}>
                        {cs.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cs.image}
                            alt={cs.name}
                            style={{ width: 44, height: 44, objectFit: "contain", background: "var(--color-light-bg)" }}
                          />
                        ) : null}
                        <Link
                          href={`/shop/${cs.slug}`}
                          className="flex-1 font-barlow-condensed font-bold"
                          style={{ fontSize: 15, color: "var(--color-dark)", textDecoration: "none", lineHeight: 1.3 }}
                          onClick={closeCart}
                        >
                          {cs.name}
                          <span style={{ display: "block", fontSize: 12, color: "var(--color-text-muted)", fontWeight: 400, marginTop: 2 }}>
                            {formatPrice(cs.price, currency)}
                          </span>
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            addItem({
                              productId: cs.id,
                              name: cs.name,
                              price: cs.price,
                              quantity: 1,
                              image: cs.image ?? "",
                              slug: cs.slug,
                            })
                          }
                          className="font-barlow-condensed font-bold uppercase cursor-pointer"
                          style={{
                            padding: "6px 10px",
                            border: "1px solid var(--color-dark)",
                            background: "white",
                            color: "var(--color-dark)",
                            fontSize: 11,
                            letterSpacing: "0.05em",
                          }}
                          aria-label={`Add ${cs.name} to cart`}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                style={{
                  padding: "20px 24px",
                  borderTop: "1px solid var(--color-border-light)",
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                  <span className="font-barlow-condensed font-semibold" style={{ fontSize: 16, color: "var(--color-dark)" }}>
                    Subtotal
                  </span>
                  <span className="font-barlow-condensed font-bold" style={{ fontSize: 18, color: "var(--color-dark)" }}>
                    {total === null ? "—" : formatPrice(total, currency)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={!allLinesPriced}
                  className="w-full font-barlow-condensed font-bold cursor-pointer border-none"
                  style={{
                    padding: "14px",
                    background: !allLinesPriced ? "#E5E7EB" : "var(--color-yellow)",
                    color: "var(--color-dark)",
                    fontSize: 16,
                  }}
                >
                  {!allLinesPriced ? "UPDATING…" : "CHECKOUT"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
