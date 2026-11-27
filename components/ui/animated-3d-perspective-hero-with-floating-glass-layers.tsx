"use client";

import * as React from "react";
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
        {/*
         * The rise is a CSS keyframe that runs from first paint (`.tp-stage-in`),
         * not a JS animation: the ticket's artwork is often the page's largest
         * element, and it no longer waits on hydration to appear.
         */}
        <div className="tp-stage-in" style={{ ["--d" as string]: `${Math.round(delay * 1000)}ms` }}>
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
        </div>
      </div>
    </StageContext.Provider>
  );
}
