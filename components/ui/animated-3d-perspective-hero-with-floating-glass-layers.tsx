"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

/**
 * Animated 3D perspective hero with floating glass layers.
 *
 * `PerspectiveStage` is the engine: a tilted 3D stage holding one main piece
 * and any number of floating layers, each at its own depth. On desktop with a
 * fine pointer the whole stage turns gently toward the cursor and every layer
 * slides by an amount proportional to its depth, so nearer layers move more —
 * real parallax rather than one flat tilt. Each layer also bobs on its own
 * clock (CSS, compositor-only).
 *
 * On touch screens, below `lg`, and for readers who ask for reduced motion the
 * pointer effects are off entirely and no listener is attached; reduced motion
 * also stills the floating and the entrance.
 *
 * `Component` wraps the stage in a complete hero (badge, title, subtitle, two
 * actions), with the same props as the reference demo.
 */

const EASE = [0.16, 0.84, 0.28, 1] as const;

/** Desktop, with a mouse or trackpad: the only place pointer parallax runs. */
const PARALLAX_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

type StageMotion = {
  /** Pointer position across the viewport, smoothed: -0.5 (left/top) to 0.5 (right/bottom). Stays 0 when parallax is off. */
  px: MotionValue<number>;
  py: MotionValue<number>;
};

const StageContext = React.createContext<StageMotion | null>(null);

/** The smoothed pointer position, for pieces inside the stage that want their own response (a sheen, a glint). */
export function useStageMotion() {
  const ctx = React.useContext(StageContext);
  if (!ctx) throw new Error("useStageMotion must be used inside <PerspectiveStage>");
  return ctx;
}

export type FloatingLayer = {
  id: string;
  node: React.ReactNode;
  /** Positioning classes for the layer inside the stage, e.g. "left-0 top-1/4 hidden lg:block". */
  className?: string;
  /** Distance toward the viewer, in px. Also scales how far the layer drifts with the pointer. */
  depth?: number;
  /** Bobbing: seconds per cycle, delay in seconds, and travel in px (negative is up). */
  float?: { duration?: number; delay?: number; distance?: number };
};

export type PerspectiveStageProps = {
  main: React.ReactNode;
  layers?: FloatingLayer[];
  className?: string;
  /** Classes for the stage box itself — its size per breakpoint. */
  stageClassName?: string;
  /** Classes for the resting tilt, e.g. "[transform:rotateX(12deg)]". */
  tiltClassName?: string;
  /** Seconds before the stage starts to rise in. */
  delay?: number;
};

function Layer({
  layer,
  index,
  delay,
  reduceMotion,
}: {
  layer: FloatingLayer;
  index: number;
  delay: number;
  reduceMotion: boolean;
}) {
  const { px, py } = useStageMotion();
  const depth = layer.depth ?? 80;
  const x = useTransform(px, (v) => v * depth * 0.4);
  const y = useTransform(py, (v) => v * depth * 0.3);
  const float = layer.float ?? {};

  return (
    <motion.div
      // Reduced motion: shown outright by CSS, whatever the entrance is doing in JS.
      // The entrance is opacity-only so that override never has to touch the transform,
      // which carries the layer's depth and parallax.
      className={cn("absolute [transform-style:preserve-3d] motion-reduce:!opacity-100", layer.className)}
      style={{ x, y, z: depth }}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      // `initial` is already rendered on the server (which can't know the preference),
      // so reduced motion also needs an instant transition, not just `initial={false}`.
      transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: delay + 0.45 + index * 0.12 }}
    >
      <div
        className="tp-float"
        style={
          {
            "--float-dur": `${float.duration ?? 7}s`,
            "--float-delay": `${float.delay ?? index * -1.7}s`,
            "--float-y": `${float.distance ?? -10}px`,
          } as React.CSSProperties
        }
      >
        {layer.node}
      </div>
    </motion.div>
  );
}

export function PerspectiveStage({
  main,
  layers = [],
  className,
  stageClassName,
  tiltClassName = "[transform:rotateX(8deg)] lg:[transform:rotateX(14deg)_rotateY(-5deg)]",
  delay = 0.2,
}: PerspectiveStageProps) {
  const reduceMotion = useReducedMotionSafe();
  const finePointer = useMediaQuery(PARALLAX_QUERY);
  const parallax = finePointer && !reduceMotion;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 90, damping: 22, mass: 0.7 });
  const py = useSpring(rawY, { stiffness: 90, damping: 22, mass: 0.7 });
  const rotateY = useTransform(px, (v) => v * 10);
  const rotateX = useTransform(py, (v) => v * -8);

  React.useEffect(() => {
    if (!parallax) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (event: PointerEvent) => {
      rawX.set(event.clientX / window.innerWidth - 0.5);
      rawY.set(event.clientY / window.innerHeight - 0.5);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [parallax, rawX, rawY]);

  const motionValues = React.useMemo(() => ({ px, py }), [px, py]);

  return (
    <StageContext.Provider value={motionValues}>
      <div className={cn("relative", className)}>
        {/*
         * The entrance fades this wrapper, and opacity below 1 flattens 3D for
         * everything under it — so perspective lives in the transform of the
         * element below (the root of the 3D scene), not as CSS `perspective`
         * up here, and the depth never snaps in when the fade ends.
         */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 64 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.1, ease: EASE, delay }}
          className="motion-reduce:!opacity-100 motion-reduce:![transform:none]"
        >
          <motion.div
            style={{ transformPerspective: 1800, rotateX, rotateY }}
            className="[transform-style:preserve-3d]"
          >
            <div className={cn("relative mx-auto [transform-style:preserve-3d]", tiltClassName, stageClassName)}>
              {/* Contact shadow on the "floor" under the main piece */}
              <div
                aria-hidden
                className="absolute inset-x-[12%] bottom-[2%] h-[22%] rounded-[50%] bg-ink/25 blur-3xl [transform:translateZ(-80px)] dark:bg-black/60"
              />
              <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
                {main}
              </div>
              {layers.map((layer, i) => (
                <Layer key={layer.id} layer={layer} index={i} delay={delay} reduceMotion={reduceMotion} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </StageContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Complete hero, with the reference demo's props                      */
/* ------------------------------------------------------------------ */

type Action = { label: string; href: string };

export type Animated3DHeroProps = {
  badge?: React.ReactNode;
  /** Wrap words in [[double brackets]] to highlight them. */
  title: string;
  subtitle?: React.ReactNode;
  primaryAction?: Action;
  secondaryAction?: Action;
  mainStageContent: React.ReactNode;
  leftFloatingWidget?: React.ReactNode;
  rightFloatingWidget?: React.ReactNode;
  /** Any further layers, placed and layered by the caller. */
  floatingWidgets?: FloatingLayer[];
  /** Painted behind everything, e.g. a pattern. */
  background?: React.ReactNode;
  /** Rendered under the stage. */
  children?: React.ReactNode;
  className?: string;
};

/** Splits "a [[b]] c" into plain and highlighted runs. */
function renderTitle(title: string) {
  return title.split(/(\[\[.+?\]\])/g).map((part, i) =>
    part.startsWith("[[") ? (
      <span key={i} className="text-curtain-ink">
        {part.slice(2, -2)}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

export function Component({
  badge,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  mainStageContent,
  leftFloatingWidget,
  rightFloatingWidget,
  floatingWidgets = [],
  background,
  children,
  className,
}: Animated3DHeroProps) {
  const layers: FloatingLayer[] = [
    ...(leftFloatingWidget
      ? [{ id: "left", node: leftFloatingWidget, className: "left-0 top-[18%] hidden lg:block", depth: 140 }]
      : []),
    ...(rightFloatingWidget
      ? [{ id: "right", node: rightFloatingWidget, className: "right-0 bottom-[12%] hidden sm:block", depth: 160 }]
      : []),
    ...floatingWidgets,
  ];

  return (
    <section className={cn("relative isolate overflow-hidden bg-canvas-alt pb-20 pt-28 sm:pt-32", className)}>
      {background}
      <div className="mx-auto max-w-[56rem] px-6 text-center">
        {badge ? (
          <p className="inline-flex items-center gap-2 rounded-full border border-canvas-border bg-surface/70 px-3.5 py-1.5 text-[0.8125rem] font-medium text-canvas-text-muted backdrop-blur">
            {badge}
          </p>
        ) : null}
        <h1 className="mt-5 text-balance font-display text-[clamp(2.25rem,4.7vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-canvas-text">
          {renderTitle(title)}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-5 max-w-[34rem] text-pretty text-[0.9375rem] leading-[1.6] text-canvas-text-muted">
            {subtitle}
          </p>
        ) : null}
        {primaryAction || secondaryAction ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {primaryAction ? (
              <Link
                href={primaryAction.href}
                className="press inline-flex h-12 items-center rounded-full bg-curtain px-6 text-[0.9375rem] font-semibold text-white transition-colors duration-200 ease-ui hover:bg-curtain-deep"
              >
                {primaryAction.label}
              </Link>
            ) : null}
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className="press inline-flex h-12 items-center rounded-full border border-canvas-text/15 px-6 text-[0.9375rem] font-semibold text-canvas-text transition-colors duration-200 ease-ui hover:border-canvas-text/30"
              >
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      <PerspectiveStage
        className="mt-12 px-4 sm:mt-16"
        stageClassName="h-[30rem] max-w-[68rem] sm:h-[34rem]"
        main={mainStageContent}
        layers={layers}
      />
      {children}
    </section>
  );
}
