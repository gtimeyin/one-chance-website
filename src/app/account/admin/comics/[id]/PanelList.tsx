"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import {
  deletePanelAction,
  reorderPanelsAction,
  updatePanelCaption,
} from "@/app/actions/comics";

export interface PanelItem {
  id: string;
  src: string;
  caption: string | null;
}

export default function PanelList({
  comicId,
  slug,
  panels,
}: {
  comicId: string;
  slug: string;
  panels: PanelItem[];
}) {
  // Local order drives the drag UI; it's re-synced during render whenever the
  // server sends a different set/order of panels (add, delete, and reorder all
  // revalidate). This is React's recommended "adjust state during render"
  // pattern — no effect needed.
  const [order, setOrder] = useState<PanelItem[]>(panels);
  const [prevSig, setPrevSig] = useState(() => panels.map((p) => p.id).join(","));
  const [, startTransition] = useTransition();

  const serverSig = panels.map((p) => p.id).join(",");
  if (serverSig !== prevSig) {
    setPrevSig(serverSig);
    setOrder(panels);
  }

  const persist = (next: PanelItem[]) => {
    const ids = next.map((p) => p.id);
    startTransition(() => {
      void reorderPanelsAction(comicId, slug, ids);
    });
  };

  const moveByKeyboard = (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= order.length) return;
    const next = order.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    persist(next);
  };

  return (
    <Reorder.Group
      axis="y"
      values={order}
      onReorder={setOrder}
      className="flex flex-col"
      style={{ gap: 8, listStyle: "none", padding: 0, margin: 0 }}
    >
      {order.map((p, i) => (
        <PanelRow
          key={p.id}
          panel={p}
          index={i}
          total={order.length}
          slug={slug}
          onDragCommit={() => persist(order)}
          onMoveUp={() => moveByKeyboard(i, "up")}
          onMoveDown={() => moveByKeyboard(i, "down")}
        />
      ))}
    </Reorder.Group>
  );
}

function PanelRow({
  panel,
  index,
  total,
  slug,
  onDragCommit,
  onMoveUp,
  onMoveDown,
}: {
  panel: PanelItem;
  index: number;
  total: number;
  slug: string;
  onDragCommit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={panel}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragCommit}
      className="flex items-start"
      style={{
        gap: 16,
        padding: 12,
        border: "1px solid var(--color-border-light)",
        background: "white",
      }}
    >
      {/* Drag handle */}
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        aria-label={`Drag to reorder panel ${index + 1}`}
        className="shrink-0 cursor-grab active:cursor-grabbing border-none touch-none self-stretch flex items-center"
        style={{ background: "transparent", padding: "0 2px", color: "var(--color-text-muted)" }}
      >
        <GripVertical size={18} />
      </button>

      <div
        className="relative shrink-0"
        style={{ width: 96, height: 120, background: "var(--color-light-bg)", overflow: "hidden" }}
      >
        <Image src={panel.src} alt="" fill sizes="96px" style={{ objectFit: "cover" }} />
      </div>

      <form action={updatePanelCaption} className="flex-1 flex flex-col" style={{ gap: 6 }}>
        <input type="hidden" name="panelId" value={panel.id} />
        <input type="hidden" name="slug" value={slug} />
        <span className="type-caption" style={{ color: "var(--color-text-muted)" }}>
          Panel {index + 1} of {total}
        </span>
        <textarea
          name="caption"
          defaultValue={panel.caption ?? ""}
          placeholder="Optional caption…"
          rows={2}
          className="font-barlow-body"
          style={{
            padding: "8px 10px",
            border: "1px solid var(--color-border-light)",
            fontSize: 15,
            color: "var(--color-dark)",
            resize: "vertical",
          }}
        />
        <button
          type="submit"
          className="self-start font-barlow-condensed font-bold uppercase cursor-pointer border-none"
          style={{
            padding: "6px 12px",
            background: "var(--color-yellow)",
            color: "var(--color-dark)",
            fontSize: 11,
            letterSpacing: "0.06em",
          }}
        >
          Save caption
        </button>
      </form>

      <div className="flex flex-col shrink-0" style={{ gap: 6 }}>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="font-barlow-condensed cursor-pointer border disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            padding: "6px 12px",
            background: "white",
            color: "var(--color-dark)",
            fontSize: 11,
            letterSpacing: "0.06em",
            borderColor: "var(--color-border-light)",
          }}
        >
          ↑ up
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="font-barlow-condensed cursor-pointer border disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            padding: "6px 12px",
            background: "white",
            color: "var(--color-dark)",
            fontSize: 11,
            letterSpacing: "0.06em",
            borderColor: "var(--color-border-light)",
          }}
        >
          ↓ down
        </button>
        <form action={deletePanelAction}>
          <input type="hidden" name="panelId" value={panel.id} />
          <input type="hidden" name="slug" value={slug} />
          <button
            type="submit"
            className="font-barlow-condensed cursor-pointer border"
            style={{
              padding: "6px 12px",
              background: "white",
              color: "var(--color-red)",
              fontSize: 11,
              letterSpacing: "0.06em",
              borderColor: "var(--color-border-light)",
            }}
          >
            Delete
          </button>
        </form>
      </div>
    </Reorder.Item>
  );
}
