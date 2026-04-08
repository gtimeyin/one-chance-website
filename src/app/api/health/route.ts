import { isApiConfigured, getProducts } from "@/lib/woocommerce";

export async function GET() {
  const checks: Record<string, { ok: boolean; message: string }> = {};

  // WooCommerce
  if (!isApiConfigured()) {
    checks.woocommerce = { ok: false, message: "API credentials not configured" };
  } else {
    try {
      const products = await getProducts({ per_page: 1 });
      checks.woocommerce = {
        ok: products.length > 0,
        message: products.length > 0 ? "Connected" : "No products found",
      };
    } catch {
      checks.woocommerce = { ok: false, message: "Connection failed" };
    }
  }

  const allOk = Object.values(checks).every((c) => c.ok);

  return Response.json({ ok: allOk, checks }, { status: allOk ? 200 : 503 });
}
