"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
}

export default function CartDrawer({ isOpen }: CartDrawerProps) {
  const items = useCart((s) => s.items);
  const closeCart = useCart((s) => s.closeCart);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const getTotal = useCart((s) => s.getTotal);

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
                  <p className="font-barlow" style={{ fontSize: 16, color: "var(--color-text-muted)" }}>
                    Your cart is empty
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="font-barlow font-bold no-underline"
                    style={{
                      padding: "12px 24px",
                      background: "var(--color-yellow)",
                      color: "var(--color-dark)",
                      fontSize: 14,
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
                            className="font-barlow font-semibold"
                            style={{
                              fontSize: 14,
                              color: "var(--color-dark)",
                              lineHeight: "1.3",
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            className="font-barlow font-bold"
                            style={{ fontSize: 14, color: "var(--color-dark)", marginTop: 4 }}
                          >
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center" style={{ gap: 8 }}>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="cursor-pointer font-barlow font-bold flex items-center justify-center"
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
                            <span className="font-barlow font-semibold" style={{ fontSize: 14, color: "var(--color-dark)" }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="cursor-pointer font-barlow font-bold flex items-center justify-center"
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
                            className="cursor-pointer bg-transparent border-none font-barlow"
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
                  <span className="font-barlow font-semibold" style={{ fontSize: 16, color: "var(--color-dark)" }}>
                    Subtotal
                  </span>
                  <span className="font-barlow font-bold" style={{ fontSize: 18, color: "var(--color-dark)" }}>
                    {formatPrice(getTotal())}
                  </span>
                </div>
                <button
                  className="w-full font-barlow font-bold cursor-pointer border-none"
                  style={{
                    padding: "14px",
                    background: "var(--color-yellow)",
                    color: "var(--color-dark)",
                    fontSize: 16,
                  }}
                >
                  CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
