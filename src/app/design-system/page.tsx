"use client";

import { useEffect, useState } from "react";
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { Badge } from "@/ui/components/Badge";
import { Alert } from "@/ui/components/Alert";
import { Avatar } from "@/ui/components/Avatar";
import { Switch } from "@/ui/components/Switch";
import { Checkbox } from "@/ui/components/Checkbox";
import { Progress } from "@/ui/components/Progress";
import { TextField } from "@/ui/components/TextField";
import { Loader } from "@/ui/components/Loader";
import { SkeletonText } from "@/ui/components/SkeletonText";
import { FeatherShoppingBag, FeatherStar, FeatherSearch } from "@subframe/core";

/* ---------------------------------------------------------------- *
 * Token definitions — names only. Actual values are read at runtime
 * from the CSS custom properties defined in src/ui/theme.css, so this
 * page can never drift out of sync with the real design tokens.
 * ---------------------------------------------------------------- */

const colorGroups: { title: string; tokens: string[] }[] = [
  {
    title: "Brand",
    tokens: ["brand-primary", "brand-yellow", "brand-blue", "brand-green", "brand-white"],
  },
  {
    title: "Neutral",
    tokens: [
      "neutral-0", "neutral-50", "neutral-100", "neutral-200", "neutral-300",
      "neutral-400", "neutral-500", "neutral-600", "neutral-700", "neutral-800",
      "neutral-900", "neutral-950",
    ],
  },
  {
    title: "Yellow",
    tokens: ["yellow-100", "yellow-200", "yellow-300", "yellow-400", "yellow-500", "yellow-600", "yellow-700", "yellow-800", "yellow-900"],
  },
  {
    title: "Blue",
    tokens: ["blue-100", "blue-200", "blue-300", "blue-400", "blue-500", "blue-600", "blue-700", "blue-800", "blue-900"],
  },
  {
    title: "Green",
    tokens: ["green-100", "green-200", "green-300", "green-400", "green-500", "green-600", "green-700", "green-800", "green-900"],
  },
  {
    title: "Error",
    tokens: ["error-50", "error-100", "error-200", "error-300", "error-400", "error-500", "error-600", "error-700", "error-800", "error-900"],
  },
  {
    title: "Black",
    tokens: ["black-10", "black-50", "black-100", "black-200", "black-300", "black-400", "black-500", "black-600", "black-700", "black-800", "black-900", "black-950"],
  },
  {
    title: "Background",
    tokens: ["background-dark-primary", "background-dark-secondary", "background-dark-tertiary", "background-light-primary", "background-light-secondary", "background-light-tertiary"],
  },
  {
    title: "System",
    tokens: ["system-blue-light", "system-green-light", "system-indigo-light", "system-orange-light", "system-pink-light", "system-purple-light", "system-red-light", "system-soft-blue-light", "system-yellow-light"],
  },
];

// Ordered largest → smallest so the page reads like a real type ramp.
const typeStyles: string[] = [
  "large-display-title-bold", "large-display-title-default",
  "display-title-bold", "display-title-default",
  "heading-xxlarge-bold", "heading-xxlarge-default",
  "heading-xlarge-bold", "heading-xlarge-default",
  "heading-large-bold", "heading-large-default",
  "heading-medium-bold", "heading-medium-default",
  "heading-1", "heading-2", "heading-3",
  "large-body-bold", "large-body-default", "large-body-italic", "large-body-bold-italic",
  "body-bold", "body-default", "body", "body-italic", "body-bold-italic",
  "button-large", "button-small",
  "callout-bold", "callout-default", "callout-italic", "callout-bold-italic",
  "footnote-bold", "footnote-default", "footnote-italic", "footnote-bold-italic",
  "caption-bold", "caption-default", "caption", "caption-italic", "caption-bold-italic",
  "monospace-body",
];

function readVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex w-full flex-col gap-6 scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight text-neutral-900 border-b border-neutral-200 pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{title}</h3>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

export default function DesignSystemPage() {
  const [switchOn, setSwitchOn] = useState(true);
  const [checked, setChecked] = useState(true);
  // Resolved token values for the spec labels (filled in after mount).
  const [resolved, setResolved] = useState<Record<string, string>>({});

  useEffect(() => {
    const map: Record<string, string> = {};
    colorGroups.forEach((g) => g.tokens.forEach((t) => { map[`color-${t}`] = readVar(`--color-${t}`); }));
    typeStyles.forEach((t) => {
      map[`size-${t}`] = readVar(`--text-${t}`);
      map[`weight-${t}`] = readVar(`--text-${t}--font-weight`);
      map[`lh-${t}`] = readVar(`--text-${t}--line-height`);
      map[`font-${t}`] = readVar(`--font-${t}`);
    });
    setResolved(map);
  }, []);

  const buttonVariants = [
    "brand-primary", "white", "brand-tertiary", "neutral-primary",
    "neutral-secondary", "destructive-primary", "destructive-secondary",
  ] as const;
  const iconButtonVariants = [
    "brand-primary", "brand-secondary", "brand-tertiary", "neutral-primary",
    "neutral-secondary", "neutral-tertiary", "destructive-primary",
    "destructive-secondary", "destructive-tertiary", "inverse",
  ] as const;
  const statusVariants = ["brand", "neutral", "success", "warning", "error"] as const;
  const avatarSizes = ["x-large", "large", "medium", "small", "x-small"] as const;

  return (
    <main className="flex min-h-screen w-full justify-center bg-neutral-50 px-6 py-12">
      <div className="flex w-full max-w-[1100px] flex-col gap-16">
        {/* Header */}
        <header className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-widest text-neutral-400">One Chance</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">Design System</h1>
          <p className="max-w-prose text-neutral-500">
            Live reference for the type scale, colour tokens, and component variants. Values
            are read directly from <code className="rounded bg-neutral-200 px-1 py-0.5 text-sm">src/ui/theme.css</code> at
            runtime, so this page always reflects the real tokens.
          </p>
          <nav className="mt-2 flex flex-wrap gap-2">
            {[["colors", "Colors"], ["type", "Typography"], ["components", "Components"]].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 transition hover:bg-neutral-900 hover:text-white">
                {label}
              </a>
            ))}
          </nav>
        </header>

        {/* COLORS */}
        <Section id="colors" title="Colors">
          {colorGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{group.title}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {group.tokens.map((token) => (
                  <div key={token} className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
                    <div className="h-16 w-full border-b border-neutral-200" style={{ backgroundColor: `var(--color-${token})` }} />
                    <div className="flex flex-col gap-0.5 p-2">
                      <span className="truncate text-xs font-medium text-neutral-900" title={token}>{token}</span>
                      <span className="truncate text-[11px] tabular-nums text-neutral-400">{resolved[`color-${token}`] || "…"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* TYPOGRAPHY */}
        <Section id="type" title="Typography">
          <div className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
            {typeStyles.map((name) => (
              <div key={name} className="flex flex-col gap-2 p-4 md:flex-row md:items-baseline md:justify-between md:gap-6">
                <span
                  className="truncate text-neutral-900"
                  style={{
                    fontSize: `var(--text-${name})`,
                    fontWeight: `var(--text-${name}--font-weight)` as React.CSSProperties["fontWeight"],
                    lineHeight: `var(--text-${name}--line-height)`,
                    letterSpacing: `var(--text-${name}--letter-spacing)`,
                    fontFamily: `var(--font-${name})`,
                    fontStyle: name.includes("italic") ? "italic" : "normal",
                  }}
                >
                  Survive Lagos
                </span>
                <div className="flex shrink-0 flex-col text-right">
                  <span className="text-sm font-medium text-neutral-700">{name}</span>
                  <span className="text-xs tabular-nums text-neutral-400">
                    {resolved[`size-${name}`] || "…"} · {resolved[`weight-${name}`] || "…"} · lh {resolved[`lh-${name}`] || "…"} · {resolved[`font-${name}`] || "…"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* COMPONENTS */}
        <Section id="components" title="Components & Variants">
          {/* Buttons */}
          <Subsection title="Button — variants (medium)">
            {buttonVariants.map((v) => (
              <Button key={v} variant={v}>{v}</Button>
            ))}
          </Subsection>
          <Subsection title="Button — sizes & states">
            <Button size="medium">Medium</Button>
            <Button size="small">Small</Button>
            <Button iconRight={<FeatherShoppingBag />}>With icon</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </Subsection>

          {/* Icon buttons */}
          <Subsection title="IconButton — variants">
            {iconButtonVariants.map((v) => (
              <IconButton key={v} variant={v} icon={<FeatherStar />} />
            ))}
          </Subsection>
          <Subsection title="IconButton — sizes">
            <IconButton size="large" icon={<FeatherSearch />} />
            <IconButton size="medium" icon={<FeatherSearch />} />
            <IconButton size="small" icon={<FeatherSearch />} />
          </Subsection>

          {/* Badges */}
          <Subsection title="Badge — variants">
            {statusVariants.map((v) => (
              <Badge key={v} variant={v}>{v}</Badge>
            ))}
          </Subsection>

          {/* Avatars */}
          <Subsection title="Avatar — sizes">
            {avatarSizes.map((s) => (
              <Avatar key={s} size={s}>OC</Avatar>
            ))}
          </Subsection>
          <Subsection title="Avatar — variants">
            {statusVariants.map((v) => (
              <Avatar key={v} variant={v}>{v[0].toUpperCase()}</Avatar>
            ))}
          </Subsection>

          {/* Alerts */}
          <div className="flex w-full flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Alert — variants</h3>
            <div className="flex w-full flex-col gap-3">
              {statusVariants.map((v) => (
                <Alert
                  key={v}
                  variant={v}
                  title={`${v[0].toUpperCase()}${v.slice(1)} alert`}
                  description="This is an example alert message demonstrating the variant."
                />
              ))}
            </div>
          </div>

          {/* Form controls */}
          <Subsection title="Form controls">
            <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
            <Checkbox checked={checked} onCheckedChange={setChecked} label="Checkbox" />
          </Subsection>
          <div className="flex w-full max-w-md flex-col gap-4">
            <TextField label="Text field" helpText="Helper text goes here">
              <TextField.Input placeholder="Type something…" />
            </TextField>
          </div>

          {/* Progress & loaders */}
          <Subsection title="Progress">
            <div className="w-full max-w-md"><Progress value={35} /></div>
            <div className="w-full max-w-md"><Progress value={70} /></div>
          </Subsection>
          <Subsection title="Loader & Skeleton">
            <Loader />
            <div className="w-full max-w-md"><SkeletonText /></div>
          </Subsection>
        </Section>

        <footer className="pb-8 text-center text-sm text-neutral-400">
          One Chance design system · generated from theme tokens
        </footer>
      </div>
    </main>
  );
}
