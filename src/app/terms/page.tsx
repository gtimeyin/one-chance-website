import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Terms & Conditions - One Chance Board Game",
  description: "Terms and conditions for purchasing and using the One Chance board game.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Terms & Conditions" },
            ]}
          />
        </div>

        <section
          className="flex w-full flex-col items-center bg-white"
          style={{ padding: "clamp(48px, 6vw, 96px) 24px" }}
        >
          <div className="flex w-full max-w-[800px] flex-col items-start gap-10">
            <div className="flex flex-col gap-4">
              <h1 className="font-['Barlow_Condensed'] text-[56px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
                TERMS & CONDITIONS
              </h1>
              <p className="font-['Barlow'] text-[14px] leading-[20px] text-neutral-400">
                Last updated: April 2026
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  1. General
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  By accessing and placing an order with One Chance (operated by Divisions Africa), you confirm that you agree to and are bound by these terms and conditions. These terms apply to the entire website and any communication between you and us.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  2. Products
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice. Product images are for illustration purposes and may differ slightly from the actual product.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  3. Orders & Payment
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  When you place an order, you will receive an email confirmation. This does not guarantee that your order has been accepted. We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing, or suspected fraud.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  4. Intellectual Property
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  All content on this website — including game designs, character illustrations, text, graphics, and logos — is the property of Divisions Africa and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or use any content without our written permission.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  5. Limitation of Liability
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  One Chance and Divisions Africa shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the amount paid for the product in question.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  6. Governing Law
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  These terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts of Lagos State.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  7. Changes to Terms
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  We reserve the right to update these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of the site after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <FooterShop />
    </div>
  );
}
