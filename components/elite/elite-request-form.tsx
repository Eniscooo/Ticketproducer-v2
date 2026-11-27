"use client";

import { useState } from "react";
import { Check, Phone, Send } from "lucide-react";
import { site } from "@/lib/site";
import { clsx } from "@/lib/clsx";
import { FlowButton } from "@/components/ui/flow-button";

type Field = "name" | "email" | "phone" | "interest";
type Errors = Partial<Record<Field | "_", string>>;

/**
 * The request for TP Elite access. It asks for the minimum we need to call
 * someone back — name, a way to reach them, what they're after — and promises
 * exactly that: a call, not instant membership. The phone line stays beside it
 * as the faster route.
 */
export function EliteRequestForm() {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", phone: "", interest: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (field: Field) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [field]: event.target.value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});
    try {
      const response = await fetch("/api/elite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { ok: boolean; errors?: Errors };
      if (data.ok) {
        setStatus("sent");
        return;
      }
      setErrors(data.errors ?? { _: "Could not send that. Try again, or call the line." });
    } catch {
      setErrors({ _: "Could not send that. Try again, or call the line." });
    }
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-feature border border-white/15 bg-white/5 p-8 text-center sm:p-10">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-confirm/15 text-confirm">
          <Check aria-hidden className="h-6 w-6" />
        </span>
        <p className="mt-5 font-display text-2xl font-semibold text-white">Request received.</p>
        <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-white/70">
          Someone from the line will call you back. If it&rsquo;s urgent, call us now on{" "}
          <a href={site.contact.phoneHref} className="text-white underline underline-offset-4">
            {site.contact.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  const field = (
    name: Field,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> & { optional?: boolean } = {},
  ) => {
    const { optional, ...rest } = props;
    const id = `elite-${name}`;
    return (
      <div>
        <label htmlFor={id} className="text-[0.8125rem] font-medium text-white/80">
          {label} {optional ? <span className="text-white/45">(optional)</span> : null}
        </label>
        <input
          id={id}
          name={name}
          value={values[name]}
          onChange={set(name)}
          aria-invalid={errors[name] ? true : undefined}
          aria-describedby={errors[name] ? `${id}-error` : undefined}
          className={clsx(
            "mt-2 h-12 w-full rounded-control border bg-white/[0.06] px-4 text-[0.9375rem] text-white placeholder:text-white/35 outline-none transition-colors duration-200 ease-ui focus:border-white/50",
            errors[name] ? "border-red-300/70" : "border-white/15",
          )}
          {...rest}
        />
        {errors[name] ? (
          <p id={`${id}-error`} className="mt-1.5 text-[0.8125rem] text-red-200">
            {errors[name]}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Name", { autoComplete: "name", required: true })}
        {field("email", "Email", { type: "email", autoComplete: "email", required: true })}
      </div>
      {field("phone", "Phone", { type: "tel", autoComplete: "tel", optional: true })}

      <div>
        <label htmlFor="elite-interest" className="text-[0.8125rem] font-medium text-white/80">
          What are you after?
        </label>
        <textarea
          id="elite-interest"
          name="interest"
          rows={4}
          value={values.interest}
          onChange={set("interest")}
          placeholder="Shows you want to see, dates, how many of you — whatever helps."
          aria-invalid={errors.interest ? true : undefined}
          aria-describedby={errors.interest ? "elite-interest-error" : undefined}
          className={clsx(
            "mt-2 w-full resize-y rounded-control border bg-white/[0.06] px-4 py-3 text-[0.9375rem] text-white placeholder:text-white/35 outline-none transition-colors duration-200 ease-ui focus:border-white/50",
            errors.interest ? "border-red-300/70" : "border-white/15",
          )}
        />
        {errors.interest ? (
          <p id="elite-interest-error" className="mt-1.5 text-[0.8125rem] text-red-200">
            {errors.interest}
          </p>
        ) : null}
      </div>

      {errors._ ? (
        <p role="alert" className="text-[0.875rem] text-red-200">
          {errors._}
        </p>
      ) : null}

      <div className="flex flex-row flex-wrap items-center gap-2.5 pt-1 sm:gap-3">
        <FlowButton type="submit" disabled={status === "sending"} tone="light" icon={Send}>
          {status === "sending" ? "Sending…" : "Request access"}
        </FlowButton>
        <FlowButton href={site.contact.phoneHref} tone="light" icon={Phone}>
          Call {site.contact.phone}
        </FlowButton>
      </div>
      <p className="text-[0.8125rem] text-white/50">We&rsquo;ll call you back to talk it through. Access is confirmed by phone.</p>
    </form>
  );
}
