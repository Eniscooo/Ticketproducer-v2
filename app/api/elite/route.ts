import { checkEmail } from "@/lib/auth";
import { site } from "@/lib/site";

/**
 * TP Elite access requests, from the form on /elite.
 *
 * Same posture as the support, proposal and subscribe routes: no inbox or CRM
 * is wired up yet, so this stops at "validated and recorded". The form promises
 * a call back, not instant access — membership is still granted by
 * conversation, and nothing here can grant it.
 *
 * TO CONNECT: replace `record()` with the real transport (shared inbox, CRM,
 * Slack webhook). The response shape is what the form expects, so nothing on
 * the client needs to change. Rate-limit it at the same time: it is an
 * unauthenticated endpoint that accepts free text.
 */

const MAX_TEXT = 2000;

type EliteRequest = {
  name: string;
  email: string;
  phone: string;
  interest: string;
};

function invalid(errors: Record<string, string>, status: number) {
  return Response.json({ ok: false, errors }, { status });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return invalid({ _: "Expected a JSON body." }, 400);
  }
  if (typeof payload !== "object" || payload === null) {
    return invalid({ _: "Expected a JSON object." }, 400);
  }

  const body = payload as Record<string, unknown>;
  const text = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim() : "");
  const name = text("name");
  const email = text("email");
  const phone = text("phone");
  const interest = text("interest");

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Tell us who to ask for.";
  else if (name.length > 120) errors.name = "That name is too long.";
  const emailError = checkEmail(email);
  if (emailError) errors.email = emailError;
  if (phone && !/^[+()\d\s.-]{7,24}$/.test(phone)) errors.phone = "That doesn't look like a phone number.";
  if (!interest) errors.interest = "Say a little about what you're after.";
  else if (interest.length > MAX_TEXT) errors.interest = "That's a little long — the call is the place for detail.";

  if (Object.keys(errors).length > 0) return invalid(errors, 422);

  try {
    await record({ name, email: email.toLowerCase(), phone, interest });
  } catch (error) {
    console.error("[elite] could not record request", error);
    return invalid({ _: "Could not send that. Try again, or call the line." }, 502);
  }

  return Response.json({ ok: true });
}

/** The single integration point. Until an inbox exists this records the request server-side. */
async function record({ name, email, phone, interest }: EliteRequest) {
  console.info(
    `[elite] access request from ${name} <${email}>${phone ? ` · ${phone}` : ""} · route to ${site.contact.email} · ${interest}`,
  );
}
