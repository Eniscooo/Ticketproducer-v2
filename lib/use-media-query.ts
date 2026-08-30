"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query that is safe to branch markup on.
 *
 * Same shape as [`useReducedMotionSafe`](./use-reduced-motion-safe.ts): the
 * server cannot evaluate a query, so it reports `false` and the client corrects
 * on mount.
 *
 * Only branch on this where the `false` branch is harmless at first paint.
 * Every caller here uses it to decide whether a *closed* menu will open as a
 * popover or a sheet, so nothing is on screen to flash while the value settles.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Below `sm`. The width at which the filter menus become pull-up sheets. */
export const HANDHELD = "(max-width: 639px)";
