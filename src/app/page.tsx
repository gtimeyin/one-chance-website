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
      className="flex flex-col items-center w-full overflow-hidden"
      style={{ position: "relative" }}
    >
      <SmoothScroll />
      <Navbar />
      <Hero />
      <HowToPlay />
      <Characters />
      <VideoSection />
      <Gallery />
      <NewsSection />
      <ReadySection />
      <FAQs />
      <Footer />
    </div>
  );
}
