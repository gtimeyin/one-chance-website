"use client";

import { useState } from "react";

export default function CommentForm() {
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComment("");
    setName("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 16 }}>
      <p className="font-barlow font-semibold" style={{ fontSize: 16, color: "var(--color-dark)" }}>
        Share your comment
      </p>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Type your Comment..."
        className="font-barlow"
        style={{
          padding: 16,
          border: "1px solid var(--color-border-light)",
          background: "white",
          fontSize: 14,
          color: "var(--color-dark)",
          outline: "none",
          minHeight: 120,
          resize: "vertical",
        }}
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First Name"
          className="font-barlow"
          style={{
            padding: 14,
            border: "1px solid var(--color-border-light)",
            background: "white",
            fontSize: 14,
            color: "var(--color-dark)",
            outline: "none",
          }}
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="font-barlow"
          style={{
            padding: 14,
            border: "1px solid var(--color-border-light)",
            background: "white",
            fontSize: 14,
            color: "var(--color-dark)",
            outline: "none",
          }}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full font-barlow-condensed font-extrabold uppercase cursor-pointer border-none"
        style={{
          padding: 16,
          background: "var(--color-yellow)",
          color: "var(--color-dark)",
          fontSize: 16,
          letterSpacing: "0.05em",
        }}
      >
        POST COMMENT
      </button>
    </form>
  );
}
