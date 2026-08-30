/**
 * Drop-alert signups from the Ticket Resale page.
 *
 * Same posture as the proposal route: there is no email or list infrastructure
 * in this project yet, so this handler deliberately stops at "validated and
 * recorded". It re-checks what the client checked (a client-side guard is a UX
 * affordance, not a boundary) and writes the address to the server log.
 *
 * TO CONNECT: replace the `deliver()` body with the real transport — an email
 * provider's list API, a CRM webhook, or an internal queue — reading its
 * credentials from environment variables. The route already returns the shape
 * the form expects, so nothing on the client needs to change.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL = 254;

type SubscribeRequest = { email: string };

function parse(body: unknown): { email: string } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Expected a JSON object." };

  const { email } = body as Partial<SubscribeRequest>;

  if (typeof email !== "string") return { error: "An email address is required." };

  const trimmed = email.trim();
  if (trimmed.length === 0) return { error: "An email address is required." };
  if (trimmed.length > MAX_EMAIL) return { error: "That email address is too long." };
  if (!EMAIL_PATTERN.test(trimmed)) return { error: "That email address looks incomplete." };

  return { email: trimmed };
}

/** Stands in for the list provider. Logs only — nothing is stored or sent. */
function deliver(email: string) {
  console.info("[subscribe] drop alerts requested", {
    email,
    at: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Malformed request body." }, { status: 400 });
  }

  const parsed = parse(body);

  if ("error" in parsed) {
    return Response.json({ ok: false, error: parsed.error }, { status: 422 });
  }

  deliver(parsed.email);

  return Response.json({ ok: true });
}
