"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherArrowRight } from "@subframe/core";

const discoverLinks = [
  { label: "About Us", href: "/about" },
  { label: "Community", href: "#" },
  { label: "Our Blog", href: "/updates" },
  { label: "#Ask Olopa", href: "#" },
];

const socialLinks = [
  { label: "Twitter (X)", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Tiktok", href: "#" },
];

export default function FooterShop() {
  const [email, setEmail] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="flex w-full flex-col items-center bg-yellow-500 px-6 py-16 mobile:px-4 mobile:py-12">
      <div className="flex w-full max-w-[1280px] flex-col items-start gap-12 relative">
        <div className="flex w-full flex-col items-start gap-8">
          {/* Hero CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex w-full flex-col items-start gap-8 border-b border-solid border-neutral-500 pt-10 pb-20"
          >
            <div className="flex w-full max-w-[576px] flex-col items-start gap-8">
              <span className="whitespace-pre-wrap font-['Barlow_Condensed'] text-[64px] font-[700] leading-[68px] text-default-font -tracking-[0.02em] uppercase mobile:text-[40px] mobile:leading-[44px]">
                {"The streets are waiting. See if you can make it in Lagos."}
              </span>
              <Button
                variant="white"
                size="medium"
                onClick={() => { window.location.href = "/shop"; }}
              >
                BUY A GAME NOW!
              </Button>
            </div>
          </motion.div>

          {/* Links + Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex w-full items-start gap-8 py-12 mobile:flex-col mobile:flex-nowrap mobile:gap-8"
          >
            {/* Discover */}
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 pt-4">
              <span className="font-['Barlow_Condensed'] text-[14px] font-[400] leading-[20px] text-neutral-900 tracking-[0.3em] uppercase">
                Discover
              </span>
              <div className="flex flex-col items-start gap-4">
                {discoverLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-['Barlow_Condensed'] text-large-body-default font-large-body-default text-neutral-800 uppercase no-underline hover:text-neutral-950 transition-colors duration-200"
                    style={{ textDecoration: "none" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Follow Us */}
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 pt-4">
              <span className="font-['Barlow_Condensed'] text-[14px] font-[400] leading-[20px] text-neutral-900 tracking-[0.3em] uppercase">
                Follow Us
              </span>
              <div className="flex flex-col items-start gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-['Barlow_Condensed'] text-large-body-default font-large-body-default text-neutral-800 uppercase no-underline hover:text-neutral-950 transition-colors duration-200"
                    style={{ textDecoration: "none" }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col items-start gap-8 pt-4">
              <div className="flex flex-col items-start gap-4">
                <span className="font-['Barlow_Condensed'] text-[40px] font-[700] leading-[48px] text-default-font -tracking-[0.01em] mobile:text-[28px] mobile:leading-[34px]">
                  JOIN OUR COMMUNITY
                </span>
                <span className="max-w-[384px] text-body-default font-body-default text-neutral-700">
                  Subscribe to our newsletter for exclusive updates, new releases, and special offers.
                </span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmail("");
                }}
                className="flex w-full max-w-[384px] items-center gap-2"
              >
                <div className="flex grow shrink-0 basis-0 items-center border border-solid border-default-font px-4 py-3">
                  <input
                    className="grow shrink-0 basis-0 text-body font-body text-default-font outline-none bg-transparent placeholder:text-neutral-500"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <IconButton
                  className="h-12 w-12 flex-none"
                  variant="neutral-primary"
                  size="large"
                  icon={<FeatherArrowRight />}
                  onClick={() => {}}
                />
              </form>
              <div className="flex w-full items-end justify-end pt-4">
                <span className="text-caption font-caption text-neutral-500">
                  DESIGNED BY NK
                </span>
              </div>
            </div>
          </motion.div>

          {/* Copyright */}
          <span className="text-body font-body text-default-font">
            2026 © DIVISIONS AFRICA. ALL RIGHTS RESERVED
          </span>
        </div>
      </div>
    </footer>
  );
}
