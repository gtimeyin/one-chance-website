"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { addSinglePanelAction } from "@/app/actions/comics";
import { FeatherUploadCloud, FeatherX, FeatherAlertCircle, FeatherCheck } from "@subframe/core";

type Status = "queued" | "uploading" | "done" | "error";

interface Pending {
  id: string;
  file: File;
  url: string;
  status: Status;
  error?: string;
}

const MAX_FILE_MB = 20;

export default function AddPanelsForm({ comicId }: { comicId: string }) {
  const [items, setItems] = useState<Pending[]>([]);
  const [isDragging, setDragging] = useState(false);
  const [isUploading, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount.
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url));
    };
  }, []);
  const itemsRef = useRef<Pending[]>([]);
  itemsRef.current = items;

  const addFiles = useCallback((files: FileList | File[] | null) => {
    if (!files) return;
    const list = Array.from(files);
    if (list.length === 0) return;

    const additions: Pending[] = list.map((f) => {
      const tooBig = f.size > MAX_FILE_MB * 1024 * 1024;
      const notImage = !f.type.startsWith("image/");
      const problem = notImage
        ? "Not an image file"
        : tooBig
          ? `Larger than ${MAX_FILE_MB}MB`
          : undefined;
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: f,
        url: URL.createObjectURL(f),
        status: problem ? "error" : "queued",
        error: problem,
      };
    });
    setItems((prev) => [...prev, ...additions]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const remove = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearFinished = () => {
    setItems((prev) => {
      const survivors: Pending[] = [];
      for (const i of prev) {
        if (i.status === "done") URL.revokeObjectURL(i.url);
        else survivors.push(i);
      }
      return survivors;
    });
  };

  const move = (id: string, dir: "up" | "down") => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const copy = prev.slice();
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  };

  const retry = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "queued", error: undefined } : i)),
    );
  };

  const upload = () => {
    const queued = itemsRef.current.filter((i) => i.status === "queued");
    if (queued.length === 0) return;

    startTransition(async () => {
      for (const item of queued) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "uploading" } : i)),
        );
        try {
          const fd = new FormData();
          fd.append("comicId", comicId);
          fd.append("file", item.file);
          const result = await addSinglePanelAction(fd);
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? result.success
                  ? { ...i, status: "done", error: undefined }
                  : { ...i, status: "error", error: result.message }
                : i,
            ),
          );
        } catch (e) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: "error", error: (e as Error).message || "Network error" }
                : i,
            ),
          );
        }
      }
    });
  };

  // Auto-clear done items 1.2s after upload finishes (unless there are also errors).
  useEffect(() => {
    if (isUploading) return;
    const hasError = items.some((i) => i.status === "error");
    if (hasError) return;
    const hasDone = items.some((i) => i.status === "done");
    if (!hasDone) return;
    const t = setTimeout(() => {
      setItems((prev) => {
        prev.filter((i) => i.status === "done").forEach((i) => URL.revokeObjectURL(i.url));
        return prev.filter((i) => i.status !== "done");
      });
    }, 1200);
    return () => clearTimeout(t);
  }, [isUploading, items]);

  const counts = items.reduce(
    (acc, i) => {
      acc[i.status]++;
      return acc;
    },
    { queued: 0, uploading: 0, done: 0, error: 0 } as Record<Status, number>,
  );
  const queuedCount = counts.queued;
  const doneCount = counts.done;
  const errorCount = counts.error;
  const totalToProcess = counts.queued + counts.uploading + counts.done;
  const processedCount = counts.done + counts.uploading;

  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      {/* Drop zone */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          // Only leave when leaving the whole zone
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Drop images or click to select"
        className="flex cursor-pointer flex-col items-center justify-center transition-colors"
        style={{
          padding: "32px 24px",
          border: `2px dashed ${isDragging ? "var(--color-yellow)" : "var(--color-border-light)"}`,
          background: isDragging ? "rgba(252,205,33,0.06)" : "var(--color-light-bg)",
          gap: 8,
        }}
      >
        <FeatherUploadCloud style={{ fontSize: 28, color: "var(--color-text-muted)" }} />
        <span
          className="font-barlow-condensed font-bold uppercase"
          style={{ fontSize: 13, letterSpacing: "0.06em", color: "var(--color-dark)" }}
        >
          {isDragging ? "Drop to add" : "Drag & drop panels here"}
        </span>
        <span className="type-caption" style={{ color: "var(--color-text-muted)" }}>
          or click to browse — up to {MAX_FILE_MB}MB each, PNG / JPG / WEBP
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Progress banner */}
      {items.length > 0 && (
        <div
          className="flex items-center justify-between"
          style={{
            gap: 12,
            padding: "10px 14px",
            background: "white",
            border: "1px solid var(--color-border-light)",
          }}
        >
          <div className="flex flex-col" style={{ gap: 2, minWidth: 0 }}>
            <span
              className="font-barlow-condensed font-bold uppercase"
              style={{ fontSize: 12, letterSpacing: "0.06em", color: "var(--color-dark)" }}
            >
              {isUploading
                ? `Uploading ${processedCount} of ${totalToProcess}…`
                : errorCount > 0
                  ? `${errorCount} failed · ${doneCount} uploaded · ${queuedCount} queued`
                  : queuedCount > 0
                    ? `${queuedCount} ready to upload`
                    : `${doneCount} uploaded`}
            </span>
            <div
              className="relative w-full"
              style={{
                height: 3,
                background: "var(--color-border-light)",
                marginTop: 2,
                minWidth: 160,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width:
                    totalToProcess > 0
                      ? `${(counts.done / totalToProcess) * 100}%`
                      : "0%",
                  background: errorCount > 0 ? "var(--color-red)" : "var(--color-yellow)",
                  transition: "width 220ms ease",
                }}
              />
            </div>
          </div>

          <div className="flex items-center" style={{ gap: 8, flexShrink: 0 }}>
            {doneCount > 0 && !isUploading && (
              <button
                type="button"
                onClick={clearFinished}
                className="font-barlow-condensed font-bold uppercase cursor-pointer bg-transparent"
                style={{
                  padding: "8px 12px",
                  color: "var(--color-text-muted)",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  border: "1px solid var(--color-border-light)",
                }}
              >
                Clear done
              </button>
            )}
            <button
              type="button"
              onClick={upload}
              disabled={queuedCount === 0 || isUploading}
              className="font-barlow-condensed font-bold uppercase cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                padding: "10px 16px",
                background: "var(--color-yellow)",
                color: "var(--color-dark)",
                fontSize: 11,
                letterSpacing: "0.06em",
              }}
            >
              {isUploading ? "Uploading…" : `Upload ${queuedCount || ""} panel${queuedCount === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      )}

      {/* Thumbnail grid */}
      {items.length > 0 && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          style={{ gap: 12 }}
        >
          {items.map((item, i) => (
            <ThumbnailCard
              key={item.id}
              item={item}
              index={i}
              atStart={i === 0}
              atEnd={i === items.length - 1}
              onMoveUp={() => move(item.id, "up")}
              onMoveDown={() => move(item.id, "down")}
              onRemove={() => remove(item.id)}
              onRetry={() => retry(item.id)}
              busy={isUploading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ThumbnailCard({
  item,
  index,
  atStart,
  atEnd,
  onMoveUp,
  onMoveDown,
  onRemove,
  onRetry,
  busy,
}: {
  item: Pending;
  index: number;
  atStart: boolean;
  atEnd: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onRetry: () => void;
  busy: boolean;
}) {
  const canReorder = item.status === "queued" && !busy;
  const canRemove = item.status !== "uploading";

  return (
    <div
      className="flex flex-col relative"
      style={{
        gap: 6,
        padding: 8,
        background: "white",
        border:
          item.status === "error"
            ? "1px solid var(--color-red)"
            : item.status === "done"
              ? "1px solid #5AD46F"
              : "1px solid var(--color-border-light)",
      }}
    >
      <div
        className="relative w-full"
        style={{
          aspectRatio: "3 / 4",
          background: "var(--color-light-bg)",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.file.name}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover", opacity: item.status === "error" ? 0.5 : 1 }}
        />

        {/* Order badge */}
        <span
          className="absolute font-barlow-condensed font-bold"
          style={{
            top: 6,
            left: 6,
            padding: "2px 6px",
            background: "var(--color-dark)",
            color: "white",
            fontSize: 10,
            letterSpacing: "0.06em",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Uploading overlay */}
        {item.status === "uploading" && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(10,10,10,0.55)", color: "white" }}
          >
            <div className="flex flex-col items-center" style={{ gap: 6 }}>
              <Spinner />
              <span
                className="font-barlow-condensed font-bold uppercase"
                style={{ fontSize: 10, letterSpacing: "0.06em" }}
              >
                Uploading
              </span>
            </div>
          </div>
        )}

        {/* Status badge */}
        {(item.status === "done" || item.status === "error") && (
          <span
            className="absolute flex items-center"
            style={{
              top: 6,
              right: 6,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: item.status === "done" ? "#5AD46F" : "var(--color-red)",
              color: "white",
              justifyContent: "center",
            }}
          >
            {item.status === "done" ? (
              <FeatherCheck style={{ fontSize: 14 }} />
            ) : (
              <FeatherAlertCircle style={{ fontSize: 14 }} />
            )}
          </span>
        )}
      </div>

      <p
        className="font-barlow-body truncate"
        style={{ fontSize: 12, color: "var(--color-text-muted)" }}
        title={item.file.name}
      >
        {item.file.name}
      </p>

      {item.error && (
        <p
          className="font-barlow-body"
          style={{
            fontSize: 11,
            color: "#991B1B",
            background: "#FEE2E2",
            padding: "4px 6px",
            lineHeight: 1.3,
          }}
        >
          {item.error}
        </p>
      )}

      <div className="flex items-center" style={{ gap: 4 }}>
        <SmallBtn onClick={onMoveUp} disabled={atStart || !canReorder} label="↑" />
        <SmallBtn onClick={onMoveDown} disabled={atEnd || !canReorder} label="↓" />
        {item.status === "error" && (
          <SmallBtn onClick={onRetry} label="Retry" wide tone="warn" disabled={busy} />
        )}
        <div style={{ flex: 1 }} />
        <SmallBtn onClick={onRemove} disabled={!canRemove} label={<FeatherX style={{ fontSize: 12 }} />} tone="danger" />
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 20,
        height: 20,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "white",
        borderRadius: "50%",
        display: "inline-block",
        animation: "oc-spin 0.8s linear infinite",
      }}
    />
  );
}

function SmallBtn({
  onClick,
  disabled,
  label,
  wide,
  tone,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: React.ReactNode;
  wide?: boolean;
  tone?: "danger" | "warn";
}) {
  const color =
    tone === "danger"
      ? "var(--color-red)"
      : tone === "warn"
        ? "#B45309"
        : "var(--color-dark)";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        minWidth: wide ? 52 : 28,
        height: 28,
        padding: wide ? "0 8px" : 0,
        border: "1px solid var(--color-border-light)",
        background: "white",
        color,
        fontSize: 12,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label}
    </button>
  );
}
