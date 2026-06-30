import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Shipping & Returns",
  description: "Shipping information and return policy for the One Chance board game.",
  alternates: { canonical: "/shipping" },
};

const shippingSubsections = [
  {
    heading: "Domestic (Nigeria)",
    body: "We deliver across Nigeria. Standard delivery takes 3-5 business days within Lagos and 5-10 business days to other states. Express delivery is available for Lagos orders with next-day delivery.",
  },
  {
    heading: "International",
    body: "We ship to most countries worldwide. International delivery typically takes 7-21 business days depending on your location and customs processing. Shipping costs are calculated at checkout based on your address.",
  },
  {
    heading: "Order Tracking",
    body: "Once your order ships, you will receive an email with a tracking number. You can use this to track your package through our shipping partner's website.",
  },
];

const returnsSubsections = [
  {
    heading: "Return Policy",
    body: "We accept returns within 14 days of delivery. The product must be unused, in its original packaging, and in the same condition you received it. To initiate a return, contact us at hello@yvpgame.com with your order number.",
  },
  {
    heading: "Damaged or Defective Items",
    body: "If your order arrives damaged or with missing components, contact us within 48 hours of delivery with photos of the damage. We will send a replacement at no extra cost.",
  },
  {
    heading: "Refund Process",
    body: "Once we receive and inspect your return, we will notify you of the approval or rejection. Approved refunds will be processed to your original payment method within 5-10 business days.",
  },
];

export default function ShippingPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div className="relative z-[1]" style={{ paddingTop: 56, background: "white" }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shipping & Returns" },
            ]}
          />
        </div>

        <PageHero title="SHIPPING & RETURNS" textColor="var(--color-neutral-800)" />

        <section
          className="flex w-full flex-col items-center bg-white"
          style={{ padding: "0 24px clamp(48px, 6vw, 96px)" }}
        >
          <div className="flex w-full max-w-[800px] flex-col items-start" style={{ gap: 48 }}>
            <div className="flex w-full flex-col" style={{ gap: 24 }}>
              <SectionHeading as="h2" color="var(--color-neutral-800)" className="uppercase">
                SHIPPING
              </SectionHeading>
              {shippingSubsections.map((s) => (
                <div key={s.heading} className="flex flex-col" style={{ gap: 8 }}>
                  <SectionHeading as="h3" color="var(--color-neutral-800)" className="uppercase">
                    {s.heading}
                  </SectionHeading>
                  <p className="type-body-lg text-neutral-600">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="h-px w-full bg-neutral-200" />

            <div className="flex w-full flex-col" style={{ gap: 24 }}>
              <SectionHeading as="h2" color="var(--color-neutral-800)" className="uppercase">
                RETURNS & REFUNDS
              </SectionHeading>
              {returnsSubsections.map((s) => (
                <div key={s.heading} className="flex flex-col" style={{ gap: 8 }}>
                  <SectionHeading as="h3" color="var(--color-neutral-800)" className="uppercase">
                    {s.heading}
                  </SectionHeading>
                  <p className="type-body-lg text-neutral-600">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <FooterShop reveal />
    </div>
  );
}
