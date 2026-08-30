"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Field, FormError, PasswordField, inputClass } from "./auth-fields";
import { validateSignIn, type FieldErrors, type SignInFields } from "@/lib/auth";

type Status = "idle" | "sending";

const EMPTY: SignInFields = { email: "", password: "" };

/**
 * Portal sign-in.
 *
 * The form is real — it validates, posts to `/api/auth/sign-in`, and reports
 * exactly what came back. What is behind the route is not: there is no
 * credential store yet, so every attempt returns the same 401 a real backend
 * gives for details that don't match, and the message points at requesting
 * access instead. See the route for the seam and what replacing it involves.
 *
 * Field errors clear as soon as the field is touched, so a correction is
 * acknowledged while it is being typed rather than only on the next submit.
 */
export function SignInForm() {
  const [fields, setFields] = useState<SignInFields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<keyof SignInFields>>({});
  const [formError, setFormError] = useState<string>();
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const setField = (key: keyof SignInFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
    setFormError(undefined);
  };

  /** Send focus to the first offending field so keyboard users aren't stranded. */
  const focusFirst = (found: FieldErrors<keyof SignInFields>) => {
    const key = Object.keys(found).find((name) => name !== "_");
    if (key) formRef.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;

    const found = validateSignIn(fields);
    setErrors(found);
    setFormError(undefined);

    if (Object.keys(found).length > 0) {
      focusFirst(found);
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/auth/sign-in", {
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
        setFormError(whole ?? "We couldn't sign you in just now. Try again in a moment.");
        if (Object.keys(perField).length > 0) focusFirst(perField);
        /* Never leave a password sitting in a field after a rejected attempt. */
        setFields((current) => ({ ...current, password: "" }));
        return;
      }

      /*
       * Unreachable until the route can actually authenticate. When it can,
       * this is where the session lands — point it at wherever a signed-in
       * client should arrive.
       */
      router.push("/");
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setStatus("idle");
    }
  };

  const sending = status === "sending";

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      className="mt-10 space-y-5 rounded-[1.75rem] border border-canvas-border bg-surface p-7 sm:p-8"
    >
      <Field label="Email" name="email" error={errors.email}>
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
        autoComplete="current-password"
        value={fields.password}
        onChange={(value) => setField("password", value)}
        error={errors.password}
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
            Signing in
          </>
        ) : (
          "Sign In"
        )}
      </button>

      <p className="pt-1 text-center text-[0.8125rem] text-canvas-text-muted">
        <Link
          href="/services#contact"
          className="link-underline text-canvas-text hover:text-champagne"
        >
          Forgotten your password?
        </Link>
      </p>
    </form>
  );
}
