import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/Hero";
import HowToPlay from "@/components/HowToPlay";
import Characters from "@/components/Characters";
import VideoSection from "@/components/VideoSection";
import Gallery from "@/components/Gallery";
import NewsSection from "@/components/NewsSection";
import ReadySection from "@/components/ReadySection";
import FAQs from "@/components/FAQs";
import Footer from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <div
      className="flex flex-col items-center w-full"
      style={{ position: "relative", overflowX: "clip" }}
    >
      <SmoothScroll />
      <Navbar />
      {/* Content layer sits above the footer so it scrolls up to reveal it */}
      <div
        className="relative z-[1] flex w-full flex-col items-center"
        style={{ background: "#fff" }}
      >
        <Hero />
        <HowToPlay />
        <Characters />
        <VideoSection />
        <Gallery />
        <NewsSection />
        <ReadySection />
        <FAQs />
      </div>
      <Footer reveal />
    </div>
  );
}
