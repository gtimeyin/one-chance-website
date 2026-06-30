import { NextResponse } from "next/server";
import { z } from "zod";
import { getProductsByIds } from "@/lib/woocommerce";
import { currencyForCountry } from "@/lib/currency";

const BodySchema = z.object({
  productIds: z.array(z.number().int().positive()).min(1).max(50),
  country: z.string().length(2),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { productIds, country } = parsed.data;
  const upper = country.toUpperCase();

  // getProductsByIds runs the products through applyZonePricing, so the
  // returned `price` is the WCPBC per-zone value when one is configured,
  // or the base store price otherwise.
  const products = await getProductsByIds(productIds, upper);
  const prices = products.map((p) => ({
    productId: p.id,
    price: parseFloat(p.price || "0"),
    regular_price: parseFloat(p.regular_price || p.price || "0"),
    on_sale: p.on_sale,
  }));

  return NextResponse.json({
    currency: currencyForCountry(upper),
    prices,
  });
}
