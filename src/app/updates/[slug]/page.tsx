"use client";

import { useParams } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import BlogCard from "@/components/ui/BlogCard";
import CommentForm from "@/components/blog/CommentForm";
import NewsletterForm from "@/components/ui/NewsletterForm";
import FooterShop from "@/components/layout/FooterShop";
import SmoothScroll from "@/components/SmoothScroll";
import { getBlogPost, getRelatedPosts, blogPosts } from "@/lib/blog";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getBlogPost(slug);
  const relatedPosts = getRelatedPosts(slug);
  const relatedRef = useRef(null);
  const relatedInView = useInView(relatedRef, { once: true, margin: "-50px" });

  if (!post) {
    // Fallback to first post for demo
    const fallbackPost = blogPosts[0];
    return <BlogContent post={fallbackPost} relatedPosts={blogPosts.slice(1)} relatedRef={relatedRef} relatedInView={relatedInView} />;
  }

  return <BlogContent post={post} relatedPosts={relatedPosts} relatedRef={relatedRef} relatedInView={relatedInView} />;
}

function BlogContent({
  post,
  relatedPosts,
  relatedRef,
  relatedInView,
}: {
  post: NonNullable<ReturnType<typeof getBlogPost>>;
  relatedPosts: ReturnType<typeof getRelatedPosts>;
  relatedRef: React.RefObject<HTMLElement | null>;
  relatedInView: boolean;
}) {
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
              { label: "Update", href: "/updates" },
              { label: "Blog" },
            ]}
          />
        </div>

        <article style={{ padding: "0 clamp(20px, 4vw, 60px)" }}>
          <div className="mx-auto" style={{ maxWidth: 900 }}>
            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full"
              style={{
                aspectRatio: "16/9",
                background: "var(--color-light-bg)",
                overflow: "hidden",
                marginBottom: 0,
              }}
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </motion.div>

            {/* Metadata bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
              style={{
                padding: "16px 24px",
                background: "var(--color-yellow)",
                gap: 8,
              }}
            >
              <p className="font-barlow" style={{ fontSize: 12, color: "var(--color-dark)" }}>
                ONE CHANCE BLOG &bull; {post.date} &bull; {post.readTime}
              </p>
              <div className="flex items-center gap-2">
                <p className="font-barlow" style={{ fontSize: 12, color: "var(--color-dark)" }}>
                  By {post.author.name}
                </p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-dark)" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-barlow-condensed font-extrabold uppercase"
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                color: "var(--color-dark)",
                letterSpacing: "-2px",
                lineHeight: 1,
                marginTop: 32,
                marginBottom: 32,
              }}
            >
              {post.title}
            </motion.h1>

            {/* Article content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-barlow"
              style={{
                fontSize: 15,
                color: "var(--color-text-muted)",
                lineHeight: 1.8,
                marginBottom: 40,
              }}
            >
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{ columnCount: 2, columnGap: 40 }}
              />
            </motion.div>

            {/* Share + Next */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "20px 0",
                borderTop: "1px solid var(--color-border-light)",
                borderBottom: "1px solid var(--color-border-light)",
                marginBottom: 40,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-barlow font-semibold" style={{ fontSize: 13, color: "var(--color-dark)" }}>
                  Can&apos;t stop gisting? Share the fun
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-dark)" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
              <Link
                href="/updates"
                className="font-barlow-condensed font-extrabold uppercase no-underline flex items-center gap-1"
                style={{
                  fontSize: 14,
                  color: "var(--color-dark)",
                  letterSpacing: "0.02em",
                  textDecoration: "none",
                }}
              >
                NEXT BLOG
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            </div>

            {/* Comment section */}
            <div style={{ marginBottom: 60 }}>
              <p className="font-barlow" style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 16 }}>
                Great read?
              </p>
              <CommentForm />
            </div>
          </div>
        </article>

        {/* Related Blog */}
        <section
          ref={relatedRef}
          style={{
            padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px)",
            borderTop: "1px solid var(--color-border-light)",
          }}
        >
          <div className="mx-auto" style={{ maxWidth: 1280 }}>
            <div className="flex items-end justify-between" style={{ marginBottom: 32 }}>
              <h2
                className="font-barlow-condensed font-extrabold uppercase"
                style={{
                  fontSize: "clamp(32px, 5vw, 56px)",
                  color: "var(--color-dark)",
                  letterSpacing: "-2px",
                  lineHeight: 0.95,
                }}
              >
                RELATED<br />BLOG
              </h2>
              <Link
                href="/updates"
                className="font-barlow font-bold uppercase no-underline flex items-center gap-1 shrink-0"
                style={{ fontSize: 12, color: "var(--color-dark)", textDecoration: "none" }}
              >
                VIEW ALL BLOG
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(16px, 3vw, 32px)" }}>
              {relatedPosts.map((p, i) => (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                >
                  <BlogCard post={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
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
