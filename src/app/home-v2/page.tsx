import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import SmoothScroll from "@/components/SmoothScroll";
import HowToPlayTeaser from "@/components/v2/HowToPlayTeaser";
import CharactersTeaser from "@/components/v2/CharactersTeaser";
import VideoSection from "@/components/v2/VideoSection";
import WhatsInTheBox from "@/components/v2/WhatsInTheBox";
import FAQs from "@/components/v2/FAQs";
import FooterShop from "@/components/v2/FooterShop";

export default function HomeV2() {
  return (
    <div
      className="flex flex-col items-center w-full"
      style={{ position: "relative", overflowX: "clip" }}
    >
      <SmoothScroll />
      <Navbar />
      <div
        className="relative z-[1] flex w-full flex-col items-center"
        style={{ background: "#fff" }}
      >
        <Hero />
        <HowToPlayTeaser />
        <CharactersTeaser />
        <VideoSection />
        <Gallery />
        <WhatsInTheBox />
        <FAQs />
      </div>
      <FooterShop reveal />
    </div>
  );
}
