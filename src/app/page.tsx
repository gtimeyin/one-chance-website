import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowToPlay from "@/components/HowToPlay";
import Characters from "@/components/Characters";
import Gallery from "@/components/Gallery";
import ReadySection from "@/components/ReadySection";
import FAQs from "@/components/FAQs";
import Footer from "@/components/Footer";
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
      <Gallery />
      <ReadySection />
      <FAQs />
      <Footer />
    </div>
  );
}
