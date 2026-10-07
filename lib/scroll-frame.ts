/**
 * Scroll-linked work, batched to one call per animation frame.
 *
 * Scroll and resize only *schedule* a frame — they never touch the DOM — and
 * the scroll listener is passive, so the browser never waits on script before
 * it scrolls. `measure` runs before the first frame and again on resize (or
 * whenever the caller invokes the returned `remeasure`, e.g. from a
 * ResizeObserver), so per-frame code can stay on cached numbers instead of
 * forcing layout.
 */
export function subscribeScrollFrame(frame: () => void, measure?: () => void) {
  let raf = 0;

  const schedule = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      frame();
    });
  };

  const remeasure = () => {
    measure?.();
    schedule();
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", remeasure, { passive: true });
  remeasure();

  return {
    remeasure,
    unsubscribe() {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
    },
  };
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
