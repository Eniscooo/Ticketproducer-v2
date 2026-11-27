"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Loader2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { trSubscribe } from "@/lib/ticket-resale-page";
import { FlowButton } from "@/components/ui/flow-button";
import { Mail } from "lucide-react";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Drop-alert signup. The client guard is an affordance, not a boundary — the
 * route re-validates — and the button reports its own state rather than
 * silently swallowing a failure.
 *
 * The email is posted to /api/subscribe, which validates and logs it: there is
 * no list provider wired up yet, so the section promises only what the backend
 * can actually keep. See the route for what to replace.
 */
export function TrSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const submit = async (formEvent: React.FormEvent) => {
    formEvent.preventDefault();
    if (status === "sending") return;

    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("error");
      setMessage("That doesn't look like an email address.");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("done");
      setMessage("You're on the list. We'll only write when it matters.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again, or call the line below.");
    }
  };

  return (
    <section id="subscribe" className="scroll-mt-28 bg-paper pb-10 pt-6 sm:pb-12">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-card bg-graphite px-7 py-12 sm:px-12 sm:py-16">
            <Image
              src="/nyc/skyline-mono.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 75rem, 100vw"
              className="-z-10 object-cover object-[50%_45%] opacity-30"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-r from-graphite via-graphite/85 to-graphite/70"
            />

            <div className="max-w-xl">
              <p className="label label-champagne">{trSubscribe.label}</p>

              <h2 className="ds-display mt-4 text-[clamp(1.75rem,3.6vw,2.5rem)] text-white">
                {trSubscribe.headline}
              </h2>

              <p className="ds-body mt-4 text-linen/70">{trSubscribe.body}</p>

              <form onSubmit={submit} className="mt-8 flex flex-col gap-2.5 sm:flex-row">
                <label className="sr-only" htmlFor="subscribe-email">
                  Email address
                </label>
                <input
                  id="subscribe-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder={trSubscribe.placeholder}
                  aria-invalid={status === "error"}
                  className="min-w-0 flex-1 rounded-control border border-white/20 bg-white/10 px-4 py-3.5 text-[0.9375rem] text-white outline-none transition-colors duration-300 ease-editorial placeholder:text-linen/45 focus-visible:border-champagne"
                />
                <FlowButton type="submit" disabled={status === "sending"} tone="light" icon={Mail}>
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                      Subscribing
                    </>
                  ) : status === "done" ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden />
                      Subscribed
                    </>
                  ) : (
                    trSubscribe.cta
                  )}
                </FlowButton>
              </form>

              <p
                aria-live="polite"
                className={`ds-body mt-3.5 ${status === "error" ? "text-burgundy" : "text-linen/45"}`}
              >
                {message || trSubscribe.note}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
