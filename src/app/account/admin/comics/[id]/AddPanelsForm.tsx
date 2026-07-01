"use client";

import { useActionState } from "react";
import { addPanelsAction } from "@/app/actions/comics";
import type { FormState } from "@/lib/auth-definitions";

const initial: FormState = {};

export default function AddPanelsForm({ comicId }: { comicId: string }) {
  const [state, action, pending] = useActionState(addPanelsAction, initial);

  return (
    <form
      action={action}
      className="flex flex-col"
      style={{
        gap: 8,
        padding: 16,
        background: "var(--color-light-bg)",
        border: "1px dashed var(--color-border-light)",
      }}
    >
      <input type="hidden" name="comicId" value={comicId} />

      <h3
        className="font-barlow-condensed font-bold uppercase"
        style={{ fontSize: 13, letterSpacing: "0.06em", color: "var(--color-dark)" }}
      >
        Add panels
      </h3>
      <p className="type-caption" style={{ color: "var(--color-text-muted)" }}>
        Select one or more image files — they upload in the order chosen and land at the end of the panel list.
      </p>

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
        name="files"
        accept="image/*"
        multiple
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
        {pending ? "Uploading…" : "Add panels"}
      </button>
    </form>
  );
}
