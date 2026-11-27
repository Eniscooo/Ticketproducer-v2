"use client";

import { useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { Check, KeyRound, Star } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

/**
 * Three-tier pricing, adapted from the pasted shadcn "Pricing" block for the
 * site's dark TP Elite room:
 *  - the side cards lean in toward the centre in 3D on desktop, and the most
 *    requested tier stands forward;
 *  - prices roll with NumberFlow when the billing period changes, and turning
 *    on annual billing throws a small burst of confetti in the brand's white
 *    and curtain red;
 *  - buttons are the site's FlowButton.
 *
 * Honest by construction, and true to the brief ("invite-only / by request —
 * not a generic pricing tier"): while prices are `null` the cards read as
 * levels of access — "By invitation", no badge, no price slot — and the billing toggle (with its savings line, computed from the
 * real numbers) only appears once every tier has both prices.
 */

export type PricingPlan = {
  name: string;
  /** Per-month price when billed monthly; `null` until it's set. */
  monthly: number | null;
  /** Per-month price when billed annually; `null` until it's set. */
  yearly: number | null;
  description: string;
  features: string[];
  cta: string;
  href: string;
  isPopular?: boolean;
};

export function Pricing({
  plans,
  title,
  description,
  currency = "USD",
}: {
  plans: PricingPlan[];
  title: string;
  description?: string;
  currency?: string;
}) {
  const [annual, setAnnual] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);
  const switchId = useId();

  const priced = plans.every((p) => p.monthly !== null && p.yearly !== null);
  // The largest real saving across tiers, for the toggle's label.
  const saving = priced
    ? Math.max(...plans.map((p) => Math.round((1 - (p.yearly as number) / (p.monthly as number)) * 100)))
    : 0;

  const onToggle = (checked: boolean) => {
    setAnnual(checked);
    if (!checked || !switchRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = switchRef.current.getBoundingClientRect();
    confetti({
      particleCount: 40,
      spread: 55,
      origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
      colors: ["#ffffff", "#e6e6e6", "#7b1e2b"],
      ticks: 180,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 26,
      shapes: ["circle"],
      disableForReducedMotion: true,
    });
  };

  return (
    <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="label text-white/60">{priced ? "Membership" : "Levels of access"}</p>
        <h2 className="mt-4 text-balance font-display text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-white">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-white/65">{description}</p>
        ) : null}
      </div>

      {priced ? (
        <div className="mt-10 flex items-center justify-center gap-3">
          <label htmlFor={switchId} className="text-[0.875rem] font-medium text-white/80">
            Monthly
          </label>
          <Switch id={switchId} ref={switchRef} checked={annual} onCheckedChange={onToggle} aria-label="Bill annually" />
          <span className="text-[0.875rem] font-medium text-white/80">
            Annual{saving > 0 ? <span className="ml-1.5 text-white">(save up to {saving}%)</span> : null}
          </span>
        </div>
      ) : null}

      <div className="mt-14 grid grid-cols-1 gap-4 [perspective:1600px] md:grid-cols-3">
        {plans.map((plan, index) => {
          const price = annual ? plan.yearly : plan.monthly;
          const side = index === 0 ? "left" : index === plans.length - 1 ? "right" : "centre";
          return (
            <motion.div
              key={plan.name}
              initial={{ y: 40, opacity: 0 }}
              whileInView={
                isDesktop
                  ? {
                      y: plan.isPopular ? -20 : 0,
                      opacity: 1,
                      x: side === "right" ? -24 : side === "left" ? 24 : 0,
                      scale: side === "centre" ? 1 : 0.95,
                      rotateY: side === "left" ? 8 : side === "right" ? -8 : 0,
                    }
                  : { y: 0, opacity: 1 }
              }
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ type: "spring", stiffness: 100, damping: 30, delay: 0.15 * index, opacity: { duration: 0.5 } }}
              className={cn(
                "relative flex flex-col rounded-feature p-7 text-center sm:p-8 motion-reduce:!transform-none motion-reduce:!opacity-100",
                plan.isPopular
                  ? "z-10 bg-white/[0.07] ring-2 ring-inset ring-white/60 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]"
                  : "z-0 bg-white/[0.03] ring-1 ring-inset ring-white/12",
                side === "left" && "md:origin-right",
                side === "right" && "md:origin-left",
              )}
            >
              {plan.isPopular && priced ? (
                <span className="absolute right-0 top-0 inline-flex items-center gap-1 rounded-bl-xl rounded-tr-[1.65rem] bg-white px-3 py-1 text-[0.75rem] font-semibold text-ink">
                  <Star aria-hidden className="h-3.5 w-3.5 fill-current" />
                  Most requested
                </span>
              ) : null}

              <p className="label text-white/70">{plan.name}</p>

              <div className="mt-6 flex min-h-[3.5rem] items-end justify-center gap-x-2">
                {price !== null ? (
                  <>
                    <span className="font-display text-5xl font-bold tracking-tight text-white tabular-nums">
                      <NumberFlow
                        value={price}
                        format={{ style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                        transformTiming={{ duration: 500, easing: "ease-out" }}
                        willChange
                      />
                    </span>
                    <span className="pb-1.5 text-sm font-semibold text-white/60">/ month</span>
                  </>
                ) : (
                  <span className="font-display text-[1.75rem] font-semibold tracking-tight text-white">By invitation</span>
                )}
              </div>
              <p className="mt-1 text-xs text-white/50">
                {price !== null ? (annual ? "billed annually" : "billed monthly") : "confirmed on your introduction call"}
              </p>

              <ul className="mt-7 flex flex-1 flex-col gap-2.5 border-t border-white/10 pt-6 text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[0.9375rem] text-white/85">
                    <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-white" />
                    {feature}
                  </li>
                ))}
              </ul>

              <FlowButton href={plan.href} tone="light" icon={KeyRound} fullWidth className="mt-8">
                {plan.cta}
              </FlowButton>
              <p className="mt-5 text-xs leading-5 text-white/55">{plan.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
