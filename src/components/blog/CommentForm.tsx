"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

interface StoredComment {
  id: string;
  name: string;
  text: string;
  /** ISO timestamp */
  date: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const inputStyle: React.CSSProperties = {
  padding: 14,
  border: "1px solid var(--color-border-light)",
  background: "white",
  fontSize: 16,
  color: "var(--color-dark)",
  outline: "none",
};

export default function CommentForm({ postSlug }: { postSlug: string }) {
  const { isAuth, firstName } = useAuth();
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState<StoredComment[]>([]);

  const storageKey = `oc:comments:${postSlug}`;

  // Hydrate from localStorage after mount — it isn't available during SSR, so
  // a lazy initial state would run on the server and throw.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from persisted storage
        setComments(JSON.parse(raw) as StoredComment[]);
      }
    } catch {
      /* corrupt or unavailable storage — start empty */
    }
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const author = isAuth && firstName ? firstName : name.trim();
    const text = comment.trim();
    if (!text || !author) return;

    const next: StoredComment[] = [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: author, text, date: new Date().toISOString() },
      ...comments,
    ];
    // Update in real time, then persist.
    setComments(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* storage unavailable — comment still shows for this session */
    }

    setComment("");
    setName("");
    setEmail("");
  };

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      {/* Posted comments */}
      {comments.length > 0 && (
        <div className="flex flex-col" style={{ gap: 16 }}>
          <p className="font-barlow-condensed font-semibold uppercase" style={{ fontSize: 15, color: "var(--color-dark)", letterSpacing: "0.04em" }}>
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </p>
          {comments.map((c) => (
            <div key={c.id} className="flex" style={{ gap: 12 }}>
              <span
                className="shrink-0 flex items-center justify-center font-barlow-condensed font-bold uppercase"
                style={{ width: 40, height: 40, background: "var(--color-yellow)", color: "var(--color-dark)", fontSize: 16 }}
              >
                {c.name.charAt(0)}
              </span>
              <div className="flex flex-col" style={{ gap: 2 }}>
                <div className="flex items-baseline" style={{ gap: 8 }}>
                  <span className="font-barlow-condensed font-bold" style={{ fontSize: 15, color: "var(--color-dark)" }}>
                    {c.name}
                  </span>
                  <span className="font-barlow-condensed" style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                    {formatDate(c.date)}
                  </span>
                </div>
                <p className="font-barlow-body" style={{ fontSize: 15, color: "var(--color-dark)", lineHeight: 1.5 }}>
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 16 }}>
        <p className="font-barlow-condensed font-semibold" style={{ fontSize: 16, color: "var(--color-dark)" }}>
          {isAuth && firstName ? `Commenting as ${firstName}` : "Share your comment"}
        </p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Type your Comment..."
          className="font-barlow-condensed"
          style={{ ...inputStyle, padding: 16, minHeight: 120, resize: "vertical" }}
          required
        />
        {/* Signed-out visitors identify themselves; signed-in users are known already. */}
        {!isAuth && (
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First Name"
              className="font-barlow-condensed"
              style={inputStyle}
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="font-barlow-condensed"
              style={inputStyle}
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full font-barlow-condensed font-extrabold uppercase cursor-pointer border-none"
          style={{ padding: 16, background: "var(--color-yellow)", color: "var(--color-dark)", fontSize: 16, letterSpacing: "0.05em" }}
        >
          POST COMMENT
        </button>
      </form>
    </div>
  );
}
