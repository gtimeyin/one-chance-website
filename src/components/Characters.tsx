"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Char } from "@/ui/components/Char";

const characters = [
  { name: "The Mama", realName: "Iya Bose", color: "#A0CA3A", image: "/images/char-mama.png", description: ["An astute business woman, storyteller and gist lover. Iya Bose started out owning a small shop in the market which her husband helped setup to keep her busy, however she did so well that she now owns blocks in the market. She is also a landlady with plenty tenants.", "Iya Bose's children are all studying and residents in Canada and she doesn't miss any opportunity to talk about her first son who is a first class graduate."] },
  { name: "The Bank Manager", realName: "Madam", color: "#7A51A0", image: "/images/char-business-woman.png", description: ["A true career woman, driven and hardworking. After graduating with a degree in biochemistry from a private university, Madam knew she wanted a career job where she could apply herself and rise up the ladder quickly. She luckily got a job in a bank immediately after NYSC and hasn't looked back since, she is now the branch manager.", "Her career doesn't stop her from letting down her hair and enjoying herself. She also has a side hustle, selling hair."] },
  { name: "The Hustler", realName: "Obi", color: "#FBAC43", image: "/images/char-worker.png", description: ["Intelligent, hard working and a very opportunistic hustler. Obi lost both his parents at a very young age and was forced to survive on his own. He put himself through school and graduated with a second class degree.", "He's now out of school and is currently unemployed, he continues to hustle and do everything to make money and ends meet, sometimes he spends his off days going to offices and dropping copies of his CV with the receptionist."] },
  { name: "The Millionaire", realName: "Femi", color: "#4CC5FF", image: "/images/char-big-man.png", description: ["Quiet, reserved, very hard working but not humble. He was born into a middle class family however not so much is known about Femi — all we know is that about 4 years ago Femi was broke and on the street hustling to make ends meet, then one fateful day everything changed.", "A chance encounter changed his life, he is now a rich multi-millionaire with plenty houses, cars and women."] },
  { name: "The Slay Queen", realName: "Chioma", color: "#C73367", image: "/images/char-slay-queen.png", description: ["A university dropout who chose to pursue her \"passion for fashion\" — at least that's what she says, her grades didn't really help either. However Chioma was able to become a big celebrity by becoming friends with all the popular celebrities, she attributes her success to positive affirmations, her zodiac signs and manifestation.", "She is always dressed in the latest fashion and has her own clothing line on Allen Avenue."] },
  { name: "The Influencer, Gen Z", realName: "Precious", color: "#F37C76", image: "/images/char-laughing-girl.png", description: ["A \"happy child\" from a middle class home. She gets along with everyone and is always happy. She shares so much of her life on social media where she has thousands of followers. She is also very intelligent and every teacher's star student because she gets all A's.", "She's an influencer, very proud Nigerian, a Gen Z but millennial at heart. She loves alté and is always seen pressing phone despite her mother's many queries."] },
  { name: "The Area Boy", realName: "2 Bobo", color: "#D03B3F", image: "/images/char-area-boy.png", description: ["2 Bobo spent his whole life in Ojuelegba and didn't have any formal education. Feared and respected on the streets of Ojuelegba because they know his story. He started recording music a few years ago and one of his songs \"Zankuli Kuli\" became a national hit.", "He is now a full time musician and entertainer who has millions of fans and tours Nigeria. He has not forgotten his Ojuelegba roots."] },
  { name: "Ijoba, Retired Politician", realName: "Chief", color: "#A5B2BA", image: "/images/char-chief.png", description: ["Chief just celebrated his 69th birthday however we all think he is at least 80. He was a sitting governor and senator in the 80's–90's. As a politician, Chief was able to use his intelligence, cunning and no nonsense approach to rise to the very top.", "He spends his days handpicking kings, governors and senators — they call him the King Maker. Rumour has it that he wants to run for president, nobody knows why."] },
];

export default function Characters() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="meetthelagosians"
      ref={ref}
      className="flex w-full flex-col items-center justify-center bg-white"
      style={{ padding: "clamp(60px, 8vw, 128px) 24px" }}
    >
      <div className="flex w-full max-w-[1280px] flex-col items-center">
        {/* Overline — character name on hover */}
        <div style={{ height: 32 }}>
          <AnimatePresence mode="wait">
            {hoveredIndex !== null && (
              <motion.span
                key={characters[hoveredIndex].name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="font-['Barlow'] text-[16px] font-[600] uppercase tracking-[0.15em] text-neutral-500 text-center block"
              >
                {characters[hoveredIndex].realName} — {characters[hoveredIndex].name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Giant title */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full font-['Barlow_Condensed'] text-[200px] font-[800] leading-[145px] text-neutral-800 text-center uppercase -tracking-[8px] mobile:text-[60px] mobile:leading-[58px] mobile:-tracking-[2px]"
        >
          {hoveredIndex !== null
            ? <>MEET <span style={{ color: characters[hoveredIndex].color }}>{characters[hoveredIndex].realName.toUpperCase()}</span></>
            : "MEET THE LAGOSIANS"}
        </motion.span>

        {/* Character row */}
        <div
          className="flex h-[420px] w-full max-w-[1024px] flex-none items-end gap-3 overflow-x-auto px-4 pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable] mt-[20px] md:h-[625px] md:gap-8 md:overflow-visible md:px-0 md:pb-0"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {characters.map((char, i) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, y: 40 }}
              animate={
                isInView
                  ? {
                      opacity:
                        hoveredIndex === null || hoveredIndex === i ? 1 : 0.15,
                      y: 0,
                    }
                  : { opacity: 0, y: 40 }
              }
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 200,
                delay: isInView && hoveredIndex === null ? 0.1 + i * 0.08 : 0,
              }}
              className="relative h-auto w-[min(28vw,140px)] shrink-0 self-stretch md:w-auto md:grow md:basis-0 overflow-visible"
              onMouseEnter={() => setHoveredIndex(i)}
            >
              <motion.div
                animate={{ scale: hoveredIndex === i ? 1.5 : 1 }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                className="h-full w-full pointer-events-none"
                style={{ transformOrigin: "bottom center" }}
              >
                <Char
                  className="h-full w-full"
                  image={char.image}
                />
              </motion.div>

              {/* Popover description */}
              <AnimatePresence>
                {hoveredIndex === i && char.description && (
                  <motion.div
                    initial={{ opacity: 0, x: i < characters.length / 2 ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: i < characters.length / 2 ? 10 : -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute pointer-events-none"
                    style={{
                      bottom: 72,
                      [i < characters.length / 2 ? "left" : "right"]: "100%",
                      width: 405,
                      marginLeft: i < characters.length / 2 ? 48 : 0,
                      marginRight: i < characters.length / 2 ? 0 : 48,
                      zIndex: 20,
                    }}
                  >
                    <div
                      className="relative font-large-body-bold text-neutral-700 text-[14px] leading-[1.7]"
                      style={{
                        background: "white",
                        padding: "16px 20px",
                        borderRadius: 4,
                        boxShadow: "0px 8px 30px rgba(0,0,0,0.12), 0px 2px 10px rgba(0,0,0,0.05)",
                      }}
                    >
                      {/* Triangle pointer */}
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          transform: "translateY(-50%)",
                          [i < characters.length / 2 ? "left" : "right"]: -8,
                          width: 0,
                          height: 0,
                          borderTop: "8px solid transparent",
                          borderBottom: "8px solid transparent",
                          [i < characters.length / 2 ? "borderRight" : "borderLeft"]: "8px solid white",
                        }}
                      />
                      <span className="font-[700] text-[15px]" style={{ color: char.color }}>
                        {char.realName}
                      </span>
                      <span className="text-neutral-400 text-[12px] uppercase tracking-[0.08em] ml-2">
                        {char.name}
                      </span>
                      {Array.isArray(char.description)
                        ? char.description.map((para, pi) => (
                            <p key={pi} style={{ margin: pi === 0 ? "12px 0 0" : "10px 0 0", lineHeight: 1.7 }}>{para}</p>
                          ))
                        : <p style={{ margin: "12px 0 0", lineHeight: 1.7 }}>{char.description}</p>
                      }
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Subtitle */}
        <div className="flex flex-col items-center py-6">
          <span className="text-button-small font-button-small text-subtext-color text-center">
            hover on the characters to see what they&apos;re about
          </span>
        </div>
      </div>
    </section>
  );
}
