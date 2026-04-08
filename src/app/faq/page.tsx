import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import FAQs from "@/components/FAQs";

export const metadata = {
  title: "FAQ - One Chance Board Game",
  description: "Frequently asked questions about the One Chance board game.",
};

const extendedFaqs = [
  {
    question: "What is One Chance?",
    answer:
      "One Chance is a Lagos-themed board game that captures the chaotic, fun, and unpredictable nature of life in Lagos, Nigeria. Navigate through traffic, avoid scams, and build your fortune!",
  },
  {
    question: "How many players can play?",
    answer:
      "One Chance can be played with 2-6 players, making it perfect for family game nights or gatherings with friends.",
  },
  {
    question: "How long does a typical game last?",
    answer:
      "A typical game of One Chance lasts between 45 minutes to 1.5 hours, depending on the number of players and how the dice roll!",
  },
  {
    question: "What age group is this game suitable for?",
    answer:
      "One Chance is suitable for ages 12 and above. The game contains themes and references that are best appreciated by teens and adults.",
  },
  {
    question: "What comes in the box?",
    answer:
      "The game includes a game board, 6 character pieces, 2 dice, money cards, action cards, property cards, and a comprehensive rule book.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship to most countries worldwide. Shipping costs and delivery times vary based on your location. Check our shipping page for more details.",
  },
  {
    question: "Can I buy the game as a gift?",
    answer:
      "Absolutely! One Chance makes a great gift. We offer gift wrapping options at checkout and can include a personalized message.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 14 days of delivery. The product must be unused and in its original packaging. Visit our shipping & returns page for full details.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you will receive an email with a tracking number. You can use this to monitor your delivery status.",
  },
  {
    question: "Can I play One Chance online?",
    answer:
      "One Chance is currently a physical board game only. We are exploring digital versions — follow us on social media for updates!",
  },
  {
    question: "Do you offer wholesale or bulk pricing?",
    answer:
      "Yes, we offer discounts for bulk orders. Contact us at hello@yvpgame.com for wholesale enquiries.",
  },
  {
    question: "Is the game available in stores?",
    answer:
      "One Chance is currently available exclusively through our online shop. We are working on partnerships with select retail stores in Nigeria and internationally.",
  },
];

export default function FAQPage() {
  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        <div style={{ padding: "0 clamp(20px, 4vw, 40px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "FAQ" },
            ]}
          />
        </div>
        <FAQs
          faqs={extendedFaqs}
          heading="FREQUENTLY ASKED QUESTIONS"
          subheading="EVERYTHING YOU NEED TO KNOW"
        />
      </div>
      <FooterShop />
    </div>
  );
}
