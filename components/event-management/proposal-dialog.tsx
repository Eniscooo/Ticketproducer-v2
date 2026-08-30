"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { budgetRanges, calcEventTypes } from "@/lib/event-management-page";
import { site } from "@/lib/site";

const EASE = [0.16, 0.84, 0.28, 1] as const;

export type ProposalPrefill = {
  /** Display label of the event type, e.g. "Conference". */
  eventType?: string;
  guests?: number;
  budgetRange?: string;
};

type Fields = {
  eventType: string;
  date: string;
  location: string;
  guests: string;
  budgetRange: string;
  email: string;
  details: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

/** Union of the guide's titles and the calculator's labels, deduped — the field is a datalist, so anything else is allowed too. */
const EVENT_TYPE_SUGGESTIONS = Array.from(
  new Set(calcEventTypes.map((t) => t.label)),
);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.eventType.trim()) errors.eventType = "Tell us what kind of event this is.";
  if (!fields.date) errors.date = "A target date helps us answer honestly.";
  if (!fields.location.trim()) errors.location = "City or venue is enough.";

  const guests = Number(fields.guests);
  if (!fields.guests.trim()) {
    errors.guests = "Roughly how many people?";
  } else if (!Number.isFinite(guests) || guests < 1) {
    errors.guests = "Enter a guest count of at least 1.";
  }

  if (!fields.budgetRange) errors.budgetRange = "Pick the closest range.";

  if (!fields.email.trim()) {
    errors.email = "We need somewhere to send the proposal.";
  } else if (!EMAIL_PATTERN.test(fields.email.trim())) {
    errors.email = "That email address doesn't look right.";
  }

  return errors;
}

const EMPTY: Fields = {
  eventType: "",
  date: "",
  location: "",
  guests: "",
  budgetRange: "",
  email: "",
  details: "",
};

export function ProposalDialog({
  prefill,
  onClose,
}: {
  prefill: ProposalPrefill | null;
  onClose: () => void;
}) {
  const isOpen = prefill !== null;
  const reduceMotion = useReducedMotionSafe();
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Seed the form when the dialog opens. Keyed off the prefill identity rather
   * than run on every render, and reset back to empty on close so a second
   * open never shows the previous request.
   */
  const [seeded, setSeeded] = useState<ProposalPrefill | null>(null);
  if (prefill !== seeded) {
    setSeeded(prefill);
    if (prefill) {
      setFields({
        ...EMPTY,
        eventType: prefill.eventType ?? "",
        guests: prefill.guests ? String(prefill.guests) : "",
        budgetRange: prefill.budgetRange ?? "",
      });
      setErrors({});
      setStatus("idle");
      setSubmitError(null);
    }
  }

  /** Scroll lock + Escape, preserving any lock another component already owns. */
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Keep Tab inside the panel while it owns the screen.
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  /** Move focus into the panel once it's mounted. */
  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => firstFieldRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const setField = (key: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Send focus to the first offending field so keyboard users aren't stranded.
      const firstKey = Object.keys(found)[0];
      panelRef.current
        ?.querySelector<HTMLElement>(`[name="${firstKey}"]`)
        ?.focus();
      return;
    }

    setStatus("sending");
    setSubmitError(null);
    try {
      const response = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, guests: Number(fields.guests) }),
      });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      setStatus("sent");
    } catch {
      setStatus("error");
      setSubmitError(
        "We couldn't send that just now. Try again, or call the line below and we'll take the details directly.",
      );
    }
  };

  const duration = reduceMotion ? 0.01 : 0.4;

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            onClick={onClose}
            aria-hidden
            className="fixed inset-0 z-[80] bg-ink-deep/60 backdrop-blur-md"
          />

          <div className="fixed inset-0 z-[90] flex items-end justify-center overflow-y-auto overscroll-contain p-0 sm:items-center sm:p-6">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={headingId}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration, ease: EASE }}
              className={clsx(
                "relative w-full max-w-[34rem] bg-paper",
                "rounded-t-feature sm:rounded-feature",
                "border border-canvas-border shadow-[0_40px_90px_-50px_rgba(13,11,10,0.5)]",
                "max-h-[92dvh] overflow-y-auto",
              )}
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-canvas-border bg-surface/80 text-canvas-text-muted transition-colors duration-300 hover:border-champagne/50 hover:text-canvas-text"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>

              {status === "sent" ? (
                <div className="px-7 py-14 text-center sm:px-10">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-champagne/15 text-champagne">
                    <Check className="h-5 w-5" aria-hidden />
                  </span>
                  <h2
                    id={headingId}
                    className="display mt-7 text-[1.75rem] text-canvas-text sm:text-[2rem]"
                  >
                    Proposal request received.
                  </h2>
                  <p className="mx-auto mt-4 max-w-sm text-[0.9375rem] leading-[1.85] text-canvas-text-muted">
                    We&rsquo;ll review the requirements for your{" "}
                    {fields.eventType.toLowerCase() || "event"} and follow up at{" "}
                    <span className="break-anywhere font-semibold text-canvas-text">
                      {fields.email}
                    </span>{" "}
                    to talk through scope before anything is quoted.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="label mt-9 rounded-control bg-graphite px-7 py-3.5 text-linen transition-colors duration-500 ease-editorial hover:bg-graphite-dim"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="px-6 py-8 sm:px-9 sm:py-10">
                  <h2
                    id={headingId}
                    className="display pr-10 text-[1.6rem] text-canvas-text sm:text-[1.9rem]"
                  >
                    {fields.eventType
                      ? `Planning ${withArticle(fields.eventType)}?`
                      : "Planning an event?"}
                  </h2>
                  <p className="mt-3 text-[0.9375rem] leading-[1.75] text-canvas-text-muted">
                    Tell us the shape of it. We&rsquo;ll come back with what we would
                    build around it.
                  </p>

                  <div className="mt-8 space-y-5">
                    <Field
                      label="Event type"
                      name="eventType"
                      error={errors.eventType}
                    >
                      <input
                        ref={firstFieldRef}
                        id="eventType"
                        name="eventType"
                        list="em-event-types"
                        value={fields.eventType}
                        onChange={(e) => setField("eventType", e.target.value)}
                        placeholder="Conference"
                        aria-invalid={Boolean(errors.eventType)}
                        aria-describedby={errors.eventType ? "eventType-error" : undefined}
                        className={inputClass(Boolean(errors.eventType))}
                      />
                      <datalist id="em-event-types">
                        {EVENT_TYPE_SUGGESTIONS.map((option) => (
                          <option key={option} value={option} />
                        ))}
                      </datalist>
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Date" name="date" error={errors.date}>
                        <input
                          id="date"
                          name="date"
                          type="date"
                          value={fields.date}
                          onChange={(e) => setField("date", e.target.value)}
                          aria-invalid={Boolean(errors.date)}
                          aria-describedby={errors.date ? "date-error" : undefined}
                          className={inputClass(Boolean(errors.date))}
                        />
                      </Field>

                      <Field label="Guests" name="guests" error={errors.guests}>
                        <input
                          id="guests"
                          name="guests"
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={fields.guests}
                          onChange={(e) => setField("guests", e.target.value)}
                          placeholder="250"
                          aria-invalid={Boolean(errors.guests)}
                          aria-describedby={errors.guests ? "guests-error" : undefined}
                          className={inputClass(Boolean(errors.guests))}
                        />
                      </Field>
                    </div>

                    <Field label="Location" name="location" error={errors.location}>
                      <input
                        id="location"
                        name="location"
                        value={fields.location}
                        onChange={(e) => setField("location", e.target.value)}
                        placeholder="City, or the venue if it's booked"
                        aria-invalid={Boolean(errors.location)}
                        aria-describedby={errors.location ? "location-error" : undefined}
                        className={inputClass(Boolean(errors.location))}
                      />
                    </Field>

                    <Field
                      label="Budget range"
                      name="budgetRange"
                      error={errors.budgetRange}
                    >
                      <select
                        id="budgetRange"
                        name="budgetRange"
                        value={fields.budgetRange}
                        onChange={(e) => setField("budgetRange", e.target.value)}
                        aria-invalid={Boolean(errors.budgetRange)}
                        aria-describedby={
                          errors.budgetRange ? "budgetRange-error" : undefined
                        }
                        className={inputClass(Boolean(errors.budgetRange))}
                      >
                        <option value="">Select a range</option>
                        {budgetRanges.map((range) => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Email" name="email" error={errors.email}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={fields.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="you@company.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={inputClass(Boolean(errors.email))}
                      />
                    </Field>

                    <Field
                      label="Additional details"
                      name="details"
                      optional
                      error={undefined}
                    >
                      <textarea
                        id="details"
                        name="details"
                        rows={3}
                        value={fields.details}
                        onChange={(e) => setField("details", e.target.value)}
                        placeholder="Anything else we should know — venue constraints, run of show, existing team."
                        className={clsx(inputClass(false), "resize-y")}
                      />
                    </Field>
                  </div>

                  {status === "error" && submitError ? (
                    <p
                      role="alert"
                      className="mt-6 rounded-badge border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-sm leading-relaxed text-burgundy"
                    >
                      {submitError}{" "}
                      <a
                        href={site.contact.phoneHref}
                        className="font-semibold underline"
                      >
                        {site.contact.phone}
                      </a>
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="label mt-8 w-full rounded-control bg-graphite px-7 py-4 text-linen transition-colors duration-500 ease-editorial hover:bg-graphite-dim disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Send Proposal Request"}
                  </button>
                  <p className="mt-4 text-center text-xs leading-relaxed text-taupe">
                    We&rsquo;ll only use these details to prepare your proposal.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * The stored event types are all countable singulars, so this only has to pick
 * the article. Free text typed by the visitor may not fit the pattern — a wrong
 * "a" in a heading is a better failure than blocking their own wording.
 */
function withArticle(noun: string) {
  return /^[aeiou]/i.test(noun.trim()) ? `an ${noun}` : `a ${noun}`;
}

function inputClass(hasError: boolean) {
  return clsx(
    "ds-input mt-2",
    "focus:border-champagne",
    hasError ? "border-champagne" : "",
  );
}

function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="label flex items-center gap-2 text-taupe">
        {label}
        {optional ? (
          <span className="normal-case tracking-normal text-taupe/60">(optional)</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-2 text-xs text-burgundy">
          {error}
        </p>
      ) : null}
    </div>
  );
}
