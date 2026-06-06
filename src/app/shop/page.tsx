import Navbar from "@/components/layout/Navbar";
import ShopHeroBanner from "@/components/shop/ShopHeroBanner";
import ShopProductGrid from "@/components/shop/ShopProductGrid";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import { getProducts } from "@/lib/woocommerce";

export const metadata = {
  title: "Shop - One Chance Board Game",
  description: "Shop the One Chance board game collection. The first authentic Nigerian board game.",
};

export default async function ShopPage() {
  const allProducts = await getProducts({ per_page: 12 });
  const products = allProducts.filter((p) => p.slug === "one-chance-board-game");

  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        <ShopHeroBanner />
        <ShopProductGrid products={products} />
      </div>
      <FooterShop />
    </div>
  );
}
