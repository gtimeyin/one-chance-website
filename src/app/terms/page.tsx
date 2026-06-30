import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for purchasing and using the One Chance board game.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    heading: "1. General",
    body: "By accessing and placing an order with One Chance (operated by Divisions Africa), you confirm that you agree to and are bound by these terms and conditions. These terms apply to the entire website and any communication between you and us.",
  },
  {
    heading: "2. Products",
    body: "All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice. Product images are for illustration purposes and may differ slightly from the actual product.",
  },
  {
    heading: "3. Orders & Payment",
    body: "When you place an order, you will receive an email confirmation. This does not guarantee that your order has been accepted. We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing, or suspected fraud.",
  },
  {
    heading: "4. Intellectual Property",
    body: "All content on this website — including game designs, character illustrations, text, graphics, and logos — is the property of Divisions Africa and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or use any content without our written permission.",
  },
  {
    heading: "5. Limitation of Liability",
    body: "One Chance and Divisions Africa shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the amount paid for the product in question.",
  },
  {
    heading: "6. Governing Law",
    body: "These terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts of Lagos State.",
  },
  {
    heading: "7. Changes to Terms",
    body: "We reserve the right to update these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of the site after changes constitutes acceptance of the new terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div className="relative z-[1]" style={{ paddingTop: 56, background: "white" }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Terms & Conditions" },
            ]}
          />
        </div>

        <PageHero title="TERMS & CONDITIONS" textColor="var(--color-neutral-800)">
          <span className="type-caption text-neutral-400" style={{ marginTop: 8 }}>
            Last updated: April 2026
          </span>
        </PageHero>

        <section
          className="flex w-full flex-col items-center bg-white"
          style={{ padding: "0 24px clamp(48px, 6vw, 96px)" }}
        >
          <div className="flex w-full max-w-[800px] flex-col items-start" style={{ gap: 32 }}>
            {sections.map((s) => (
              <div key={s.heading} className="flex flex-col" style={{ gap: 12 }}>
                <SectionHeading as="h2" size="h3" color="var(--color-neutral-800)" className="uppercase">
                  {s.heading}
                </SectionHeading>
                <p className="type-body-lg text-neutral-600">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <FooterShop reveal />
    </div>
  );
}
