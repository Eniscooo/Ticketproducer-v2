"use client";

import { useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Field, FormError, PasswordField, inputClass } from "./auth-fields";
import { LIMITS, validateSignUp, type FieldErrors, type SignUpFields } from "@/lib/auth";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent";

const EMPTY: SignUpFields = {
  name: "",
  company: "",
  email: "",
  password: "",
  confirm: "",
};

/**
 * Access request for the client portal.
 *
 * Ticket Producer's accounts belong to producers, venues, and TP Elite members,
 * so this is a request rather than a self-serve signup — and the success panel
 * says so. `/api/auth/sign-up` validates and records the request; it does not
 * create an account, and nothing here claims it did.
 *
 * The password is collected so the account can be provisioned from the same
 * submission once a store exists, and is dropped from state the moment the
 * request is accepted.
 */
export function SignUpForm() {
  const [fields, setFields] = useState<SignUpFields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<keyof SignUpFields>>({});
  const [formError, setFormError] = useState<string>();
  const [status, setStatus] = useState<Status>("idle");
  const [sentTo, setSentTo] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const setField = (key: keyof SignUpFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
    setFormError(undefined);
  };

  /** Send focus to the first offending field so keyboard users aren't stranded. */
  const focusFirst = (found: FieldErrors<keyof SignUpFields>) => {
    const key = Object.keys(found).find((name) => name !== "_");
    if (key) formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;

    const found = validateSignUp(fields);
    setErrors(found);
    setFormError(undefined);

    if (Object.keys(found).length > 0) {
      focusFirst(found);
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      const data: { ok?: boolean; errors?: Record<string, string> } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        const { _: whole, ...perField } = data.errors ?? {};
        setErrors(perField);
        setFormError(whole ?? "We couldn't send that just now. Try again in a moment.");
        if (Object.keys(perField).length > 0) focusFirst(perField);
        setStatus("idle");
        return;
      }

      /* Keep the address for the confirmation copy; drop the credentials. */
      setSentTo(fields.email.trim());
      setFields(EMPTY);
      setStatus("sent");
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div className="mt-10 rounded-[1.75rem] border border-canvas-border bg-surface p-7 text-center sm:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-champagne/15 text-champagne">
          <Check className="h-5 w-5" aria-hidden />
        </span>

        <h2 className="display mt-7 text-[1.6rem] text-canvas-text sm:text-[1.9rem]">
          Request received.
        </h2>

        <p className="mx-auto mt-4 max-w-sm text-[0.9375rem] leading-[1.85] text-canvas-text-muted">
          We&rsquo;ll verify the details and open the account from our end, then confirm
          at{" "}
          <span className="break-anywhere font-semibold text-canvas-text">{sentTo}</span>.
          Accounts are provisioned by hand, so this is a person reading it, not a
          welcome email.
        </p>

        <p className="mt-6 text-[0.8125rem] text-taupe">
          Need it sooner?{" "}
          <a
            href={site.contact.phoneHref}
            className="link-underline font-semibold text-canvas-text hover:text-champagne"
          >
            {site.contact.phone}
          </a>
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      className="mt-10 space-y-5 rounded-[1.75rem] border border-canvas-border bg-surface p-7 sm:p-8"
    >
      <Field label="Full name" name="name" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={fields.name}
          onChange={(event) => setField("name", event.target.value)}
          placeholder="Jordan Ellis"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputClass(Boolean(errors.name))}
        />
      </Field>

      <Field label="Organisation" name="company" error={errors.company} optional>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          value={fields.company}
          onChange={(event) => setField("company", event.target.value)}
          placeholder="Venue, promoter, or production company"
          aria-invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? "company-error" : undefined}
          className={inputClass(Boolean(errors.company))}
        />
      </Field>

      <Field label="Work email" name="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={(event) => setField("email", event.target.value)}
          placeholder="you@company.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClass(Boolean(errors.email))}
        />
      </Field>

      <PasswordField
        label="Password"
        name="password"
        autoComplete="new-password"
        value={fields.password}
        onChange={(value) => setField("password", value)}
        error={errors.password}
        hint={`At least ${LIMITS.passwordMin} characters. Length beats punctuation — a phrase you'll remember is stronger than a short scramble.`}
      />

      <PasswordField
        label="Confirm password"
        name="confirm"
        autoComplete="new-password"
        value={fields.confirm}
        onChange={(value) => setField("confirm", value)}
        error={errors.confirm}
      />

      <FormError>{formError}</FormError>

      <button
        type="submit"
        disabled={sending}
        className="ds-btn-primary w-full py-4 disabled:pointer-events-none disabled:opacity-70"
      >
        {sending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            Sending request
          </>
        ) : (
          "Sign up"
        )}
      </button>

      <p className="pt-1 text-center text-[0.75rem] leading-relaxed text-taupe">
        Accounts are opened by hand for producers, venues, and TP Elite clients — we
        confirm the details before anything goes live.
      </p>
    </form>
  );
}
