"use client";

import { useState } from "react";
import { CursorIcon } from "@/components/brand";
import { AssetActions } from "@/components/asset-actions";
import { Input } from "@/components/ui/input";
import { AD_CONFIG, GOOGLE_SPECS, SITELINKS } from "@/lib/seed";
import { useStore } from "@/lib/store";
import { useSyncedField } from "@/lib/use-synced-field";
import { charCount } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { Treatment } from "@/lib/types";

const DISPLAY_URL = `${AD_CONFIG.displayUrl}/${AD_CONFIG.displayPath.join("/")}`;

export function SerpPreview({ treatment }: { treatment: Treatment }) {
  const pinned =
    treatment.headlines.find((h) => h.id === treatment.pinnedHeadlineId) ?? treatment.headlines[0];
  const rest = treatment.headlines.filter((h) => h.id !== pinned.id);
  const headline = [pinned.text, rest[0]?.text, rest[1]?.text].filter(Boolean).join(" | ");

  // Google renders results on white, so the mock keeps Google's own palette regardless of the
  // dark chrome around it: #1a0dab links, #202124 body, #4d5156 secondary text.
  return (
    <div className="rounded-xl bg-white p-5 text-[#202124]">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#dadce0] bg-white">
          <CursorIcon height={14} className="h-3.5 w-auto" />
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-medium text-[#202124]">Cursor</p>
          <p className="text-[13px] text-[#4d5156]">{DISPLAY_URL}</p>
        </div>
        <span className="ml-1 rounded border border-[#dadce0] px-1.5 py-px text-[11px] font-medium text-[#4d5156]">
          Sponsored
        </span>
      </div>

      <p className="mt-3 text-xl leading-7 text-[#1a0dab]">{headline}</p>
      <p className="mt-1.5 text-[14px] leading-6 text-[#4d5156]">
        {treatment.descriptions[0]?.text}
      </p>

      <ul className="mt-5 grid gap-x-8 gap-y-4 border-t border-[#dadce0] pt-5 sm:grid-cols-2">
        {SITELINKS.map((s) => (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-[15px] leading-6 text-[#1a0dab] underline-offset-4 hover:underline"
            >
              {s.text}
            </a>
            <p className="text-[13px] leading-5 text-[#4d5156]">{s.line1}</p>
            <p className="font-mono text-[11px] leading-5 text-[#70757a]">{s.path}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AssetRow({
  treatmentId,
  kind,
  assetId,
  text,
  max,
}: {
  treatmentId: string;
  kind: "headlines" | "descriptions";
  assetId: string;
  text: string;
  max: number;
}) {
  const { updateAsset } = useStore();
  const [value, setValue] = useSyncedField(text);
  const count = charCount(value);
  const over = count > max;

  return (
    <div className="flex items-center gap-3">
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          updateAsset(treatmentId, kind, assetId, e.target.value);
        }}
        aria-label={`${kind === "headlines" ? "Headline" : "Description"} ${assetId}`}
        aria-invalid={over || undefined}
        className="h-9 flex-1 bg-background font-mono text-[13px] md:text-[13px]"
      />
      <span
        className={cn(
          "w-12 shrink-0 text-right font-mono text-[11px] tabular-nums",
          over ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {count}/{max}
      </span>
    </div>
  );
}

function AssetEditor({ treatment }: { treatment: Treatment }) {
  const { rsa } = GOOGLE_SPECS;
  return (
    <div className="mt-5 grid gap-6 border-t border-border/70 pt-5 lg:grid-cols-2">
      <div className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Headlines · max {rsa.headlineMax}
        </p>
        {treatment.headlines.map((h) => (
          <AssetRow
            key={h.id}
            treatmentId={treatment.id}
            kind="headlines"
            assetId={h.id}
            text={h.text}
            max={rsa.headlineMax}
          />
        ))}
      </div>
      <div className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Descriptions · max {rsa.descriptionMax}
        </p>
        {treatment.descriptions.map((d) => (
          <AssetRow
            key={d.id}
            treatmentId={treatment.id}
            kind="descriptions"
            assetId={d.id}
            text={d.text}
            max={rsa.descriptionMax}
          />
        ))}
      </div>
    </div>
  );
}

export function AdCard({ treatment }: { treatment: Treatment }) {
  const [editing, setEditing] = useState(false);
  const { state } = useStore();
  const approved = Boolean(state.approvals[treatment.id]);

  return (
    <article
      className={cn(
        "rounded-2xl border bg-card p-7 transition-colors",
        approved ? "border-foreground/30" : "border-border",
      )}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold">{treatment.name}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{treatment.why}</p>
        </div>
        <AssetActions assetKey={treatment.id} label={treatment.name} />
      </div>

      <SerpPreview treatment={treatment} />

      <button
        type="button"
        onClick={() => setEditing((v) => !v)}
        className="mt-5 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        {editing ? "Hide assets" : "Edit assets"}
      </button>
      {editing ? <AssetEditor treatment={treatment} /> : null}
    </article>
  );
}
