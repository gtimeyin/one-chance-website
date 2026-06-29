import Navbar from "@/components/layout/Navbar";
import Characters from "@/components/Characters";
import FooterShop from "@/components/v2/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Meet the Lagosians",
  description:
    "The 8 characters of One Chance. From Iya Bose to 2 Bobo — every one of them is somebody you know.",
  alternates: { canonical: "/characters" },
};

export default function CharactersPage() {
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
        <Characters />
      </div>
      <FooterShop reveal />
    </div>
  );
}
