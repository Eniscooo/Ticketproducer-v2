import { budgetRanges } from "@/lib/event-management-page";
import { site } from "@/lib/site";

/**
 * Proposal requests from the Event Management page.
 *
 * There is no email or CRM infrastructure in this project yet, so this handler
 * deliberately stops at "validated and recorded": it re-checks everything the
 * client checked (a client-side guard is a UX affordance, not a boundary) and
 * writes the request to the server log.
 *
 * TO CONNECT: replace the `deliver()` body with the real transport — a
 * transactional email provider, a CRM webhook, or an internal queue — reading
 * its credentials from environment variables. The route already returns the
 * shape the dialog expects, so nothing on the client needs to change.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  eventType: 120,
  location: 200,
  email: 254,
  details: 4000,
} as const;

export type ProposalRequest = {
  eventType: string;
  date: string;
  location: string;
  guests: number;
  budgetRange: string;
  email: string;
  details: string;
};

function badRequest(errors: Record<string, string>) {
  return Response.json({ ok: false, errors }, { status: 400 });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest({ _: "Expected a JSON body." });
  }

  if (typeof payload !== "object" || payload === null) {
    return badRequest({ _: "Expected a JSON object." });
  }

  const body = payload as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const str = (key: keyof typeof LIMITS | "date" | "budgetRange") =>
    typeof body[key] === "string" ? (body[key] as string).trim() : "";

  const eventType = str("eventType");
  const date = str("date");
  const location = str("location");
  const email = str("email");
  const details = str("details");
  const budgetRange = str("budgetRange");
  const guests = Number(body.guests);

  if (!eventType) errors.eventType = "Event type is required.";
  else if (eventType.length > LIMITS.eventType) errors.eventType = "Event type is too long.";

  // Accept any parseable date; the form supplies ISO yyyy-mm-dd.
  if (!date || Number.isNaN(Date.parse(date))) errors.date = "A valid date is required.";

  if (!location) errors.location = "Location is required.";
  else if (location.length > LIMITS.location) errors.location = "Location is too long.";

  if (!Number.isFinite(guests) || guests < 1 || guests > 1_000_000) {
    errors.guests = "Guest count must be a number of at least 1.";
  }

  if (!budgetRanges.some((range) => range.value === budgetRange)) {
    errors.budgetRange = "Select one of the listed budget ranges.";
  }

  if (!email || !EMAIL_PATTERN.test(email)) errors.email = "A valid email is required.";
  else if (email.length > LIMITS.email) errors.email = "Email is too long.";

  if (details.length > LIMITS.details) errors.details = "Additional details are too long.";

  if (Object.keys(errors).length > 0) return badRequest(errors);

  const proposal: ProposalRequest = {
    eventType,
    date,
    location,
    guests: Math.round(guests),
    budgetRange,
    email,
    details,
  };

  try {
    await deliver(proposal);
  } catch (error) {
    console.error("[proposal] delivery failed", error);
    return Response.json(
      { ok: false, errors: { _: "Could not record the request." } },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}

/**
 * The single integration point. Until a transport is wired up this records the
 * request server-side so nothing submitted by a visitor is silently dropped.
 */
async function deliver(proposal: ProposalRequest) {
  const rangeLabel =
    budgetRanges.find((r) => r.value === proposal.budgetRange)?.label ??
    proposal.budgetRange;

  // One string rather than extra console args — structured dev loggers drop
  // trailing arguments, which made submitted details look like they vanished.
  console.info(
    `[proposal] ${proposal.eventType} · ${proposal.date} · ${proposal.location} · ` +
      `${proposal.guests} guests · ${rangeLabel} · reply-to ${proposal.email} · ` +
      `route to ${site.contact.email}` +
      (proposal.details ? ` · details: ${proposal.details}` : " · no extra details"),
  );
}
