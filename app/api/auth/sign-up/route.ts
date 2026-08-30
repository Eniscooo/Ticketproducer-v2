import { validateSignUp, type SignUpFields } from "@/lib/auth";
import { site } from "@/lib/site";

/**
 * Access requests for the client portal.
 *
 * Same posture as the proposal and subscribe routes: there is no account store
 * in this project yet, so this handler stops at "validated and recorded". It
 * re-checks everything the form checked and writes the request to the server
 * log, which is why the page promises a follow-up rather than an account —
 * nothing here creates one, and the copy should not say it did.
 *
 * TO CONNECT:
 *   1. Hash the password with a slow, salted KDF (argon2id or bcrypt) the
 *      moment it arrives, and let the plaintext go out of scope.
 *   2. Insert the account against a UNIQUE constraint on the address, and
 *      handle the conflict as a *success* on the client — see below.
 *   3. Send a verification email; leave the account unusable until it is
 *      confirmed.
 *   4. Rate-limit, as with sign-in.
 *
 * On (2): when the address is already registered, still return `ok`. Telling an
 * unauthenticated caller "that email is taken" hands them a way to enumerate
 * who holds an account. Send the existing holder a "someone tried to register
 * your address" email instead, and let the response look identical.
 *
 * The submitted password is never logged.
 */

type AccessRequest = {
  name: string;
  company: string;
  email: string;
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
  const str = (key: keyof SignUpFields) =>
    typeof body[key] === "string" ? (body[key] as string) : "";

  const fields: SignUpFields = {
    name: str("name"),
    company: str("company"),
    email: str("email"),
    password: str("password"),
    confirm: str("confirm"),
  };

  /* Re-checks what the form checked: a client-side guard is UX, not a boundary. */
  const errors = validateSignUp(fields);
  if (Object.keys(errors).length > 0) {
    return invalid(errors as Record<string, string>, 422);
  }

  try {
    await record({
      name: fields.name.trim(),
      company: fields.company.trim(),
      email: fields.email.trim().toLowerCase(),
    });
  } catch (error) {
    console.error("[auth] could not record access request", error);
    return invalid({ _: "Could not record that request. Try again in a moment." }, 502);
  }

  return Response.json({ ok: true });
}

/**
 * The single integration point. Until an account store exists this records the
 * request server-side so nothing a visitor submits is silently dropped.
 *
 * Takes `AccessRequest`, which has no password field — the plaintext is not
 * passed in here, so it cannot end up in a log line by accident.
 */
async function record(access: AccessRequest) {
  // One string rather than extra console args — structured dev loggers drop
  // trailing arguments, which made submitted details look like they vanished.
  console.info(
    `[auth] access requested by ${access.name} <${access.email}>` +
      (access.company ? ` · ${access.company}` : " · no organisation given") +
      ` · route to ${site.contact.email}`,
  );
}
