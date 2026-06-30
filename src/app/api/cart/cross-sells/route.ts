import { NextResponse } from "next/server";
import { z } from "zod";
import { getProductsByIds } from "@/lib/woocommerce";

const BodySchema = z.object({
  productIds: z.array(z.number().int().positive()).min(1).max(50),
  country: z.string().length(2),
});

const MAX_CROSS_SELLS = 4;

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ products: [] });
  }
  const { productIds, country } = parsed.data;

  // Resolve the cart's products to get their cross_sell_ids
  const cartProducts = await getProductsByIds(productIds, country.toUpperCase());
  const crossSellIds = new Set<number>();
  for (const p of cartProducts) {
    for (const id of p.cross_sell_ids ?? []) crossSellIds.add(id);
  }
  // Don't recommend items already in the cart
  for (const id of productIds) crossSellIds.delete(id);

  if (crossSellIds.size === 0) {
    return NextResponse.json({ products: [] });
  }

  const products = await getProductsByIds(
    [...crossSellIds].slice(0, MAX_CROSS_SELLS),
    country.toUpperCase(),
  );

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: parseFloat(p.price || "0"),
      regular_price: parseFloat(p.regular_price || p.price || "0"),
      on_sale: p.on_sale,
      image: p.images?.[0]?.src ?? null,
    })),
  });
}
