"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/ui/components/Button";

/* ─── Data ─── */

const setupSteps = [
  { number: "1", text: "Place the board in the center where everyone can reach it." },
  { number: "2", text: "Each player picks a character token — this is you for the rest of the game." },
  { number: "3", text: "Shuffle the One Chance cards and stack them face-down in the center of the board." },
  { number: "4", text: "Place the Bank and Market card decks to the side of the board." },
  { number: "5", text: "Pick someone to run the Bank. Got a friend who just wants to watch? Perfect banker." },
  { number: "6", text: "Decide who goes first amongst yourselves — then begin." },
  { number: "7", text: "Play moves clockwise from the first player." },
];

const jambRolls = [
  { roll: "4", result: "Collect N500k, move to SALARY", icon: "💰" },
  { roll: "5", result: "Collect N500k, move to TRAFFIC — skip a turn", icon: "🚗" },
  { roll: "6", result: "Collect N500k, move to One Chance — pick a card", icon: "🎴" },
];

const tileRules = [
  {
    title: "Salary",
    color: "#5AD46F",
    emoji: "💵",
    short: "Collect N500,000",
    text: "Pass it or land on it — either way you collect N500,000. Payday, baby.",
  },
  {
    title: "Traffic",
    color: "#DF6961",
    emoji: "🚦",
    short: "Skip a turn",
    text: "Welcome to Lagos traffic. You're not going anywhere this round.",
  },
  {
    title: "One Chance",
    color: "#FCD958",
    emoji: "🎲",
    short: "Pick a card, follow it",
    text: "Draw from the top of the deck, read it out loud, and do exactly what it says. No putting it back.",
  },
  {
    title: "Bank",
    color: "#99CAF1",
    emoji: "🏦",
    short: "Invest your money",
    text: "Browse the Bank cards and invest in assets with a Return value at end of game. You can only access Bank cards when you're on this tile.",
  },
  {
    title: "Market",
    color: "#A75ACD",
    emoji: "🏪",
    short: "Buy assets",
    text: "Shop for assets from the Market deck — each has a Return value at end of game. Like the Bank, you can only buy when you land here.",
  },
  {
    title: "Tax",
    color: "#FBAC43",
    emoji: "🧾",
    short: "Pay 20% of your cash",
    text: "Hand over 20% of your cash in hand to the government. Round up to the nearest N50k. Property and investments are safe — only cash gets taxed. Invest wisely.",
  },
  {
    title: "Bus Stop",
    color: "#C73367",
    emoji: "🚌",
    short: "Pay to move",
    text: "You MUST pay to hop to another tile between Prison and Bonus. Each tile costs N50k more than the last. Own a car? You ride free.",
  },
  {
    title: "Prison",
    color: "#D03B3F",
    emoji: "⛓️",
    short: "Stuck for 2 turns",
    text: "Straight to jail. Miss 2 turns, or pay N300k bail to get out immediately.",
  },
  {
    title: "Ajo",
    color: "#7A51A0",
    emoji: "🤝",
    short: "Contribute N100k",
    text: "Drop N100k into the community pot on the board. It builds up for whoever lands on Bonus.",
  },
  {
    title: "Bonus",
    color: "#4CC5FF",
    emoji: "🎉",
    short: "Collect the Ajo pot",
    text: "Jackpot — collect everything that's been dropped into the Ajo pot. The more people contribute, the bigger your payday.",
  },
];

const busStopPrices = [
  { destination: "Prison", price: "FREE" },
  { destination: "One Chance (1)", price: "N50,000" },
  { destination: "Bank", price: "N100,000" },
  { destination: "Market", price: "N150,000" },
  { destination: "One Chance (2)", price: "N200,000" },
  { destination: "Ajo", price: "N250,000" },
  { destination: "Bonus", price: "N300,000" },
];

const keyTerms = [
  { term: "Board", emoji: "🗺️", definition: "Where all the action happens — lay it flat and place your tokens." },
  { term: "Tile", emoji: "🔲", definition: "The 16 spaces around the board that you move through each turn." },
  { term: "Player Token", emoji: "🎭", definition: "Your character piece — 8 to choose from, each with a unique face and color." },
  { term: "Insurance", emoji: "🛡️", definition: "Protects you from specific One Chance incidents. Covers property damage only." },
  { term: "Bankruptcy", emoji: "📉", definition: "Need cash badly? Sell your assets back to the bank at the bankruptcy value." },
  { term: "Return", emoji: "📈", definition: "What your investment is worth at the end of the game. Some go up, some go down." },
  { term: "Gbese", emoji: "💸", definition: "Yoruba for debt. Can't afford a One Chance penalty? Hold the card and pay it off after your next salary." },
];

const gameModes = [
  {
    title: "One Chance Mode",
    subtitle: "2–6 players",
    tag: "Default",
    emoji: "🎲",
    description: "The classic. Take turns, roll dice, survive Lagos. When all 32 One Chance cards run out, the game ends. Everyone declares their assets — cash plus return on investments. Richest player wins.",
  },
  {
    title: "Team Mode",
    subtitle: "4–12 players",
    tag: "Squads",
    emoji: "🤝",
    description: "Form teams of 2 or 3 and control one character together. Same rules, bigger arguments. When the cards run out, the richest team wins.",
  },
  {
    title: "Timed Mode",
    subtitle: "30 minutes+",
    tag: "Speed run",
    emoji: "⏱️",
    description: "Agree on a time limit before you start. When the clock runs out, the last player finishes their turn, then everyone counts up. Richest player wins. Perfect for when you don't have all night.",
  },
];

const disputeGroups = [
  {
    title: "Money Rules",
    emoji: "💰",
    items: [
      "All calculations round up to the nearest N50,000. A N20k tax becomes N50k. A N120k tax becomes N150k. No small change in Lagos.",
      "You cannot gift or give other players money — not even as a sign of romance.",
      "Tax only applies to cash in hand. Property, investments, and assets are safe.",
    ],
  },
  {
    title: "Card Rules",
    emoji: "🎴",
    items: [
      "All good One Chance cards apply whether you own the related asset or not.",
      "No car but drew a car-related One Chance? It doesn't apply — but you must plead your case convincingly. Or else.",
      "Bank and Market cards can be resold to other players, but only between the purchase price and return price. Never above return.",
      "Insurance has no return value at end of game, but insurance from One Chance cards can be resold.",
    ],
  },
  {
    title: "Movement Rules",
    emoji: "🚶",
    items: [
      "If a One Chance card sends you to jail and you pass Salary on the way — tough luck. No N500k for you.",
      "If your JAMB result was fake (failed 3 times), you don't collect salary when you eventually pass JAMB.",
      "Take 3 steps backwards past Salary? You collect another salary when you pass it again.",
      "You cannot waive One Chance debts owed to other players or refuse to pay — even ransom.",
    ],
  },
  {
    title: "Survival Rules",
    emoji: "🛟",
    items: [
      "Go bankrupt from One Chance? That's Gbese. Hold the card and pay after your next salary.",
      "Bankrupt players can sell property back to the bank or auction to the highest bidder. Bids can't exceed Return value.",
      "Corruption is rampant in Nigeria — but if you're caught cheating or stealing, you're immediately disqualified. Key word: caught.",
    ],
  },
];

const gameComponents = [
  { name: "One Chance Cards", count: 32, emoji: "🎴" },
  { name: "Tokens", count: 8, emoji: "🎭" },
  { name: "Market Cards", count: 14, emoji: "🏪" },
  { name: "Bank Cards", count: 14, emoji: "🏦" },
  { name: "Board", count: 1, emoji: "🗺️" },
  { name: "Money Notes", count: 75, emoji: "💵" },
  { name: "Die", count: 1, emoji: "🎲" },
];

// The 8 character tokens — real artwork already in the project.
const tokens = [
  { name: "Femi", src: "/loader/femi.png" },
  { name: "Iya Bose", src: "/loader/iya bose.png" },
  { name: "Madam", src: "/loader/madam.png" },
  { name: "Obi", src: "/loader/obi.png" },
  { name: "Chioma", src: "/loader/chioma.png" },
  { name: "Precious", src: "/loader/precious.png" },
  { name: "2 Bobo", src: "/loader/2bobo.png" },
  { name: "Chief", src: "/loader/chief.png" },
];

/* ─── Searchable items for the search index ─── */

type SearchItem = { section: string; title: string; text: string };

function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  keyTerms.forEach((t) => items.push({ section: "Overview", title: t.term, text: t.definition }));
  gameComponents.forEach((c) => items.push({ section: "Overview", title: c.name, text: `${c.count} included in the box` }));
  setupSteps.forEach((s) => items.push({ section: "Setup", title: `Step ${s.number}`, text: s.text }));
  jambRolls.forEach((j) => items.push({ section: "Setup", title: `Roll ${j.roll}`, text: j.result }));
  tileRules.forEach((t) => items.push({ section: "Tiles", title: t.title, text: `${t.short}. ${t.text}` }));
  busStopPrices.forEach((b) => items.push({ section: "Tiles", title: `Bus Stop → ${b.destination}`, text: b.price }));
  gameModes.forEach((m) => items.push({ section: "Modes", title: m.title, text: `${m.subtitle}. ${m.description}` }));
  disputeGroups.forEach((g) => g.items.forEach((item) => items.push({ section: "Disputes", title: g.title, text: item })));
  return items;
}

/* ─── Search scoring + highlighting ─── */

type ScoredItem = { item: SearchItem; score: number };

// Rank an item against the query terms. Returns null if not every term is
// present (AND match), so unrelated rows are dropped instead of padding the list.
function scoreItem(item: SearchItem, terms: string[]): ScoredItem | null {
  const title = item.title.toLowerCase();
  const text = item.text.toLowerCase();
  let score = 0;
  for (const term of terms) {
    const inTitle = title.includes(term);
    const inText = text.includes(term);
    if (!inTitle && !inText) return null; // every term must match somewhere
    if (title === term) score += 100;
    else if (title.startsWith(term)) score += 50;
    else if (inTitle) score += 25;
    if (text.startsWith(term)) score += 8;
    else if (inText) score += 4;
  }
  return { item, score };
}

// Wrap matched terms in <mark> so the user can see why a row matched.
function highlight(value: string, terms: string[]) {
  if (terms.length === 0) return value;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = value.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  return parts.map((part, i) =>
    terms.includes(part.toLowerCase()) ? (
      <mark
        key={i}
        style={{ background: "var(--color-yellow)", color: "var(--color-dark)", padding: "0 2px" }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/* ─── Reusable: image slot ───
   Renders a real <Image> when `src` is provided, otherwise an on-brand
   halftone placeholder with the section emoji. Placeholder slots are tagged
   with data-image-slot so real artwork can be dropped in later — just pass a
   `src` to each call site once assets land in /public. */

function ImageSlot({
  src,
  alt,
  emoji,
  tint = "#FCCD21",
  aspect = "4 / 3",
  className = "",
  imgClassName = "object-cover",
  sizes = "(max-width: 768px) 100vw, 360px",
  priority = false,
}: {
  src?: string;
  alt: string;
  emoji?: string;
  tint?: string;
  aspect?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: aspect, background: "rgba(0,0,0,0.06)" }}>
        <Image src={src} alt={alt} fill className={imgClassName} sizes={sizes} priority={priority} />
      </div>
    );
  }
  return (
    <div
      data-image-slot={alt}
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        aspectRatio: aspect,
        background: tint,
        backgroundImage: "radial-gradient(rgba(18,27,25,0.16) 1.4px, transparent 1.5px)",
        backgroundSize: "13px 13px",
      }}
    >
      <span style={{ fontSize: "clamp(38px, 8vw, 64px)", filter: "drop-shadow(0 3px 0 rgba(0,0,0,0.14))" }}>
        {emoji}
      </span>
      <span
        className="absolute font-['Barlow_Condensed'] font-[700] uppercase"
        style={{
          bottom: 8,
          right: 8,
          fontSize: 9,
          letterSpacing: "0.12em",
          color: "rgba(18,27,25,0.55)",
          background: "rgba(255,255,255,0.65)",
          padding: "2px 6px",
        }}
      >
        art
      </span>
    </div>
  );
}

/* ─── Reusable: section header ─── */

function SectionHead({
  eyebrow,
  title,
  subtitle,
  accent,
  onDark = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent: string;
  onDark?: boolean;
}) {
  const titleColor = onDark ? "#ffffff" : "var(--color-dark)";
  const subColor = onDark ? "rgba(255,255,255,0.6)" : "rgba(18,27,25,0.6)";
  return (
    <div className="mb-8">
      {eyebrow && (
        <span className="type-eyebrow block mb-2" style={{ color: accent }}>
          {eyebrow}
        </span>
      )}
      <h2 className="type-display uppercase" style={{ color: titleColor }}>
        {title}
      </h2>
      {subtitle && (
        <p className="type-body-lg mt-3 max-w-[620px]" style={{ color: subColor }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ─── Tab definitions ─── */

const TABS = [
  { id: "overview", label: "Overview", icon: "📖" },
  { id: "setup", label: "Setup", icon: "🎲" },
  { id: "tiles", label: "Tiles", icon: "🗺️" },
  { id: "modes", label: "Modes", icon: "🎮" },
  { id: "disputes", label: "Disputes", icon: "⚖️" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SECTION_PAD = "clamp(56px, 8vw, 100px) clamp(20px, 4vw, 40px)";
const SHELL = "max-w-[1100px] mx-auto";

/* ─── Component ─── */

export default function RulesContent() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");

  const searchIndex = useMemo(() => buildSearchIndex(), []);

  const queryTerms = useMemo(
    () => search.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [search]
  );

  const searchResults = useMemo(() => {
    if (queryTerms.length === 0) return null;
    return searchIndex
      .map((item) => scoreItem(item, queryTerms))
      .filter((r): r is ScoredItem => r !== null)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);
  }, [queryTerms, searchIndex]);

  const isSearching = searchResults !== null;

  return (
    <div className="flex flex-col w-full items-center">
      {/* Hero */}
      <div
        className="w-full flex flex-col items-center justify-center text-center relative overflow-hidden"
        style={{
          background: "#ffffff",
          padding: "clamp(60px, 10vw, 120px) 24px clamp(36px, 5vw, 52px)",
        }}
      >
        <span className="type-eyebrow mb-3" style={{ color: "rgba(18,27,25,0.5)" }}>
          How to play
        </span>
        <h1
          className="font-['Barlow_Condensed'] font-[800] uppercase text-center"
          style={{
            fontSize: "clamp(64px, 13vw, 190px)",
            lineHeight: 0.86,
            letterSpacing: "-0.04em",
            color: "var(--color-dark)",
          }}
        >
          THE RULES
        </h1>
        <p
          className="type-body-lg font-[600] mt-5 max-w-[460px]"
          style={{ color: "rgba(18,27,25,0.75)" }}
        >
          Hustle. Invest. Survive Lagos. The richest player wins.
        </p>

        {/* Token row — real character art */}
        <div className="flex items-center justify-center mt-8" style={{ marginLeft: 10 }}>
          {tokens.map((t, i) => (
            <div
              key={t.name}
              title={t.name}
              className="rounded-full overflow-hidden bg-white"
              style={{
                width: "clamp(40px, 9vw, 56px)",
                height: "clamp(40px, 9vw, 56px)",
                marginLeft: -10,
                border: "3px solid #fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                zIndex: i,
              }}
            >
              <Image src={t.src} alt={t.name} width={56} height={56} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Sticky tab bar + search */}
      <div
        className="w-full sticky top-0 z-40"
        style={{ background: "var(--color-dark)" }}
      >
        <div className="max-w-[1100px] mx-auto px-4 py-3">
          {/* Search */}
          <div className="relative mb-3 max-w-[520px] mx-auto">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rules... e.g. prison, salary, gbese"
              className="w-full font-['Barlow_Condensed'] text-[15px]"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 6,
                padding: "11px 14px 11px 38px",
                color: "#fff",
                outline: "none",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent"
                style={{ color: "rgba(255,255,255,0.6)", fontSize: 20, lineHeight: 1 }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          {/* Tabs */}
          {!isSearching && (
            <div className="flex items-center justify-center gap-1.5 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="font-['Barlow_Condensed'] font-[700] text-[14px] uppercase tracking-[0.04em] cursor-pointer border-none shrink-0 flex items-center gap-1.5 transition-all duration-200"
                    style={{
                      background: isActive ? "var(--color-yellow)" : "rgba(255,255,255,0.08)",
                      color: isActive ? "var(--color-dark)" : "rgba(255,255,255,0.7)",
                      padding: "9px 16px",
                      borderRadius: 999,
                    }}
                  >
                    <span style={{ fontSize: 15 }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {isSearching && (
        <div
          className="w-full"
          style={{ background: "#ffffff", padding: "clamp(40px, 6vw, 60px) 24px", minHeight: 400 }}
        >
          <div className={SHELL}>
            <p className="font-['Barlow_Condensed'] mb-6" style={{ fontSize: 15, color: "rgba(18,27,25,0.5)" }}>
              {searchResults!.length} result{searchResults!.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
            {searchResults!.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-['Barlow_Condensed'] font-[600]" style={{ fontSize: 18, color: "rgba(18,27,25,0.3)" }}>
                  No rules found. Try a different search term.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {searchResults!.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="font-['Barlow_Condensed']"
                    style={{
                      background: "#F5F5F5",
                      padding: "16px 20px",
                      borderLeft: "4px solid var(--color-yellow)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(18,27,25,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {item.section}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "var(--color-dark)" }}>
                        {highlight(item.title, queryTerms)}
                      </span>
                    </div>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(18,27,25,0.7)" }}>
                      {highlight(item.text, queryTerms)}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content */}
      {!isSearching && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "setup" && <SetupTab />}
            {activeTab === "tiles" && <TilesTab />}
            {activeTab === "modes" && <ModesTab />}
            {activeTab === "disputes" && <DisputesTab />}
          </motion.div>
        </AnimatePresence>
      )}

      {/* CTA */}
      <div
        className="w-full flex flex-col items-center justify-center text-center"
        style={{
          background: "var(--color-yellow)",
          padding: "clamp(60px, 8vw, 100px) 24px",
        }}
      >
        <h2 className="type-display uppercase mb-3" style={{ color: "var(--color-dark)" }}>
          Ready to Play?
        </h2>
        <p
          className="type-body-lg mb-8"
          style={{ color: "rgba(18,27,25,0.7)", maxWidth: 420 }}
        >
          Now that you know the rules, grab a copy and find out who&apos;s the real Lagos big shot.
        </p>
        <Button
          variant="brand-primary"
          size="medium"
          onClick={() => { window.location.href = "/shop"; }}
        >
          Buy the Game
        </Button>
      </div>
    </div>
  );
}

/* ─── Tab: Overview ─── */

function OverviewTab() {
  return (
    <>
      {/* Video */}
      <div className="w-full" style={{ background: "var(--color-yellow)", padding: SECTION_PAD }}>
        <div className={SHELL}>
          <SectionHead
            eyebrow="Watch instead"
            title="See It In Action"
            subtitle="Reading is the worst way to learn a game. Watch and play along."
            accent="var(--color-dark)"
            onDark={false}
          />
          <div
            className="relative w-full"
            style={{ paddingBottom: "56.25%", overflow: "hidden", border: "4px solid var(--color-dark)" }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/TVMIKgn9cy8"
              title="How to play One Chance"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Objective + board */}
      <div className="w-full" style={{ background: "var(--color-dark)", padding: SECTION_PAD }}>
        <div className={`${SHELL} grid grid-cols-1 md:grid-cols-2 gap-10 items-center`}>
          <div>
            <SectionHead eyebrow="The point of it all" title="The Objective" accent="var(--color-yellow)" />
            <p className="type-body-lg" style={{ color: "rgba(255,255,255,0.78)" }}>
              Use strategy and smart investments to build your wealth while dodging the chaos that faces every everyday
              Nigerian. When the game ends, the richest player wins.
            </p>
          </div>
          {/* Real board art */}
          <ImageSlot
            src="/images/shop/game-board.png"
            alt="One Chance game board"
            aspect="4 / 3"
            imgClassName="object-contain"
          />
        </div>
      </div>

      {/* What's in the Box */}
      <div className="w-full" style={{ background: "#ffffff", padding: SECTION_PAD }}>
        <div className={SHELL}>
          <SectionHead
            eyebrow="Open it up"
            title="What's in the Box"
            subtitle="Everything you need to start playing."
            accent="var(--color-dark)"
            onDark={false}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {gameComponents.map((comp) => (
              <div key={comp.name} className="flex flex-col" style={{ border: "1px solid rgba(0,0,0,0.1)" }}>
                <ImageSlot alt={comp.name} emoji={comp.emoji} tint="var(--color-yellow-light)" aspect="1 / 1" />
                <div className="flex items-baseline gap-2 px-3 py-3">
                  <span className="font-['Barlow_Condensed'] font-[800]" style={{ fontSize: 26, lineHeight: 1, color: "var(--color-dark)" }}>
                    {comp.count}
                  </span>
                  <span className="font-['Barlow_Condensed'] font-[600]" style={{ fontSize: 13, color: "rgba(18,27,25,0.6)" }}>
                    {comp.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet your tokens — real character art */}
      <div className="w-full" style={{ background: "var(--color-yellow)", padding: SECTION_PAD }}>
        <div className={SHELL}>
          <SectionHead
            eyebrow="Pick your fighter"
            title="Meet the Tokens"
            subtitle="8 characters to play as — each with a face, a hustle, and a color."
            accent="var(--color-dark)"
            onDark={false}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tokens.map((t) => (
              <div key={t.name} className="flex flex-col items-center" style={{ background: "rgba(255,255,255,0.45)", padding: "16px 12px" }}>
                <div className="rounded-full overflow-hidden bg-white" style={{ width: 88, height: 88, border: "3px solid var(--color-dark)" }}>
                  <Image src={t.src} alt={t.name} width={88} height={88} className="w-full h-full object-cover" />
                </div>
                <span className="font-['Barlow_Condensed'] font-[700] uppercase mt-3" style={{ fontSize: 14, color: "var(--color-dark)", letterSpacing: "0.03em" }}>
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Terms */}
      <div className="w-full" style={{ background: "var(--color-dark)", padding: SECTION_PAD }}>
        <div className={SHELL}>
          <SectionHead
            eyebrow="Talk the talk"
            title="Know the Lingo"
            subtitle="Key terms you'll hear during the game."
            accent="var(--color-yellow)"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyTerms.map((item) => (
              <div key={item.term} className="flex gap-4 items-start" style={{ background: "rgba(255,255,255,0.06)", padding: "18px 20px" }}>
                <span style={{ fontSize: 28, lineHeight: 1 }}>{item.emoji}</span>
                <div>
                  <h3 className="font-['Barlow_Condensed'] font-[700] uppercase" style={{ fontSize: 17, color: "var(--color-yellow)", marginBottom: 3, letterSpacing: "0.02em" }}>
                    {item.term}
                  </h3>
                  <p className="font-['Barlow_Condensed']" style={{ fontSize: 15, lineHeight: 1.55, color: "rgba(255,255,255,0.78)" }}>
                    {item.definition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Tab: Setup ─── */

function SetupTab() {
  return (
    <>
      <div className="w-full" style={{ background: "var(--color-dark)", padding: SECTION_PAD }}>
        <div className={SHELL}>
          <SectionHead eyebrow="Before you begin" title="Setting Up" accent="#5AD46F" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {setupSteps.map((step) => (
              <div key={step.number} className="flex gap-4 items-start" style={{ background: "rgba(90,212,111,0.12)", borderLeft: "4px solid #5AD46F", padding: "20px" }}>
                <span className="font-['Barlow_Condensed'] font-[800] shrink-0" style={{ fontSize: 40, lineHeight: 0.9, color: "#5AD46F" }}>
                  {step.number}
                </span>
                <p className="font-['Barlow_Condensed']" style={{ fontSize: 16, lineHeight: 1.55, color: "rgba(255,255,255,0.88)", paddingTop: 4 }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* JAMB */}
      <div className="w-full" style={{ background: "#5AD46F", padding: SECTION_PAD }}>
        <div className={SHELL}>
          <SectionHead
            eyebrow="Your first challenge"
            title="Pass JAMB First"
            subtitle="Before you can start your Lagos journey, you need to pass JAMB. Roll a 4 or higher to get in. You have 3 tries."
            accent="var(--color-dark)"
            onDark={false}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {jambRolls.map((j) => (
              <div key={j.roll} className="flex flex-col" style={{ background: "#fff", border: "3px solid var(--color-dark)" }}>
                <ImageSlot alt={`Roll ${j.roll}`} emoji={j.icon} tint="#5AD46F" aspect="3 / 2" />
                <div className="px-4 py-4 text-center">
                  <span className="font-['Barlow_Condensed'] font-[800] block" style={{ fontSize: 40, lineHeight: 1, color: "var(--color-dark)" }}>
                    {j.roll}
                  </span>
                  <span className="font-['Barlow_Condensed']" style={{ fontSize: 14, color: "rgba(18,27,25,0.7)" }}>
                    {j.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="font-['Barlow_Condensed']" style={{ background: "var(--color-dark)", padding: "20px 24px", borderLeft: "4px solid var(--color-yellow)" }}>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.9)" }}>
              <strong style={{ color: "var(--color-yellow)" }}>Failed all 3 tries?</strong> Go to SALARY and collect only
              N100k. Life isn&apos;t fair to everyone.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Tab: Tiles ─── */

function TilesTab() {
  return (
    <div className="w-full" style={{ background: "var(--color-dark)", padding: SECTION_PAD }}>
      <div className={SHELL}>
        <SectionHead
          eyebrow="The board"
          title="Every Tile Explained"
          subtitle="There are 16 tiles around the board. Here's what happens when you land on each one."
          accent="#4CC5FF"
        />

        {/* Full grid — nothing hidden */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tileRules.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i, 6) * 0.04 }}
              className="flex flex-col"
              style={{ background: "#fff", borderTop: `5px solid ${tile.color}` }}
            >
              <ImageSlot alt={tile.title} emoji={tile.emoji} tint={tile.color} aspect="16 / 10" />
              <div className="px-5 py-5">
                <h3 className="font-['Barlow_Condensed'] font-[800] uppercase mb-2" style={{ fontSize: 22, lineHeight: 1, color: "var(--color-dark)" }}>
                  {tile.title}
                </h3>
                <span
                  className="inline-block font-['Barlow_Condensed'] font-[700] uppercase mb-3"
                  style={{ fontSize: 12, letterSpacing: "0.04em", color: "var(--color-dark)", background: tile.color, padding: "3px 10px" }}
                >
                  {tile.short}
                </span>
                <p className="font-['Barlow_Condensed']" style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(18,27,25,0.72)" }}>
                  {tile.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bus Stop fare table */}
        <div className="mt-12">
          <h3 className="font-['Barlow_Condensed'] font-[800] uppercase text-white mb-1" style={{ fontSize: 22 }}>
            🚌 Bus Stop Fare Table
          </h3>
          <p className="font-['Barlow_Condensed'] mb-5" style={{ fontSize: 15, color: "rgba(255,255,255,0.55)" }}>
            What it costs to hop between Prison and Bonus. Own a car? You ride free.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {busStopPrices.map((item) => (
              <div key={item.destination} className="font-['Barlow_Condensed'] flex flex-col" style={{ background: "rgba(255,255,255,0.08)", padding: "14px 16px" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{item.destination}</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: item.price === "FREE" ? "#4CC5FF" : "#fff" }}>{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab: Modes ─── */

function ModesTab() {
  return (
    <>
      <div className="w-full" style={{ background: "var(--color-dark)", padding: SECTION_PAD }}>
        <div className={SHELL}>
          <SectionHead eyebrow="Choose your style" title="3 Ways to Play" accent="#A75ACD" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gameModes.map((mode) => (
              <div key={mode.title} className="flex flex-col" style={{ background: "#fff" }}>
                <ImageSlot alt={mode.title} emoji={mode.emoji} tint="#A75ACD" aspect="16 / 10" />
                <div className="flex flex-col px-6 py-6">
                  <span
                    className="inline-block self-start font-['Barlow_Condensed'] font-[800] uppercase text-[11px] tracking-[0.1em] mb-3"
                    style={{ color: "#fff", background: "#A75ACD", padding: "3px 10px" }}
                  >
                    {mode.tag}
                  </span>
                  <h3 className="font-['Barlow_Condensed'] font-[800] uppercase" style={{ fontSize: 22, color: "var(--color-dark)" }}>
                    {mode.title}
                  </h3>
                  <span className="font-['Barlow_Condensed'] font-[600]" style={{ fontSize: 14, color: "rgba(18,27,25,0.5)", marginBottom: 12 }}>
                    {mode.subtitle}
                  </span>
                  <p className="font-['Barlow_Condensed']" style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(18,27,25,0.72)" }}>
                    {mode.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* End of Game */}
      <div className="w-full" style={{ background: "#A75ACD", padding: SECTION_PAD }}>
        <div className={`${SHELL} text-center`}>
          <h2 className="type-display uppercase mb-4 text-white">Game Over</h2>
          <p className="type-body-lg mx-auto" style={{ color: "rgba(255,255,255,0.88)", maxWidth: 560 }}>
            When the last One Chance card is drawn or the timer runs out, everyone counts up. Cash in hand plus return on
            all investments. The richest player standing wins.
          </p>
        </div>
      </div>
    </>
  );
}

/* ─── Tab: Disputes ─── */

function DisputesTab() {
  return (
    <div className="w-full" style={{ background: "var(--color-dark)", padding: SECTION_PAD }}>
      <div className={SHELL}>
        <SectionHead
          eyebrow="Mobile court"
          title="The Fine Print"
          subtitle="The edge cases, arguments, and gotchas that decide who really wins."
          accent="#DF6961"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {disputeGroups.map((group) => (
            <div key={group.title} style={{ background: "rgba(255,255,255,0.05)", padding: "24px" }}>
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontSize: 26, lineHeight: 1 }}>{group.emoji}</span>
                <h3 className="font-['Barlow_Condensed'] font-[800] uppercase" style={{ fontSize: 19, letterSpacing: "0.02em", color: "#DF6961" }}>
                  {group.title}
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {group.items.map((item, i) => (
                  <div
                    key={i}
                    className="font-['Barlow_Condensed'] flex gap-3"
                    style={{ fontSize: 15, lineHeight: 1.55, color: "rgba(255,255,255,0.82)" }}
                  >
                    <span style={{ color: "#DF6961", fontWeight: 800, flexShrink: 0 }}>›</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="font-['Barlow_Condensed'] font-[800] uppercase text-center mt-14" style={{ fontSize: "clamp(24px, 3.6vw, 36px)", lineHeight: 1.1, color: "var(--color-yellow)", letterSpacing: "-0.01em" }}>
          This is One Chance — anything you see, take it like that.
        </p>
      </div>
    </div>
  );
}
