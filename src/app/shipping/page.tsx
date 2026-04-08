import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Shipping & Returns - One Chance Board Game",
  description: "Shipping information and return policy for the One Chance board game.",
};

export default function ShippingPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shipping & Returns" },
            ]}
          />
        </div>

        <section
          className="flex w-full flex-col items-center bg-white"
          style={{ padding: "clamp(48px, 6vw, 96px) 24px" }}
        >
          <div className="flex w-full max-w-[800px] flex-col items-start gap-10">
            <h1 className="font-['Barlow_Condensed'] text-[56px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
              SHIPPING & RETURNS
            </h1>

            <div className="flex flex-col gap-8">
              {/* Shipping */}
              <div className="flex flex-col gap-6">
                <h2 className="font-['Barlow_Condensed'] text-[32px] font-[700] text-neutral-800 uppercase">
                  SHIPPING
                </h2>

                <div className="flex flex-col gap-3">
                  <h3 className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
                    Domestic (Nigeria)
                  </h3>
                  <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                    We deliver across Nigeria. Standard delivery takes 3-5 business days within Lagos and 5-10 business days to other states. Express delivery is available for Lagos orders with next-day delivery.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
                    International
                  </h3>
                  <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                    We ship to most countries worldwide. International delivery typically takes 7-21 business days depending on your location and customs processing. Shipping costs are calculated at checkout based on your address.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
                    Order Tracking
                  </h3>
                  <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                    Once your order ships, you will receive an email with a tracking number. You can use this to track your package through our shipping partner&apos;s website.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-neutral-200" />

              {/* Returns */}
              <div className="flex flex-col gap-6">
                <h2 className="font-['Barlow_Condensed'] text-[32px] font-[700] text-neutral-800 uppercase">
                  RETURNS & REFUNDS
                </h2>

                <div className="flex flex-col gap-3">
                  <h3 className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
                    Return Policy
                  </h3>
                  <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                    We accept returns within 14 days of delivery. The product must be unused, in its original packaging, and in the same condition you received it. To initiate a return, contact us at hello@yvpgame.com with your order number.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
                    Damaged or Defective Items
                  </h3>
                  <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                    If your order arrives damaged or with missing components, contact us within 48 hours of delivery with photos of the damage. We will send a replacement at no extra cost.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-['Barlow_Condensed'] text-[20px] font-[700] text-neutral-800 uppercase">
                    Refund Process
                  </h3>
                  <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                    Once we receive and inspect your return, we will notify you of the approval or rejection. Approved refunds will be processed to your original payment method within 5-10 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <FooterShop />
    </div>
  );
}
