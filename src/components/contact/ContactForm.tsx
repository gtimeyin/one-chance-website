"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/ui/components/Button";
import {
  FeatherInstagram,
  FeatherFacebook,
  FeatherLinkedin,
  FeatherTwitter,
  FeatherYoutube,
} from "@subframe/core";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ fullName: "", email: "", phone: "", message: "" });
  };

  return (
    <section
      ref={ref}
      className="w-full"
      style={{
        padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 40px)",
      }}
    >
      <div
        className="mx-auto flex flex-col md:flex-row items-start"
        style={{ maxWidth: 1280, gap: "clamp(32px, 4vw, 64px)" }}
      >
        {/* Left: Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
          style={{ flex: "0 0 auto", maxWidth: 300, gap: 32 }}
        >
          <p
            className="font-barlow"
            style={{
              fontSize: 18,
              lineHeight: "28px",
              color: "#121B19",
            }}
          >
            For any enquiries, or just
            to say hello, get in touch
            and contact us.
          </p>

          <div className="flex flex-col" style={{ gap: 24 }}>
            <div>
              <p
                className="font-barlow font-bold"
                style={{ fontSize: 14, color: "#121B19", marginBottom: 4 }}
              >
                Email Address
              </p>
              <p
                className="font-barlow"
                style={{ fontSize: 14, color: "rgba(18, 27, 25, 0.6)" }}
              >
                info@onechancegame.com
              </p>
            </div>

            <div>
              <p
                className="font-barlow font-bold"
                style={{ fontSize: 14, color: "#121B19", marginBottom: 4 }}
              >
                Careers &amp; Internship
              </p>
              <p
                className="font-barlow"
                style={{ fontSize: 14, color: "rgba(18, 27, 25, 0.6)" }}
              >
                careers@onechancegame.com
              </p>
            </div>

            <div>
              <p
                className="font-barlow font-bold"
                style={{ fontSize: 14, color: "#121B19", marginBottom: 4 }}
              >
                Phone Number
              </p>
              <p
                className="font-barlow"
                style={{ fontSize: 14, color: "rgba(18, 27, 25, 0.6)" }}
              >
                +234 903 111 4455
              </p>
            </div>
          </div>

          <div>
            <p
              className="font-barlow font-bold"
              style={{ fontSize: 14, color: "#121B19", marginBottom: 12 }}
            >
              Follow us
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Instagram">
                <FeatherInstagram style={{ width: 20, height: 20, color: "#121B19" }} />
              </a>
              <a href="#" aria-label="Facebook">
                <FeatherFacebook style={{ width: 20, height: 20, color: "#121B19" }} />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FeatherLinkedin style={{ width: 20, height: 20, color: "#121B19" }} />
              </a>
              <a href="#" aria-label="Twitter">
                <FeatherTwitter style={{ width: 20, height: 20, color: "#121B19" }} />
              </a>
              <a href="#" aria-label="YouTube">
                <FeatherYoutube style={{ width: 20, height: 20, color: "#121B19" }} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col w-full"
          style={{ gap: 20 }}
        >
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Full Name"
            className="w-full font-barlow"
            style={{
              padding: "16px 20px",
              fontSize: 16,
              color: "#121B19",
              border: "1px solid rgba(18, 27, 25, 0.15)",
              background: "transparent",
              outline: "none",
            }}
            required
          />

          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email Address"
            className="w-full font-barlow"
            style={{
              padding: "16px 20px",
              fontSize: 16,
              color: "#121B19",
              border: "1px solid rgba(18, 27, 25, 0.15)",
              background: "transparent",
              outline: "none",
            }}
            required
          />

          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone Number"
            className="w-full font-barlow"
            style={{
              padding: "16px 20px",
              fontSize: 16,
              color: "#121B19",
              border: "1px solid rgba(18, 27, 25, 0.15)",
              background: "transparent",
              outline: "none",
            }}
          />

          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Type message..."
            className="w-full font-barlow"
            rows={6}
            style={{
              padding: "16px 20px",
              fontSize: 16,
              color: "#121B19",
              border: "1px solid rgba(18, 27, 25, 0.15)",
              background: "transparent",
              outline: "none",
              resize: "vertical",
            }}
            required
          />

          <Button
            variant="brand-primary"
            size="medium"
            type="submit"
            className="w-full"
          >
            SEND MESSAGE
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
