import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the One Chance board game website and shop.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    heading: "1. Information We Collect",
    body: "We collect information you provide directly, including your name, email address, shipping address, and payment information when you make a purchase. We also collect newsletter subscription data when you sign up for updates.",
  },
  {
    heading: "2. How We Use Your Information",
    body: "We use your information to process orders, deliver products, send order confirmations and shipping updates, respond to your enquiries, and send marketing communications (with your consent). We never sell your personal data to third parties.",
  },
  {
    heading: "3. Payment Security",
    body: "All payment transactions are processed through secure, PCI-compliant payment processors. We do not store your full credit card details on our servers.",
  },
  {
    heading: "4. Cookies & Analytics",
    body: 'We use essential cookies to keep the site functioning (for example, your shopping cart and login session). With your consent, we also load Google Analytics 4, which sets cookies to measure pageviews and user journeys so we can improve the site. Analytics cookies are only set after you click "Accept" on our cookie banner; choose "Decline" and they are never loaded. You can change your choice at any time by clearing your site data in your browser, which will re-show the banner.',
  },
  {
    heading: "5. Your Rights",
    body: "You have the right to access, update, or delete your personal information at any time. You can also unsubscribe from marketing emails using the link in any email we send. To exercise these rights, contact us at hello@yvpgame.com.",
  },
  {
    heading: "6. Data Retention",
    body: "We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, and resolve disputes.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div className="relative z-[1]" style={{ paddingTop: 56, background: "white" }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Privacy Policy" },
            ]}
          />
        </div>

        <PageHero title="PRIVACY POLICY" textColor="var(--color-neutral-800)">
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

            <div className="flex flex-col" style={{ gap: 12 }}>
              <SectionHeading as="h2" size="h3" color="var(--color-neutral-800)" className="uppercase">
                7. Contact Us
              </SectionHeading>
              <p className="type-body-lg text-neutral-600">
                If you have any questions about this privacy policy, please contact us at hello@yvpgame.com or through our <a href="/contact" className="text-[#fccd21] underline">contact page</a>.
              </p>
            </div>
          </div>
        </section>
      </div>
      <FooterShop reveal />
    </div>
  );
}
