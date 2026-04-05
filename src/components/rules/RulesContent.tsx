"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
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
  { term: "Board", definition: "Where all the action happens — lay it flat and place your tokens." },
  { term: "Tile", definition: "The 16 spaces around the board that you move through each turn." },
  { term: "Player Token", definition: "Your character piece — 8 to choose from, each with a unique face and color." },
  { term: "Insurance", definition: "Protects you from specific One Chance incidents. Covers property damage only." },
  { term: "Bankruptcy", definition: "Need cash badly? Sell your assets back to the bank at the bankruptcy value." },
  { term: "Return", definition: "What your investment is worth at the end of the game. Some go up, some go down." },
  { term: "Gbese", definition: "Yoruba for debt. Can't afford a One Chance penalty? Hold the card and pay it off after your next salary." },
];

const gameModes = [
  {
    title: "One Chance Mode",
    subtitle: "2–6 players",
    tag: "Default",
    description: "The classic. Take turns, roll dice, survive Lagos. When all 32 One Chance cards run out, the game ends. Everyone declares their assets — cash plus return on investments. Richest player wins.",
  },
  {
    title: "Team Mode",
    subtitle: "4–12 players",
    tag: "Squads",
    description: "Form teams of 2 or 3 and control one character together. Same rules, bigger arguments. When the cards run out, the richest team wins.",
  },
  {
    title: "Timed Mode",
    subtitle: "30 minutes+",
    tag: "Speed run",
    description: "Agree on a time limit before you start. When the clock runs out, the last player finishes their turn, then everyone counts up. Richest player wins. Perfect for when you don't have all night.",
  },
];

const disputeGroups = [
  {
    title: "Money Rules",
    items: [
      "All calculations round up to the nearest N50,000. A N20k tax becomes N50k. A N120k tax becomes N150k. No small change in Lagos.",
      "You cannot gift or give other players money — not even as a sign of romance.",
      "Tax only applies to cash in hand. Property, investments, and assets are safe.",
    ],
  },
  {
    title: "Card Rules",
    items: [
      "All good One Chance cards apply whether you own the related asset or not.",
      "No car but drew a car-related One Chance? It doesn't apply — but you must plead your case convincingly. Or else.",
      "Bank and Market cards can be resold to other players, but only between the purchase price and return price. Never above return.",
      "Insurance has no return value at end of game, but insurance from One Chance cards can be resold.",
    ],
  },
  {
    title: "Movement Rules",
    items: [
      "If a One Chance card sends you to jail and you pass Salary on the way — tough luck. No N500k for you.",
      "If your JAMB result was fake (failed 3 times), you don't collect salary when you eventually pass JAMB.",
      "Take 3 steps backwards past Salary? You collect another salary when you pass it again.",
      "You cannot waive One Chance debts owed to other players or refuse to pay — even ransom.",
    ],
  },
  {
    title: "Survival Rules",
    items: [
      "Go bankrupt from One Chance? That's Gbese. Hold the card and pay after your next salary.",
      "Bankrupt players can sell property back to the bank or auction to the highest bidder. Bids can't exceed Return value.",
      "Corruption is rampant in Nigeria — but if you're caught cheating or stealing, you're immediately disqualified. Key word: caught.",
    ],
  },
];

const gameComponents = [
  { name: "One Chance Cards", count: 32 },
  { name: "Tokens", count: 8 },
  { name: "Market Cards", count: 14 },
  { name: "Bank Cards", count: 14 },
  { name: "Board", count: 1 },
  { name: "Money Notes", count: 75 },
  { name: "Die", count: 1 },
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

/* ─── Tab definitions ─── */

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "setup", label: "Setup" },
  { id: "tiles", label: "Tiles" },
  { id: "modes", label: "Modes" },
  { id: "disputes", label: "Disputes" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ─── Component ─── */

export default function RulesContent() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [activeTile, setActiveTile] = useState(0);
  const [search, setSearch] = useState("");
  const active = tileRules[activeTile];

  const searchIndex = useMemo(() => buildSearchIndex(), []);

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.text.toLowerCase().includes(q)
    );
  }, [search, searchIndex]);

  const isSearching = searchResults !== null;

  return (
    <div className="flex flex-col w-full items-center">
      {/* Hero */}
      <div
        className="w-full flex flex-col items-center justify-center text-center"
        style={{
          background: "var(--color-yellow)",
          padding: "clamp(80px, 12vw, 140px) 24px clamp(30px, 4vw, 40px)",
        }}
      >
        <span className="font-['Barlow'] text-[14px] font-[600] uppercase tracking-[0.2em] text-neutral-600 mb-4">
          How to play
        </span>
        <h1
          className="font-['Barlow_Condensed'] font-[800] uppercase text-center"
          style={{
            fontSize: "clamp(60px, 12vw, 180px)",
            lineHeight: 0.9,
            letterSpacing: "-4px",
            color: "var(--color-dark)",
          }}
        >
          THE RULES
        </h1>
        <p
          className="font-['Barlow'] font-[600] mt-6 max-w-[480px]"
          style={{ fontSize: 20, lineHeight: 1.5, color: "var(--color-dark)" }}
        >
          Hustle. Invest. Survive Lagos.
          <br />
          The richest player wins.
        </p>
      </div>

      {/* Sticky tab bar + search */}
      <div
        className="w-full sticky top-[56px] z-40"
        style={{ background: "var(--color-yellow)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}
      >
        <div className="max-w-[1024px] mx-auto px-4 py-3">
          {/* Search */}
          <div className="relative mb-3">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(18,27,25,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rules... e.g. prison, salary, gbese"
              className="w-full font-['Barlow'] text-[14px]"
              style={{
                background: "rgba(0,0,0,0.05)",
                border: "none",
                borderRadius: 4,
                padding: "10px 12px 10px 36px",
                color: "var(--color-dark)",
                outline: "none",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent"
                style={{ color: "rgba(18,27,25,0.4)", fontSize: 18, lineHeight: 1 }}
              >
                ×
              </button>
            )}
          </div>
          {/* Tabs */}
          {!isSearching && (
            <div className="flex items-center gap-1 overflow-x-auto [-webkit-overflow-scrolling:touch]">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="font-['Barlow'] font-[600] text-[13px] uppercase tracking-[0.06em] cursor-pointer border-none shrink-0 px-4 py-2 transition-all duration-200"
                  style={{
                    background: activeTab === tab.id ? "var(--color-dark)" : "transparent",
                    color: activeTab === tab.id ? "var(--color-yellow)" : "rgba(18,27,25,0.45)",
                    borderRadius: 4,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {isSearching && (
        <div
          className="w-full"
          style={{ background: "white", padding: "clamp(40px, 6vw, 60px) 24px", minHeight: 400 }}
        >
          <div className="max-w-[1024px] mx-auto">
            <p className="font-['Barlow'] mb-6" style={{ fontSize: 14, color: "rgba(18,27,25,0.5)" }}>
              {searchResults!.length} result{searchResults!.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
            {searchResults!.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-['Barlow'] font-[600]" style={{ fontSize: 18, color: "rgba(18,27,25,0.3)" }}>
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
                    className="font-['Barlow']"
                    style={{
                      background: "rgba(0,0,0,0.03)",
                      padding: "16px 20px",
                      borderRadius: 4,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(18,27,25,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {item.section}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-dark)" }}>
                        {item.title}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(18,27,25,0.7)" }}>
                      {item.text}
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
            {activeTab === "tiles" && (
              <TilesTab activeTile={activeTile} setActiveTile={setActiveTile} active={active} />
            )}
            {activeTab === "modes" && <ModesTab />}
            {activeTab === "disputes" && <DisputesTab />}
          </motion.div>
        </AnimatePresence>
      )}

      {/* CTA */}
      <div
        className="w-full flex flex-col items-center justify-center text-center"
        style={{
          background: "var(--color-dark)",
          padding: "clamp(60px, 8vw, 100px) 24px",
        }}
      >
        <h2
          className="font-['Barlow_Condensed'] font-[800] uppercase text-white mb-3"
          style={{ fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-2px" }}
        >
          Ready to Play?
        </h2>
        <p
          className="font-['Barlow'] mb-8"
          style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 400 }}
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
      <div
        className="w-full"
        style={{ background: "var(--color-yellow)", padding: "clamp(30px, 4vw, 50px) 24px" }}
      >
        <div className="max-w-[1024px] mx-auto">
          <h2
            className="font-['Barlow_Condensed'] font-[800] uppercase mb-2"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", color: "var(--color-dark)" }}
          >
            Watch Instead
          </h2>
          <p className="font-['Barlow'] mb-6" style={{ fontSize: 14, color: "rgba(18,27,25,0.6)" }}>
            Reading is the worst way to learn a game. Watch and play along.
          </p>
          <div className="relative w-full" style={{ paddingBottom: "56.25%", borderRadius: 4, overflow: "hidden" }}>
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

      {/* Objective */}
      <div
        className="w-full"
        style={{ background: "var(--color-yellow)", padding: "clamp(30px, 4vw, 50px) 24px" }}
      >
        <div className="max-w-[1024px] mx-auto">
          <h2
            className="font-['Barlow_Condensed'] font-[800] uppercase mb-2"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", color: "var(--color-dark)" }}
          >
            The Objective
          </h2>
          <p
            className="font-['Barlow'] max-w-[600px]"
            style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(18,27,25,0.7)" }}
          >
            Use strategy and smart investments to build your wealth while dodging the chaos that faces every everyday Nigerian. When the game ends, the richest player wins.
          </p>
        </div>
      </div>

      {/* What's in the Box */}
      <div
        className="w-full"
        style={{ background: "var(--color-yellow)", padding: "clamp(30px, 4vw, 50px) 24px" }}
      >
        <div className="max-w-[1024px] mx-auto">
          <h2
            className="font-['Barlow_Condensed'] font-[800] uppercase mb-2"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", color: "var(--color-dark)" }}
          >
            What&apos;s in the Box
          </h2>
          <p className="font-['Barlow'] mb-6" style={{ fontSize: 14, color: "rgba(18,27,25,0.6)" }}>
            Everything you need to start playing.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {gameComponents.map((comp) => (
              <div
                key={comp.name}
                className="flex flex-col items-center justify-center font-['Barlow'] text-center"
                style={{ background: "rgba(0,0,0,0.05)", padding: "20px 12px", borderRadius: 4 }}
              >
                <span style={{ fontSize: 32, fontWeight: 800, color: "var(--color-dark)" }}>{comp.count}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(18,27,25,0.6)", marginTop: 4 }}>{comp.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Terms */}
      <div
        className="w-full"
        style={{ background: "var(--color-yellow)", padding: "clamp(30px, 4vw, 50px) 24px clamp(60px, 8vw, 80px)" }}
      >
        <div className="max-w-[1024px] mx-auto">
          <h2
            className="font-['Barlow_Condensed'] font-[800] uppercase mb-2"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px", color: "var(--color-dark)" }}
          >
            Know the Lingo
          </h2>
          <p className="font-['Barlow'] mb-6" style={{ fontSize: 14, color: "rgba(18,27,25,0.6)" }}>
            Key terms you&apos;ll hear during the game.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keyTerms.map((item) => (
              <div key={item.term} style={{ background: "rgba(0,0,0,0.05)", padding: "16px 20px", borderRadius: 4 }}>
                <h3 className="font-['Barlow'] font-[700]" style={{ fontSize: 16, color: "var(--color-dark)", marginBottom: 4 }}>
                  {item.term}
                </h3>
                <p className="font-['Barlow']" style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(18,27,25,0.7)" }}>
                  {item.definition}
                </p>
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
      <div className="w-full" style={{ background: "#7CB342", padding: "clamp(60px, 8vw, 100px) 24px" }}>
        <div className="max-w-[1024px] mx-auto">
          <span className="font-['Barlow'] text-[13px] font-[600] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.5)" }}>
            Before you begin
          </span>
          <h2 className="font-['Barlow_Condensed'] font-[800] uppercase mb-10 text-white" style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-2px", marginTop: 4 }}>
            Setting Up
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {setupSteps.map((step) => (
              <div key={step.number} className="flex gap-4 items-start" style={{ background: "rgba(255,255,255,0.1)", padding: "20px", borderRadius: 4 }}>
                <span className="font-['Barlow_Condensed'] font-[800] shrink-0" style={{ fontSize: 36, lineHeight: 1, color: "rgba(255,255,255,0.25)" }}>
                  {step.number}
                </span>
                <p className="font-['Barlow']" style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.9)", paddingTop: 4 }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* JAMB */}
      <div className="w-full" style={{ background: "#558B2F", padding: "clamp(60px, 8vw, 100px) 24px" }}>
        <div className="max-w-[1024px] mx-auto">
          <span className="font-['Barlow'] text-[13px] font-[600] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Your first challenge
          </span>
          <h2 className="font-['Barlow_Condensed'] font-[800] uppercase mb-3 text-white" style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-2px", marginTop: 4 }}>
            Pass JAMB First
          </h2>
          <p className="font-['Barlow'] text-white mb-8" style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.85, maxWidth: 600 }}>
            Before you can start your Lagos journey, you need to pass JAMB. Roll a 4 or higher to get in. You have 3 tries.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {jambRolls.map((j) => (
              <div key={j.roll} className="flex flex-col items-center text-center font-['Barlow']" style={{ background: "rgba(255,255,255,0.1)", padding: "28px 20px", borderRadius: 4 }}>
                <span style={{ fontSize: 36 }}>{j.icon}</span>
                <span style={{ fontWeight: 800, fontSize: 28, color: "#C5E1A5", marginTop: 8 }}>{j.roll}</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>{j.result}</span>
              </div>
            ))}
          </div>
          <div className="font-['Barlow']" style={{ background: "rgba(0,0,0,0.15)", padding: "20px 24px", borderRadius: 4, borderLeft: "4px solid #C5E1A5" }}>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
              <strong>Failed all 3 tries?</strong> Go to SALARY and collect only N100k. Life isn&apos;t fair to everyone.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Tab: Tiles ─── */

function TilesTab({
  activeTile,
  setActiveTile,
  active,
}: {
  activeTile: number;
  setActiveTile: (i: number) => void;
  active: (typeof tileRules)[number];
}) {
  return (
    <div className="w-full" style={{ background: "#1976B8", padding: "clamp(60px, 8vw, 100px) 24px" }}>
      <div className="max-w-[1024px] mx-auto">
        <span className="font-['Barlow'] text-[13px] font-[600] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.4)" }}>
          The board
        </span>
        <h2 className="font-['Barlow_Condensed'] font-[800] uppercase mb-3 text-white" style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-2px", marginTop: 4 }}>
          Every Tile Explained
        </h2>
        <p className="font-['Barlow'] mb-8" style={{ fontSize: 15, color: "rgba(255,255,255,0.6)" }}>
          Tap a tile to see what happens when you land on it.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {tileRules.map((tile, i) => (
            <button
              key={tile.title}
              onClick={() => setActiveTile(i)}
              className="font-['Barlow'] font-[600] text-[13px] uppercase tracking-[0.04em] cursor-pointer border-none transition-all duration-200"
              style={{
                background: activeTile === i ? tile.color : "rgba(255,255,255,0.1)",
                color: activeTile === i ? "#111" : "rgba(255,255,255,0.6)",
                padding: "10px 16px",
                borderRadius: 4,
              }}
            >
              {tile.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTile}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ background: "rgba(255,255,255,0.08)", padding: "32px", borderRadius: 4, borderLeft: `4px solid ${active.color}` }}
          >
            <div className="flex items-center gap-4 mb-3">
              <span style={{ fontSize: 36 }}>{active.emoji}</span>
              <div>
                <h3 className="font-['Barlow'] font-[700] uppercase" style={{ fontSize: 24, color: "white" }}>{active.title}</h3>
                <span className="font-['Barlow'] font-[600]" style={{ fontSize: 14, color: active.color }}>{active.short}</span>
              </div>
            </div>
            <p className="font-['Barlow']" style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", marginTop: 8 }}>
              {active.text}
            </p>
          </motion.div>
        </AnimatePresence>

        {activeTile === 6 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }} className="mt-6">
            <h3 className="font-['Barlow'] font-[700] uppercase text-white mb-4" style={{ fontSize: 16 }}>Fare Table</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {busStopPrices.map((item) => (
                <div key={item.destination} className="font-['Barlow'] flex flex-col" style={{ background: "rgba(255,255,255,0.1)", padding: "14px 16px", borderRadius: 4 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{item.destination}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "white" }}>{item.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Tab: Modes ─── */

function ModesTab() {
  return (
    <>
      <div className="w-full" style={{ background: "#6A1B9A", padding: "clamp(60px, 8vw, 100px) 24px" }}>
        <div className="max-w-[1024px] mx-auto">
          <span className="font-['Barlow'] text-[13px] font-[600] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Choose your style
          </span>
          <h2 className="font-['Barlow_Condensed'] font-[800] uppercase mb-10 text-white" style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-2px", marginTop: 4 }}>
            3 Ways to Play
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gameModes.map((mode) => (
              <div key={mode.title} className="flex flex-col" style={{ background: "rgba(255,255,255,0.08)", padding: "28px 24px", borderRadius: 4 }}>
                <span className="font-['Barlow'] font-[700] uppercase text-[11px] tracking-[0.1em]" style={{ color: "#CE93D8", marginBottom: 8 }}>
                  {mode.tag}
                </span>
                <h3 className="font-['Barlow'] font-[700]" style={{ fontSize: 20, color: "white", marginBottom: 4 }}>{mode.title}</h3>
                <span className="font-['Barlow']" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>{mode.subtitle}</span>
                <p className="font-['Barlow']" style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}>{mode.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* End of Game */}
      <div className="w-full" style={{ background: "#4A148C", padding: "clamp(50px, 6vw, 70px) 24px" }}>
        <div className="max-w-[1024px] mx-auto text-center">
          <h2 className="font-['Barlow_Condensed'] font-[800] uppercase mb-4 text-white" style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-1px" }}>
            Game Over
          </h2>
          <p className="font-['Barlow'] max-w-[520px] mx-auto" style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}>
            When the last One Chance card is drawn or the timer runs out, everyone counts up. Cash in hand plus return on all investments. The richest player standing wins.
          </p>
        </div>
      </div>
    </>
  );
}

/* ─── Tab: Disputes ─── */

function DisputesTab() {
  return (
    <div className="w-full" style={{ background: "#C62828", padding: "clamp(60px, 8vw, 100px) 24px" }}>
      <div className="max-w-[1024px] mx-auto">
        <span className="font-['Barlow'] text-[13px] font-[600] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.4)" }}>
          Mobile court
        </span>
        <h2 className="font-['Barlow_Condensed'] font-[800] uppercase mb-10 text-white" style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-2px", marginTop: 4 }}>
          The Fine Print
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {disputeGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-['Barlow'] font-[700] uppercase" style={{ fontSize: 14, letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
                {group.title}
              </h3>
              <div className="flex flex-col gap-3">
                {group.items.map((item, i) => (
                  <div key={i} className="font-['Barlow']" style={{ background: "rgba(255,255,255,0.08)", padding: "14px 16px", borderRadius: 4, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="font-['Barlow_Condensed'] font-[800] text-center mt-14" style={{ fontSize: "clamp(22px, 3.5vw, 32px)", color: "var(--color-yellow)" }}>
          This is One Chance, anything you see take it like that.
        </p>
      </div>
    </div>
  );
}
