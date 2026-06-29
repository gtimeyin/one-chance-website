import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import RulesContent from "@/components/rules/RulesContent";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Rules",
  description:
    "Learn how to play One Chance — the Lagos board game of hustle, luck, and survival for 2–6 players.",
  alternates: { canonical: "/rules" },
};

export default function RulesPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div className="relative z-[1]" style={{ paddingTop: 56, background: "white" }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Rules" },
            ]}
          />
        </div>
        <RulesContent />
      </div>
      <FooterShop reveal />
    </div>
  );
}
