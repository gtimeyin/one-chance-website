import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "About Us - One Chance Board Game",
  description: "Learn about the team behind One Chance, the Lagos-themed board game.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "About Us" },
            ]}
          />
        </div>

        {/* Hero */}
        <section
          className="flex w-full flex-col items-center bg-[#121b19]"
          style={{ padding: "clamp(60px, 8vw, 128px) 24px" }}
        >
          <div className="flex w-full max-w-[1024px] flex-col items-start gap-8">
            <span
              className="font-['Barlow'] uppercase"
              style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.15em", color: "#a3a3a3" }}
            >
              ABOUT US
            </span>
            <h1 className="text-display-title-bold font-display-title-bold text-white uppercase -tracking-[2px]">
              WE MADE A GAME OUT OF LAGOS
            </h1>
            <p className="font-['Barlow'] text-[18px] leading-[28px] text-[#a3a3a3] max-w-[720px]">
              One Chance was born from the wild, unpredictable energy of Lagos, Nigeria. We wanted to capture the hustle, the chaos, and the humour of everyday life in a city where anything can happen — and turn it into something you can experience around a table with friends and family.
            </p>
          </div>
        </section>

        {/* Story */}
        <section
          className="flex w-full flex-col items-center bg-white"
          style={{ padding: "clamp(48px, 6vw, 96px) 24px" }}
        >
          <div className="flex w-full max-w-[1024px] flex-col items-start gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="font-['Barlow_Condensed'] text-[48px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
                OUR STORY
              </h2>
              <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600 max-w-[720px]">
                It started as a conversation between friends — &quot;What if Lagos was a board game?&quot; From the danfo buses to the area boys, from the slay queens to the big men, every character and every scenario in One Chance is inspired by real Lagos life.
              </p>
              <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600 max-w-[720px]">
                We spent months researching, designing, and play-testing to make sure the game was not just fun, but authentically Lagos. Every card, every character, every rule was crafted to make you feel like you&apos;re navigating the streets of Eko.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="font-['Barlow_Condensed'] text-[48px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
                OUR MISSION
              </h2>
              <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600 max-w-[720px]">
                We believe in the power of games to bring people together. Our mission is to celebrate African culture through interactive entertainment — starting with Lagos, and expanding to tell more stories from the continent.
              </p>
              <p className="font-['Barlow'] text-[16px] leading-[26px] text-neutral-600 max-w-[720px]">
                One Chance is made by Divisions Africa, a creative studio dedicated to building culturally rich experiences that resonate across borders.
              </p>
            </div>
          </div>
        </section>
      </div>
      <FooterShop />
    </div>
  );
}
