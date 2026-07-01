"use client";

import { useActionState, useEffect, useState } from "react";
import { submitProductReview } from "@/app/actions/reviews";
import type { FormState } from "@/lib/auth-definitions";

const initialState: FormState = {};

interface WriteReviewFormProps {
  productId: number;
  productName: string;
  onClose: () => void;
}

export default function WriteReviewForm({
  productId,
  productName,
  onClose,
}: WriteReviewFormProps) {
  const [state, formAction, pending] = useActionState(submitProductReview, initialState);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (state.success) {
      const t = setTimeout(onClose, 1800);
      return () => clearTimeout(t);
    }
  }, [state.success, onClose]);

  const display = hoverRating || rating;

  return (
    <div
      className="flex flex-col w-full"
      style={{
        padding: 28,
        gap: 20,
        border: "1px solid var(--color-border-light)",
        background: "white",
      }}
    >
      <div className="flex items-start justify-between" style={{ gap: 16 }}>
        <div>
          <h3
            className="font-barlow-condensed font-extrabold uppercase"
            style={{ fontSize: 24, color: "var(--color-dark)", lineHeight: 1.1 }}
          >
            Write a Review
          </h3>
          <p
            className="font-barlow-body"
            style={{ fontSize: 16, color: "var(--color-text-muted)", marginTop: 4 }}
          >
            Share your thoughts on {productName}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close review form"
          className="bg-transparent border-none cursor-pointer"
          style={{ color: "var(--color-text-muted)", padding: 4 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {state.message && (
        <div
          className="font-barlow-body"
          style={{
            fontSize: 16,
            padding: "10px 14px",
            background: state.success ? "#E6F4EA" : "#FEE2E2",
            color: state.success ? "#1B5E20" : "#991B1B",
            border: `1px solid ${state.success ? "#A5D6A7" : "#FCA5A5"}`,
            borderRadius: 4,
          }}
        >
          {state.message}
        </div>
      )}

      {!state.success && (
        <form action={formAction} className="flex flex-col" style={{ gap: 16 }}>
          <input type="hidden" name="productId" value={productId} />
          {/* honeypot — kept off-screen, not display:none (some bots skip hidden fields) */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-10000px", width: 1, height: 1 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
            <Field
              label="Name"
              name="name"
              placeholder="Your name"
              error={state.errors?.name?.[0]}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              helper="Won't be published"
              error={state.errors?.email?.[0]}
              required
            />
          </div>

          <div className="flex flex-col" style={{ gap: 6 }}>
            <label className="font-barlow-condensed font-medium" style={{ fontSize: 15, color: "var(--color-dark)" }}>
              Rating
            </label>
            <div className="flex items-center" style={{ gap: 6 }}>
              {Array.from({ length: 5 }).map((_, i) => {
                const n = i + 1;
                const filled = n <= display;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    className="bg-transparent border-none cursor-pointer p-0"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "#FCCD21" : "none"} stroke={filled ? "#FCCD21" : "#CFD1D0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="rating" value={rating} />
            {state.errors?.rating?.[0] && (
              <span className="font-barlow-body" style={{ fontSize: 15, color: "#B91C1C" }}>
                {state.errors.rating[0]}
              </span>
            )}
          </div>

          <div className="flex flex-col" style={{ gap: 6 }}>
            <label htmlFor="review" className="font-barlow-condensed font-medium" style={{ fontSize: 15, color: "var(--color-dark)" }}>
              Review
            </label>
            <textarea
              id="review"
              name="review"
              rows={5}
              placeholder="Tell us what you thought…"
              className="font-barlow-body"
              style={{
                padding: "10px 12px",
                border: `1px solid ${state.errors?.review ? "#FCA5A5" : "var(--color-border-light)"}`,
                borderRadius: 4,
                fontSize: 16,
                color: "var(--color-dark)",
                resize: "vertical",
              }}
              required
              minLength={10}
              maxLength={2000}
            />
            {state.errors?.review?.[0] && (
              <span className="font-barlow-body" style={{ fontSize: 15, color: "#B91C1C" }}>
                {state.errors.review[0]}
              </span>
            )}
          </div>

          <div className="flex items-center" style={{ gap: 12, marginTop: 4 }}>
            <button
              type="submit"
              disabled={pending}
              className="font-barlow-condensed font-bold uppercase cursor-pointer border-none"
              style={{
                padding: "14px 24px",
                background: pending ? "#E5E7EB" : "#FFD600",
                color: "var(--color-dark)",
                fontSize: 16,
                letterSpacing: "0.05em",
              }}
            >
              {pending ? "Submitting…" : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="font-barlow-condensed font-bold uppercase cursor-pointer"
              style={{
                padding: "14px 24px",
                background: "white",
                color: "var(--color-dark)",
                border: "1px solid var(--color-dark)",
                fontSize: 16,
                letterSpacing: "0.05em",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
}

function Field({ label, name, type = "text", placeholder, helper, error, required }: FieldProps) {
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      <label htmlFor={name} className="font-barlow-condensed font-medium" style={{ fontSize: 15, color: "var(--color-dark)" }}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="font-barlow-body"
        style={{
          padding: "10px 12px",
          border: `1px solid ${error ? "#FCA5A5" : "var(--color-border-light)"}`,
          borderRadius: 4,
          fontSize: 16,
          color: "var(--color-dark)",
        }}
      />
      {helper && !error && (
        <span className="font-barlow-body" style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
          {helper}
        </span>
      )}
      {error && (
        <span className="font-barlow-body" style={{ fontSize: 15, color: "#B91C1C" }}>
          {error}
        </span>
      )}
    </div>
  );
}
