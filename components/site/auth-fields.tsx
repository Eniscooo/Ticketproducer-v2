"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { clsx } from "@/lib/clsx";

/**
 * The bits both auth forms share: a labelled field wrapper, the input class,
 * and a password input that can be unmasked.
 *
 * These mirror the pattern the proposal dialog established — `label` over a
 * `ds-input`, error text beneath in burgundy — rather than inventing a second
 * form language for this route.
 */

export function inputClass(hasError: boolean) {
  return clsx("ds-input mt-2", "focus:border-champagne", hasError && "border-burgundy");
}

export function Field({
  label,
  name,
  error,
  hint,
  optional,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  /** Standing guidance, shown until an error replaces it. */
  hint?: string;
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
      ) : hint ? (
        <p id={`${name}-hint`} className="mt-2 text-xs text-taupe">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Password input with a reveal toggle.
 *
 * The toggle is a real button rather than a `type` swap on click-and-hold, so
 * it is reachable from the keyboard; it is excluded from the tab order only in
 * the sense that it sits after the input, where it belongs. `aria-pressed`
 * carries the state, and the label changes with it, because an icon alone does
 * not say which way the switch is currently thrown.
 */
export function PasswordField({
  label,
  name,
  value,
  onChange,
  error,
  hint,
  autoComplete,
  placeholder = "••••••••••••",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  autoComplete: "current-password" | "new-password";
  placeholder?: string;
}) {
  const [shown, setShown] = useState(false);
  const hintId = useId();
  const describedBy = error ? `${name}-error` : hint ? hintId : undefined;

  return (
    <div>
      <label htmlFor={name} className="label block text-taupe">
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={shown ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={clsx(inputClass(Boolean(error)), "pr-12")}
        />

        <button
          type="button"
          onClick={() => setShown((current) => !current)}
          aria-pressed={shown}
          aria-label={shown ? "Hide password" : "Show password"}
          className="absolute right-1 top-2 flex h-10 w-10 items-center justify-center rounded-control text-taupe transition-colors duration-300 ease-editorial hover:text-canvas-text"
        >
          {shown ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>

      {error ? (
        <p id={`${name}-error`} className="mt-2 text-xs text-burgundy">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-xs text-taupe">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Submission-level failure — the one the route returned, or the network giving
 * out. Announced politely so it reaches a screen reader without stealing focus
 * mid-correction.
 */
export function FormError({ children }: { children?: string }) {
  return (
    <p
      aria-live="polite"
      className={clsx(
        "text-[0.8125rem] leading-relaxed text-burgundy transition-opacity duration-300",
        children ? "opacity-100" : "sr-only opacity-0",
      )}
    >
      {children}
    </p>
  );
}
