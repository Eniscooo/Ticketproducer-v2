"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/** The server cannot know the preference — assume motion, then correct. */
function getServerSnapshot() {
  return false;
}

/**
 * Reduced-motion preference that is safe to branch markup on.
 *
 * Framer Motion's `useReducedMotion` reports `false` during SSR and the real
 * value on the client, so markup branched on it hydrates mismatched. Reading
 * the media query through `useSyncExternalStore` hydrates against the server
 * snapshot and then re-renders with the real value.
 */
export function useReducedMotionSafe() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
