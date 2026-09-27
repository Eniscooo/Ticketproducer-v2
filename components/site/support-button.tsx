"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headset, Maximize2, Minimize2, Phone, SendHorizontal, X } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { IconSwap } from "@/components/ui/primitives";
import { checkEmail } from "@/lib/auth";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { site } from "@/lib/site";

const EASE = [0.16, 0.84, 0.28, 1] as const;

type Turn = { id: number; from: "us" | "you"; text: string };

/**
 * What the thread is waiting on. The widget collects a message first and an
 * address second, because asking for an email before someone has said anything
 * is the fastest way to get no message at all.
 */
type Phase = "message" | "email" | "sending" | "open-thread";

const OPENING: Turn = {
  id: 0,
  from: "us",
  text: "Hi — there's a person on the other end of this, not a bot. Tell us what you need and we'll come back to you by email, usually within one business day.",
};

/**
 * Customer service, reachable from every route.
 *
 * Deliberately honest about what it is: an **asynchronous** message form
 * wearing a chat interface. `/api/support` records a message and a reply-to
 * address; nobody is typing back in real time, and no line of copy in here
 * suggests otherwise — the opening turn says by email, within a business day,
 * and the phone number is offered for anything that cannot wait. A live-chat
 * bubble over an inbox nobody is watching is worse than no bubble at all.
 *
 * Sits above the ticket-resale category rail (`z-30`) and below the nav
 * (`z-50`) and every dialog and sheet (`z-70` and up), so it can never cover
 * something modal that has taken the screen.
 */
export function SupportButton() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([OPENING]);
  const [phase, setPhase] = useState<Phase>("message");
  const [draft, setDraft] = useState("");
  /** Held once given, so a second question doesn't ask for it again. */
  const [replyTo, setReplyTo] = useState("");
  const [pending, setPending] = useState("");

  const reduceMotion = useReducedMotionSafe();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  const say = (from: Turn["from"], text: string) =>
    setTurns((current) => [...current, { id: nextId.current++, from, text }]);

  /* Escape closes the panel; a click outside it does too. */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /* Keep the newest turn in view. No state is set here, so this stays a plain effect. */
  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ block: "end", behavior: reduceMotion ? "auto" : "smooth" });
  }, [turns, open, expanded, reduceMotion]);

  const send = async (email: string, message: string) => {
    setPhase("sending");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      const data: { ok?: boolean; errors?: Record<string, string> } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        say(
          "us",
          data.errors?._ ??
            data.errors?.email ??
            data.errors?.message ??
            "That didn't go through. Try again, or call the line above.",
        );
        setPhase(replyTo ? "open-thread" : "email");
        return;
      }

      setReplyTo(email);
      say("us", `Got it — we'll reply to ${email}. Anything else in the meantime?`);
      setPhase("open-thread");
    } catch {
      say("us", "We couldn't reach the server. Check your connection, or call the line above.");
      setPhase(replyTo ? "open-thread" : "email");
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const value = draft.trim();
    if (!value || phase === "sending") return;

    say("you", value);
    setDraft("");

    if (phase === "message") {
      setPending(value);
      say("us", "Thanks. What's the best email to reach you on?");
      setPhase("email");
      return;
    }

    if (phase === "email") {
      const problem = checkEmail(value);
      if (problem) {
        say("us", `${problem} What's the best address to reach you on?`);
        return;
      }
      void send(value, pending);
      return;
    }

    /* Thread is open and the address is known — send straight through. */
    void send(replyTo, value);
  };

  const placeholder =
    phase === "email" ? "you@company.com" : phase === "sending" ? "Sending…" : "Ask us anything…";

  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end sm:bottom-6 sm:right-6"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-label="Customer service"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.26, ease: EASE }}
            style={{ transformOrigin: "bottom right" }}
            className={clsx(
              "mb-3 flex flex-col overflow-hidden rounded-feature bg-surface shadow-[0_40px_80px_-32px_rgba(23,23,22,0.55)]",
              /* No breakpoint-scoped `auto` width here. Both branches below set an explicit
                 `sm:w-*`, and Tailwind emits the named `auto` utility *after* arbitrary-value
                 widths — same specificity, later in the sheet, so it silently won
                 and the panel sized to its content at every width above 640px.
                 That is what kept it wide however small the number was set.
                 (Class name omitted on purpose: Tailwind scans comments as
                 source, so spelling it here regenerates the dead utility.) */
              "w-[calc(100vw-2rem)]",
              expanded
                ? "h-[min(42rem,calc(100dvh-7rem))] sm:h-[min(40rem,calc(100dvh-8rem))] sm:w-[18rem]"
                : "h-[min(36rem,calc(100dvh-7rem))] sm:h-[min(34rem,calc(100dvh-8rem))] sm:w-[15rem]",
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-graphite px-4 py-3.5 text-white sm:gap-2 sm:px-3 sm:py-2.5">
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne/20 text-champagne sm:h-8 sm:w-8"
              >
                <Headset className="h-5 w-5 sm:h-4 sm:w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.9375rem] font-semibold leading-tight sm:text-[0.8125rem]">
                  {site.name}
                </p>
                <p className="mt-0.5 truncate text-[0.75rem] text-linen/60 sm:text-[0.6875rem]">
                  Replies within a business day
                </p>
              </div>

              <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                aria-label={expanded ? "Shrink" : "Expand"}
                className="hidden h-7 w-7 items-center justify-center rounded-full text-linen/70 transition-colors duration-300 ease-editorial hover:bg-white/10 hover:text-white sm:flex"
              >
                {expanded ? (
                  <Minimize2 className="h-4 w-4" aria-hidden />
                ) : (
                  <Maximize2 className="h-4 w-4" aria-hidden />
                )}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-full text-linen/70 transition-colors duration-300 ease-editorial hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {/* Anything that can't wait for an email */}
            <a
              href={site.contact.phoneHref}
              className="flex items-center gap-2 bg-canvas-alt px-4 py-2.5 text-[0.8125rem] text-canvas-text-muted transition-colors duration-300 ease-editorial hover:text-canvas-text sm:px-3.5 sm:py-2 sm:text-[0.75rem]"
            >
              <Phone className="h-3.5 w-3.5 shrink-0 text-champagne" aria-hidden />
              Urgent? Call {site.contact.phone}
            </a>

            {/* Thread */}
            <div
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              {turns.map((turn) => (
                <div
                  key={turn.id}
                  className={clsx("flex", turn.from === "you" ? "justify-end" : "justify-start")}
                >
                  <p
                    className={clsx(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.875rem] leading-relaxed sm:px-3 sm:py-2 sm:text-[0.8125rem]",
                      turn.from === "you"
                        ? "bg-graphite text-white"
                        : "bg-canvas-alt text-canvas-text",
                    )}
                  >
                    {turn.text}
                  </p>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Composer */}
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-canvas-border p-2.5"
            >
              <label className="sr-only" htmlFor="support-draft">
                {phase === "email" ? "Your email address" : "Your message"}
              </label>
              <input
                id="support-draft"
                name="support-draft"
                type={phase === "email" ? "email" : "text"}
                autoComplete={phase === "email" ? "email" : "off"}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={phase === "sending"}
                placeholder={placeholder}
                className="min-w-0 flex-1 rounded-ds-pill bg-canvas-alt px-4 py-2.5 text-[0.875rem] text-canvas-text outline-none transition-colors duration-300 placeholder:text-taupe/70 focus:bg-canvas-alt/70 disabled:opacity-60 sm:px-3.5 sm:py-2 sm:text-[0.8125rem]"
              />
              <button
                type="submit"
                disabled={!draft.trim() || phase === "sending"}
                aria-label="Send"
                className="pressable flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-graphite text-white hover:bg-graphite-dim disabled:pointer-events-none disabled:opacity-40 sm:h-8 sm:w-8"
              >
                <SendHorizontal className="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={open ? "Close customer service" : "Customer service"}
        className={clsx(
          "pressable flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_18px_40px_-16px_rgba(23,23,22,0.6)] sm:h-11 sm:w-11",
          open ? "bg-graphite-dim" : "bg-graphite hover:bg-graphite-dim",
        )}
      >
        <IconSwap
          active={open}
          className="h-[1.35rem] w-[1.35rem] sm:h-[1.1rem] sm:w-[1.1rem]"
          off={<Headset className="h-[1.35rem] w-[1.35rem] sm:h-[1.1rem] sm:w-[1.1rem]" />}
          on={<X className="h-5 w-5 sm:h-4 sm:w-4" />}
        />
      </button>
    </div>
  );
}
