import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Contact Us - One Chance Board Game",
  description: "Get in touch with the One Chance team. For enquiries, partnerships, or just to say hello.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Contact Us" },
            ]}
          />
        </div>
        <ContactHero />
        <ContactForm />
      </div>
      <FooterShop />
    </div>
  );
}
