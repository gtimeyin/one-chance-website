"use client";

import { useActionState } from "react";
import Image from "next/image";
import { uploadComicCover } from "@/app/actions/comics";
import type { FormState } from "@/lib/auth-definitions";

const initial: FormState = {};

interface CoverUploadFormProps {
  id: string;
  kind: "grid" | "thumbnail";
  label: string;
  helper?: string;
  currentSrc?: string;
}

export default function CoverUploadForm({
  id,
  kind,
  label,
  helper,
  currentSrc,
}: CoverUploadFormProps) {
  const [state, action, pending] = useActionState(uploadComicCover, initial);

  return (
    <form
      action={action}
      className="flex flex-col"
      style={{
        gap: 12,
        padding: 20,
        background: "white",
        border: "1px solid var(--color-border-light)",
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="kind" value={kind} />

      <div className="flex flex-col" style={{ gap: 4 }}>
        <h3
          className="font-barlow-condensed font-bold uppercase"
          style={{ fontSize: 14, letterSpacing: "0.06em", color: "var(--color-dark)" }}
        >
          {label}
        </h3>
        {helper && (
          <span className="type-caption" style={{ color: "var(--color-text-muted)" }}>
            {helper}
          </span>
        )}
      </div>

      <div
        className="relative w-full"
        style={{
          aspectRatio: kind === "grid" ? "3 / 4" : "4 / 3",
          background: "var(--color-light-bg)",
          overflow: "hidden",
          border: "1px dashed var(--color-border-light)",
        }}
      >
        {currentSrc ? (
          <Image src={currentSrc} alt="" fill sizes="480px" style={{ objectFit: "cover" }} />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="type-caption" style={{ color: "var(--color-text-muted)" }}>
              No image yet
            </span>
          </div>
        )}
      </div>

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

      <input
        type="file"
        name="file"
        accept="image/*"
        required
        className="type-body-sm"
        style={{ color: "var(--color-dark)" }}
      />

      <button
        type="submit"
        disabled={pending}
        className="font-barlow-condensed font-bold uppercase cursor-pointer border-none self-start"
        style={{
          padding: "10px 16px",
          background: pending ? "#E5E7EB" : "var(--color-yellow)",
          color: "var(--color-dark)",
          fontSize: 11,
          letterSpacing: "0.06em",
        }}
      >
        {pending ? "Uploading…" : `Upload ${label.toLowerCase()}`}
      </button>
    </form>
  );
}
