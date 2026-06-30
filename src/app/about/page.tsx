import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = {
  title: "About",
  description: "Learn about the team behind One Chance, the Lagos-themed board game.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div className="relative z-[1]" style={{ paddingTop: 24, background: "white" }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "About Us" },
            ]}
          />
        </div>

        <PageHero
          eyebrow="ABOUT US"
          title="WE MADE A GAME OUT OF LAGOS"
          subtitle="One Chance was born from the wild, unpredictable energy of Lagos, Nigeria. We wanted to capture the hustle, the chaos, and the humour of everyday life in a city where anything can happen — and turn it into something you can experience around a table with friends and family."
          background="#121b19"
          textColor="white"
        />

        <section
          className="flex w-full flex-col items-center bg-white"
          style={{ padding: "clamp(48px, 6vw, 96px) 24px" }}
        >
          <div className="flex w-full max-w-[1024px] flex-col items-start" style={{ gap: 48 }}>
            <div className="flex flex-col" style={{ gap: 16 }}>
              <SectionHeading as="h2" color="var(--color-neutral-800)" className="uppercase">
                OUR STORY
              </SectionHeading>
              <p className="type-body-lg text-neutral-600" style={{ maxWidth: 720 }}>
                It started as a conversation between friends — &quot;What if Lagos was a board game?&quot; From the danfo buses to the area boys, from the slay queens to the big men, every character and every scenario in One Chance is inspired by real Lagos life.
              </p>
              <p className="type-body-lg text-neutral-600" style={{ maxWidth: 720 }}>
                We spent months researching, designing, and play-testing to make sure the game was not just fun, but authentically Lagos. Every card, every character, every rule was crafted to make you feel like you&apos;re navigating the streets of Eko.
              </p>
            </div>

            <div className="flex flex-col" style={{ gap: 16 }}>
              <SectionHeading as="h2" color="var(--color-neutral-800)" className="uppercase">
                OUR MISSION
              </SectionHeading>
              <p className="type-body-lg text-neutral-600" style={{ maxWidth: 720 }}>
                We believe in the power of games to bring people together. Our mission is to celebrate African culture through interactive entertainment — starting with Lagos, and expanding to tell more stories from the continent.
              </p>
              <p className="type-body-lg text-neutral-600" style={{ maxWidth: 720 }}>
                One Chance is made by Divisions Africa, a creative studio dedicated to building culturally rich experiences that resonate across borders.
              </p>
            </div>
          </div>
        </section>
      </div>
      <FooterShop reveal />
    </div>
  );
}
