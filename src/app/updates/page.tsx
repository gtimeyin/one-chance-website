"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import BlogCard from "@/components/ui/BlogCard";
import ComicCard from "@/components/ui/ComicCard";
import AnnouncementCard from "@/components/ui/AnnouncementCard";
import NewsletterForm from "@/components/ui/NewsletterForm";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import { blogPosts, comics, announcements } from "@/lib/blog";
import Link from "next/link";

function SectionHeader({
  subtitle,
  title,
  linkLabel,
  linkHref,
}: {
  subtitle?: string;
  title: string;
  linkLabel: string;
  linkHref: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex items-end justify-between"
      style={{ marginBottom: 32 }}
    >
      <div>
        {subtitle && (
          <p className="font-barlow" style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 4 }}>
            {subtitle}
          </p>
        )}
        <h2
          className="font-barlow-condensed font-extrabold uppercase"
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            color: "var(--color-dark)",
            letterSpacing: "-2px",
            lineHeight: 0.95,
          }}
        >
          {title}
        </h2>
      </div>
      <Link
        href={linkHref}
        className="font-barlow font-bold uppercase no-underline flex items-center gap-1 shrink-0"
        style={{
          fontSize: 12,
          color: "var(--color-dark)",
          letterSpacing: "0.05em",
          textDecoration: "none",
        }}
      >
        {linkLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </Link>
    </motion.div>
  );
}

export default function UpdatesPage() {
  const blogRef = useRef(null);
  const blogInView = useInView(blogRef, { once: true, margin: "-50px" });
  const comicsRef = useRef(null);
  const comicsInView = useInView(comicsRef, { once: true, margin: "-50px" });
  const announcementsRef = useRef(null);
  const announcementsInView = useInView(announcementsRef, { once: true, margin: "-50px" });

  return (
    <div className="flex flex-col w-full" style={{ background: "white" }}>
      <SmoothScroll />
      <Navbar />
      <div style={{ paddingTop: 56 }}>
        {/* Breadcrumb */}
        <div style={{ padding: "0 clamp(20px, 4vw, 60px)" }}>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Update" },
            ]}
          />
        </div>

        {/* Blog Section */}
        <section
          ref={blogRef}
          style={{
            padding: "clamp(20px, 4vw, 40px) clamp(20px, 4vw, 60px) clamp(40px, 6vw, 80px)",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 1280 }}>
            <SectionHeader
              subtitle="Latest Gist"
              title="FROM OUR BLOG"
              linkLabel="VIEW ALL BLOG"
              linkHref="/updates"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(16px, 3vw, 32px)" }}>
              {blogPosts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={blogInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comics Section */}
        <section
          ref={comicsRef}
          style={{
            padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)",
            borderTop: "1px solid var(--color-border-light)",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 1280 }}>
            <SectionHeader
              title="COMICS"
              linkLabel="VIEW ALL COMICS"
              linkHref="/updates"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(16px, 3vw, 32px)" }}>
              {comics.map((comic, i) => (
                <motion.div
                  key={comic.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={comicsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                >
                  <ComicCard comic={comic} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        <section
          ref={announcementsRef}
          style={{
            padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)",
            borderTop: "1px solid var(--color-border-light)",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 1280 }}>
            <SectionHeader
              title="ANNOUNCEMENT"
              linkLabel="VIEW ALL ANNOUNCEMENT"
              linkHref="/updates"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(16px, 3vw, 32px)" }}>
              {announcements.map((announcement, i) => (
                <motion.div
                  key={announcement.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={announcementsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                >
                  <AnnouncementCard announcement={announcement} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section
          style={{
            padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)",
            borderTop: "1px solid var(--color-border-light)",
          }}
        >
          <div
            className="mx-auto flex flex-col md:flex-row items-start md:items-center justify-between"
            style={{ maxWidth: 1280, gap: 32 }}
          >
            <h2
              className="font-barlow-condensed font-extrabold uppercase"
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                color: "var(--color-dark)",
                letterSpacing: "-2px",
                lineHeight: 0.95,
              }}
            >
              DON&apos;T MISS AN<br />UPDATE
            </h2>
            <div>
              <p className="font-barlow" style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 12 }}>
                Subscribe to our newsletter
              </p>
              <NewsletterForm variant="light" />
            </div>
          </div>
        </section>
      </div>
      <FooterShop />
    </div>
  );
}
