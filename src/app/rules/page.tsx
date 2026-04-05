import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import RulesContent from "@/components/rules/RulesContent";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Rules - One Chance Board Game",
  description:
    "Learn how to play One Chance — the Lagos board game of hustle, luck, and survival for 2–6 players.",
};

export default function RulesPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
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
      <FooterShop />
    </div>
  );
}
