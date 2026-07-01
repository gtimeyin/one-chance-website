"use client";

import { useActionState } from "react";
import { createComic } from "@/app/actions/comics";
import type { FormState } from "@/lib/auth-definitions";

const initial: FormState = {};

export default function NewComicForm() {
  const [state, action, pending] = useActionState(createComic, initial);

  return (
    <form
      action={action}
      className="flex flex-col"
      style={{
        gap: 12,
        padding: 20,
        background: "var(--color-light-bg)",
        border: "1px solid var(--color-border-light)",
      }}
    >
      <h2
        className="font-barlow-condensed font-bold uppercase"
        style={{ fontSize: 16, letterSpacing: "0.06em", color: "var(--color-dark)" }}
      >
        Create a new comic
      </h2>

      {state.message && (
        <p
          className="type-body-sm"
          style={{
            padding: "8px 12px",
            background: state.success ? "#E6F4EA" : "#FEE2E2",
            color: state.success ? "#1B5E20" : "#991B1B",
          }}
        >
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 12 }}>
        <Field name="title" label="Title" placeholder="One Chance Ep. 1" error={state.errors?.title?.[0]} required />
        <Field name="episode" label="Episode label" placeholder="EP 1 - Road to Riches" />
      </div>
      <Field
        name="slug"
        label="Slug"
        placeholder="ep-1-road-to-riches"
        error={state.errors?.slug?.[0]}
        helper="Used in the URL (/comics/<slug>). Lowercase, hyphens only."
        required
      />
      <Field name="subtitle" label="Subtitle" placeholder="Optional short tagline" />

      <button
        type="submit"
        disabled={pending}
        className="font-barlow-condensed font-bold uppercase cursor-pointer border-none self-start"
        style={{
          padding: "12px 20px",
          background: pending ? "#E5E7EB" : "var(--color-yellow)",
          color: "var(--color-dark)",
          fontSize: 12,
          letterSpacing: "0.06em",
          marginTop: 8,
        }}
      >
        {pending ? "Creating…" : "Create comic"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  helper,
  error,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 4 }}>
      <label htmlFor={name} className="type-body-sm" style={{ fontWeight: 600, color: "var(--color-dark)" }}>
        {label}
        {required && " *"}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        required={required}
        className="font-barlow-body"
        style={{
          padding: "10px 12px",
          border: `1px solid ${error ? "#FCA5A5" : "var(--color-border-light)"}`,
          background: "white",
          fontSize: 16,
          color: "var(--color-dark)",
        }}
      />
      {helper && !error && (
        <span className="type-caption" style={{ color: "var(--color-text-muted)" }}>
          {helper}
        </span>
      )}
      {error && (
        <span className="type-caption" style={{ color: "#B91C1C" }}>
          {error}
        </span>
      )}
    </div>
  );
}
