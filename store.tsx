"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  EMAIL_COPY,
  LANDING_COPY,
  SEED_KEYWORDS,
  TREATMENTS,
} from "./seed";
import type {
  EmailCopy,
  KeywordRow,
  LandingCopy,
  MatchType,
  TasteEntry,
  Treatment,
} from "./types";

const STORAGE_KEY = "cursor-search-conversion-lab/v8";

export const LANDING_KEY = "landing";
export const EMAIL_KEY = "email";

export interface LabState {
  treatments: Treatment[];
  keywords: KeywordRow[];
  landing: LandingCopy;
  email: EmailCopy;
  /** Bumped whenever an asset's text changes, so an approval can be recognised as stale. */
  versions: Record<string, number>;
  /** The asset version that was approved. Absent means never approved. */
  approvals: Record<string, number>;
  /** Assets sent back, keyed by asset. Cleared when the asset is approved again. */
  revisions: Record<string, string>;
  taste: TasteEntry[];
}

function seedState(): LabState {
  return {
    treatments: structuredClone(TREATMENTS),
    keywords: structuredClone(SEED_KEYWORDS),
    landing: structuredClone(LANDING_COPY),
    email: structuredClone(EMAIL_COPY),
    versions: {},
    approvals: {},
    revisions: {},
    taste: [],
  };
}

/**
 * Every ad and the landing page must be approved. The email is optional in the campaign, but an
 * unapproved one still blocks — half-reviewed copy should not ship alongside approved copy.
 */
export function requiredKeys(state: LabState): string[] {
  return [...state.treatments.map((t) => t.id), LANDING_KEY, EMAIL_KEY];
}

export type AssetStatus = "approved" | "stale" | "revise" | "review";

export function versionOf(state: LabState, key: string): number {
  return state.versions[key] ?? 1;
}

export function assetStatus(state: LabState, key: string): AssetStatus {
  if (state.revisions[key]) return "revise";
  const approved = state.approvals[key];
  if (approved == null) return "review";
  return approved === versionOf(state, key) ? "approved" : "stale";
}

export const STATUS_LABEL: Record<AssetStatus, string> = {
  approved: "Approved",
  stale: "Edited since approval",
  revise: "Sent back",
  review: "Needs review",
};

export function pendingKeys(state: LabState): string[] {
  return requiredKeys(state).filter((k) => assetStatus(state, k) !== "approved");
}

/**
 * A fingerprint of the copy this build ships. Saved state carries the fingerprint it was written
 * against; when the two disagree the shipped copy wins and only the review work is carried over.
 * Without this, a browser that opened an older build would keep serving its cached copy forever.
 */
function contentSignature(): string {
  const shipped = JSON.stringify([
    TREATMENTS.map((t) => [
      t.id,
      t.name,
      t.queueLine,
      t.headlines.map((h) => h.text),
      t.descriptions.map((d) => d.text),
    ]),
    SEED_KEYWORDS.map((k) => [k.id, k.keyword, k.matchType]),
    LANDING_COPY.heroDefault.headline,
    EMAIL_COPY.subject,
  ]);

  let hash = 0x811c9dc5;
  for (let i = 0; i < shipped.length; i++) {
    hash ^= shipped.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

const SIGNATURE = contentSignature();

function dropKey<T>(record: Record<string, T>, key: string): Record<string, T> {
  const next = { ...record };
  delete next[key];
  return next;
}

interface Saved {
  signature: string;
  state: LabState;
}

/** Saved work is kept; saved copy is discarded whenever this build ships different copy. */
function restore(raw: string): LabState {
  const saved = JSON.parse(raw) as Saved;
  if (saved.signature === SIGNATURE) return saved.state;

  return {
    ...seedState(),
    approvals: saved.state.approvals ?? {},
    revisions: saved.state.revisions ?? {},
    taste: saved.state.taste ?? [],
  };
}


interface StoreValue {
  state: LabState;
  toast: string | null;
  setApproved: (key: string, approved: boolean) => void;
  sendBack: (key: string, label: string, note: string) => void;
  updateAsset: (
    treatmentId: string,
    kind: "headlines" | "descriptions",
    assetId: string,
    text: string,
  ) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (id: string) => void;
  setMatchType: (id: string, matchType: MatchType) => void;
  approveAll: () => void;
  showToast: (message: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LabState>(seedState);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reading localStorage during render would desync the server and client markup, so saved work is
  // applied once after mount instead.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState(restore(raw));
    } catch {
      // A corrupt entry just means the workspace opens on seed content.
    }
  }, []);

  useEffect(() => {
    try {
      const saved: Saved = { signature: SIGNATURE, state };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // Private-mode quota failures should not break the page.
    }
  }, [state]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  /** Approval is recorded against the version on screen, never as a bare flag. */
  const setApproved = useCallback((key: string, approved: boolean) => {
    setState((prev) => {
      const approvals = { ...prev.approvals };
      const revisions = { ...prev.revisions };
      if (approved) {
        approvals[key] = versionOf(prev, key);
        delete revisions[key];
      } else {
        delete approvals[key];
      }
      return { ...prev, approvals, revisions };
    });
  }, []);

  const approveAll = useCallback(() => {
    setState((prev) => {
      const approvals = { ...prev.approvals };
      for (const key of requiredKeys(prev)) approvals[key] = versionOf(prev, key);
      return { ...prev, approvals, revisions: {} };
    });
  }, []);

  /** Sending an asset back retracts approval and records why, so a rewrite has the context. */
  const sendBack = useCallback((key: string, label: string, note: string) => {
    setState((prev) => {
      const entry: TasteEntry = {
        id: `${key}-${Date.now()}`,
        assetKey: key,
        assetLabel: label,
        note,
        at: new Date().toISOString(),
      };
      return {
        ...prev,
        approvals: dropKey(prev.approvals, key),
        revisions: { ...prev.revisions, [key]: note },
        taste: [entry, ...prev.taste.filter((t) => t.assetKey !== key)].slice(0, 12),
      };
    });
  }, []);

  const updateAsset = useCallback<StoreValue["updateAsset"]>(
    (treatmentId, kind, assetId, text) => {
      setState((prev) => {
        const next = structuredClone(prev);
        const treatment = next.treatments.find((t) => t.id === treatmentId);
        const asset = treatment?.[kind].find((a) => a.id === assetId);
        if (!asset) return prev;
        asset.text = text;
        // A new version, so any approval of the previous one is now stale rather than silently kept.
        next.versions = { ...next.versions, [treatmentId]: versionOf(prev, treatmentId) + 1 };
        return next;
      });
    },
    [],
  );

  const addKeyword = useCallback((keyword: string) => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return;
    setState((prev) => {
      if (prev.keywords.some((k) => k.keyword === trimmed)) return prev;
      const row: KeywordRow = {
        id: `kw-${Date.now()}`,
        keyword: trimmed,
        matchType: "phrase",
        tier: 3,
        volume: null,
        competition: null,
      };
      return { ...prev, keywords: [...prev.keywords, row] };
    });
  }, []);

  const removeKeyword = useCallback((id: string) => {
    setState((prev) => ({ ...prev, keywords: prev.keywords.filter((k) => k.id !== id) }));
  }, []);

  const setMatchType = useCallback((id: string, matchType: MatchType) => {
    setState((prev) => ({
      ...prev,
      keywords: prev.keywords.map((k) => (k.id === id ? { ...k, matchType } : k)),
    }));
  }, []);


  const value = useMemo(
    () => ({
      state,
      toast,
      setApproved,
      sendBack,
      updateAsset,
      addKeyword,
      removeKeyword,
      setMatchType,
      approveAll,
      showToast,
    }),
    [
      state,
      toast,
      setApproved,
      sendBack,
      updateAsset,
      addKeyword,
      removeKeyword,
      setMatchType,
      approveAll,
      showToast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
