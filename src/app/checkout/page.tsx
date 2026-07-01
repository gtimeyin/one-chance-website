import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import CheckoutClient from "./CheckoutClient";
import { getActiveCountry } from "@/lib/currency.server";
import { currencyForCountry } from "@/lib/currency";
import { getOptionalSession } from "@/lib/dal";
import { isStripeConfigured } from "@/lib/stripe";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata = {
  title: "Checkout",
  description: "Complete your One Chance order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  if (!isStripeConfigured() || !isSupabaseConfigured()) {
    // Belt-and-braces — render a degraded page instead of crashing.
    return (
      <div className="flex flex-col w-full" style={{ background: "white", minHeight: "100vh" }}>
        <Navbar />
        <div className="relative z-[1]" style={{ paddingTop: 24 }}>
          <section style={{ padding: "clamp(60px, 8vw, 120px) clamp(20px, 4vw, 60px)" }}>
            <div className="mx-auto" style={{ maxWidth: 720 }}>
              <h1 className="font-barlow-condensed font-extrabold uppercase" style={{ fontSize: 36, color: "var(--color-dark)" }}>
                Checkout unavailable
              </h1>
              <p className="font-barlow-body" style={{ fontSize: 16, color: "var(--color-text-muted)", marginTop: 12 }}>
                Payment is being set up. Please check back shortly.
              </p>
            </div>
          </section>
        </div>
        <FooterShop reveal />
      </div>
    );
  }

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    redirect("/shop");
  }

  const [country, session] = await Promise.all([
    getActiveCountry(),
    getOptionalSession(),
  ]);
  const currency = currencyForCountry(country);

  return (
    <div className="flex flex-col w-full" style={{ background: "white", minHeight: "100vh" }}>
      <SmoothScroll />
      <Navbar />
      <div className="relative z-[1]" style={{ paddingTop: 24, background: "white" }}>
        <CheckoutClient
          country={country}
          currency={currency}
          publishableKey={publishableKey}
          initialEmail={session?.email ?? ""}
          initialFirstName={session?.firstName ?? ""}
          isAuthenticated={Boolean(session)}
        />
      </div>
      <FooterShop reveal />
    </div>
  );
}
