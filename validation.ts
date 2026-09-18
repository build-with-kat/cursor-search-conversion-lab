import { GOOGLE_SPECS } from "./seed";

/**
 * Array.from so an astral-plane character counts once. Google counts CJK characters double; this
 * copy is English-only, so that rule is not implemented.
 */
export function charCount(text: string): number {
  return Array.from(text).length;
}

export function overLimit(text: string, max: number): boolean {
  return charCount(text) > max;
}

export const LIMITS = {
  headline: GOOGLE_SPECS.rsa.headlineMax,
  description: GOOGLE_SPECS.rsa.descriptionMax,
} as const;
