import { createLogger } from "@/lib/logger";

const log = createLogger("analytics-server");

const MP_ENDPOINT = "https://www.google-analytics.com/mp/collect";

type WooLineItem = {
  product_id: number;
  variation_id?: number;
  name: string;
  quantity: number;
  price?: number | string;
  total?: string;
  sku?: string;
};

type WooOrder = {
  id: number;
  customer_id?: number;
  total?: string;
  currency?: string;
  shipping_total?: string;
  total_tax?: string;
  discount_total?: string;
  coupon_lines?: Array<{ code?: string }>;
  line_items?: WooLineItem[];
};

function toNumber(value: unknown): number {
  const n = typeof value === "string" ? parseFloat(value) : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function sendGAPurchase(order: WooOrder): Promise<void> {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;
  const apiSecret = process.env.GA_API_SECRET;

  if (!measurementId || !apiSecret) {
    log.warn("GA Measurement Protocol not configured — skipping purchase event");
    return;
  }

  const items = (order.line_items ?? []).map((li) => ({
    item_id: String(li.variation_id || li.product_id),
    item_name: li.name,
    quantity: li.quantity,
    price: toNumber(li.price ?? (li.total ? toNumber(li.total) / Math.max(li.quantity, 1) : 0)),
  }));

  const payload = {
    client_id: `${order.customer_id || 0}.${order.id}`,
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: String(order.id),
          value: toNumber(order.total),
          currency: order.currency || "NGN",
          shipping: toNumber(order.shipping_total),
          tax: toNumber(order.total_tax),
          coupon: order.coupon_lines?.[0]?.code,
          items,
        },
      },
    ],
  };

  const url = `${MP_ENDPOINT}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      log.warn("GA Measurement Protocol returned non-2xx", { status: res.status });
    }
  } catch (error) {
    log.error("GA Measurement Protocol request failed", error);
  }
}
