"use client";

import { useState } from "react";

/**
 * Keeps a local draft for a text input while still following the stored value when it changes
 * underneath — which happens when a research update rewrites an asset, or the demo is reset.
 *
 * This uses React's documented "adjust state during render" pattern rather than an effect: the
 * component re-renders immediately with the corrected value, so the input never flashes stale
 * text, and no cascading render is scheduled.
 */
export function useSyncedField(external: string): [string, (next: string) => void] {
  const [value, setValue] = useState(external);
  const [seen, setSeen] = useState(external);

  if (external !== seen) {
    setSeen(external);
    setValue(external);
  }

  return [value, setValue];
}
