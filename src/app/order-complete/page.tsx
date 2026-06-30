import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import { getOrderById } from "@/lib/woocommerce";
import { formatPrice } from "@/lib/utils";
import ClearLocalCart from "./ClearLocalCart";
import PurchaseTracker from "@/components/analytics/PurchaseTracker";

export const metadata = {
  title: "Order Complete",
  description: "Thanks for your order.",
  robots: { index: false, follow: false },
};

interface OrderCompletePageProps {
  searchParams: Promise<{ order?: string; key?: string }>;
}

export default async function OrderCompletePage({ searchParams }: OrderCompletePageProps) {
  const { order: orderIdParam, key } = await searchParams;
  const orderId = Number(orderIdParam);
  const order =
    Number.isInteger(orderId) && orderId > 0 ? await getOrderById(orderId) : null;

  // Defensive: only show the receipt if the order_key matches the URL key.
  // This stops random people from snooping orders by guessing IDs.
  const valid = Boolean(order && key && order.order_key === key);

  return (
    <div className="flex flex-col w-full" style={{ background: "white", minHeight: "100vh" }}>
      <SmoothScroll />
      <Navbar />
      {valid && order && (
        <>
          <ClearLocalCart />
          <PurchaseTracker
            transactionId={String(order.id)}
            value={parseFloat(order.total)}
            currency={order.currency}
            shipping={parseFloat(order.shipping_total)}
            items={order.line_items.map((li) => ({
              productId: li.product_id,
              name: li.name,
              price: li.price,
              quantity: li.quantity,
            }))}
          />
        </>
      )}
      <div className="relative z-[1]" style={{ paddingTop: 56, background: "white" }}>
        <section
          className="w-full"
          style={{ padding: "clamp(60px, 8vw, 120px) clamp(20px, 4vw, 60px)" }}
        >
          <div className="mx-auto" style={{ maxWidth: 720 }}>
            {valid && order ? (
              <OrderReceipt order={order} />
            ) : (
              <NotFound />
            )}
          </div>
        </section>
      </div>
      <FooterShop reveal />
    </div>
  );
}

function OrderReceipt({
  order,
}: {
  order: NonNullable<Awaited<ReturnType<typeof getOrderById>>>;
}) {
  const ordered = new Date(order.date_created).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col" style={{ gap: 32 }}>
      <div className="flex flex-col" style={{ gap: 12 }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--color-yellow)",
            marginBottom: 8,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-dark)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="type-h1 uppercase" style={{ color: "var(--color-dark)" }}>
          Thanks for your order
        </h1>
        <p className="font-barlow-condensed" style={{ fontSize: 16, color: "var(--color-text-muted)" }}>
          Order #{order.id} · {ordered}
        </p>
      </div>

      <div
        style={{
          padding: 24,
          border: "1px solid var(--color-border-light)",
          borderRadius: 4,
        }}
      >
        <h2
          className="font-barlow-condensed font-bold uppercase"
          style={{ fontSize: 14, color: "var(--color-text-muted)", letterSpacing: "0.05em", marginBottom: 16 }}
        >
          Order Summary
        </h2>
        <div className="flex flex-col" style={{ gap: 16 }}>
          {order.line_items.map((item) => (
            <div key={item.id} className="flex items-center" style={{ gap: 16 }}>
              {item.image?.src ? (
                <div
                  className="relative shrink-0"
                  style={{ width: 64, height: 64, background: "var(--color-light-bg)" }}
                >
                  <Image src={item.image.src} alt={item.name} fill className="object-contain" sizes="64px" />
                </div>
              ) : null}
              <div className="flex-1 flex flex-col" style={{ gap: 2 }}>
                <span className="font-barlow-condensed font-bold" style={{ fontSize: 16, color: "var(--color-dark)" }}>
                  {item.name}
                </span>
                <span className="font-barlow-condensed" style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                  Qty {item.quantity}
                </span>
              </div>
              <span className="font-barlow-condensed font-bold" style={{ fontSize: 16, color: "var(--color-dark)" }}>
                {formatPrice(parseFloat(item.total), order.currency)}
              </span>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: "var(--color-border-light)", margin: "20px 0" }} />
        <div className="flex flex-col" style={{ gap: 8 }}>
          {parseFloat(order.shipping_total) > 0 && (
            <SummaryRow
              label="Shipping"
              value={formatPrice(parseFloat(order.shipping_total), order.currency)}
            />
          )}
          {order.payment_method_title && (
            <SummaryRow label="Payment" value={order.payment_method_title} />
          )}
          <SummaryRow
            label="Total"
            value={formatPrice(parseFloat(order.total), order.currency)}
            bold
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row" style={{ gap: 12 }}>
        <Link
          href="/account/orders"
          className="font-barlow-condensed font-bold uppercase cursor-pointer text-center flex-1"
          style={{
            padding: "14px 24px",
            background: "var(--color-yellow)",
            color: "var(--color-dark)",
            fontSize: 14,
            letterSpacing: "0.05em",
            textDecoration: "none",
          }}
        >
          View Orders
        </Link>
        <Link
          href="/shop"
          className="font-barlow-condensed font-bold uppercase cursor-pointer text-center flex-1"
          style={{
            padding: "14px 24px",
            border: "1px solid var(--color-dark)",
            background: "white",
            color: "var(--color-dark)",
            fontSize: 14,
            letterSpacing: "0.05em",
            textDecoration: "none",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className="font-barlow-condensed"
        style={{ fontSize: bold ? 18 : 14, color: bold ? "var(--color-dark)" : "var(--color-text-muted)", fontWeight: bold ? 700 : 400 }}
      >
        {label}
      </span>
      <span
        className="font-barlow-condensed"
        style={{ fontSize: bold ? 22 : 14, color: "var(--color-dark)", fontWeight: bold ? 700 : 500 }}
      >
        {value}
      </span>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center text-center" style={{ gap: 16 }}>
      <h1 className="type-h2 uppercase" style={{ color: "var(--color-dark)" }}>
        Order not found
      </h1>
      <p className="font-barlow-condensed" style={{ fontSize: 16, color: "var(--color-text-muted)", maxWidth: 420 }}>
        We couldn&apos;t find that order. If you just completed a purchase and landed here in error, check your email for a confirmation receipt.
      </p>
      <Link
        href="/shop"
        className="font-barlow-condensed font-bold uppercase cursor-pointer"
        style={{
          marginTop: 8,
          padding: "12px 20px",
          background: "var(--color-yellow)",
          color: "var(--color-dark)",
          fontSize: 14,
          letterSpacing: "0.05em",
          textDecoration: "none",
        }}
      >
        Back to Shop
      </Link>
    </div>
  );
}
