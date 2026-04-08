import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Privacy Policy - One Chance Board Game",
  description: "Privacy policy for the One Chance board game website and shop.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Privacy Policy" },
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
                PRIVACY POLICY
              </h1>
              <p className="font-['Barlow'] text-[14px] leading-[20px] text-neutral-400">
                Last updated: April 2026
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  1. Information We Collect
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  We collect information you provide directly, including your name, email address, shipping address, and payment information when you make a purchase. We also collect newsletter subscription data when you sign up for updates.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  2. How We Use Your Information
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  We use your information to process orders, deliver products, send order confirmations and shipping updates, respond to your enquiries, and send marketing communications (with your consent). We never sell your personal data to third parties.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  3. Payment Security
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  All payment transactions are processed through secure, PCI-compliant payment processors. We do not store your full credit card details on our servers.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  4. Cookies
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  We use essential cookies to keep our site functioning and analytics cookies to understand how visitors use our site. You can control cookie preferences through your browser settings.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  5. Your Rights
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  You have the right to access, update, or delete your personal information at any time. You can also unsubscribe from marketing emails using the link in any email we send. To exercise these rights, contact us at hello@yvpgame.com.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  6. Data Retention
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, and resolve disputes.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="font-['Barlow_Condensed'] text-[24px] font-[700] text-neutral-800 uppercase">
                  7. Contact Us
                </h2>
                <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600">
                  If you have any questions about this privacy policy, please contact us at hello@yvpgame.com or through our <a href="/contact" className="text-[#fccd21] underline">contact page</a>.
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
