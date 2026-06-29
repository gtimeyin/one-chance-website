import { getProducts } from "@/lib/woocommerce";
import { productToSearchItem } from "@/lib/search";

export const revalidate = 300;

export async function GET() {
  const products = await getProducts({ per_page: 100 });
  return Response.json({ items: products.map(productToSearchItem) });
}
