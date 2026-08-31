import { checkEmail } from "@/lib/auth";
import { site } from "@/lib/site";

/**
 * Messages from the customer-service widget.
 *
 * Same posture as the proposal and subscribe routes: there is no inbox or
 * helpdesk wired up yet, so this stops at "validated and recorded". It
 * re-checks what the widget checked and writes the message to the server log,
 * which is why the widget promises a reply *by email, later* rather than
 * pretending someone is typing back in real time. Nothing here can hold a live
 * conversation, and the copy in the panel does not claim it can.
 *
 * TO CONNECT: replace `record()` with the real transport — a shared inbox, a
 * helpdesk API (Front, Help Scout, Zendesk), or a Slack webhook. The route
 * already returns the shape the widget expects, so nothing on the client needs
 * to change. Rate-limit it at the same time: it is an unauthenticated endpoint
 * that accepts free text.
 */

const MAX_MESSAGE = 4000;

type SupportMessage = {
  email: string;
  message: string;
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
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  const errors: Record<string, string> = {};

  const emailError = checkEmail(email);
  if (emailError) errors.email = emailError;

  if (!message) errors.message = "Say a little about what you need.";
  else if (message.length > MAX_MESSAGE) errors.message = "That message is too long.";

  if (Object.keys(errors).length > 0) return invalid(errors, 422);

  try {
    await record({ email: email.toLowerCase(), message });
  } catch (error) {
    console.error("[support] could not record message", error);
    return invalid({ _: "Could not send that. Try again, or call the line." }, 502);
  }

  return Response.json({ ok: true });
}

/**
 * The single integration point. Until an inbox exists this records the message
 * server-side so nothing a visitor sends is silently dropped.
 */
async function record({ email, message }: SupportMessage) {
  // One string rather than extra console args — structured dev loggers drop
  // trailing arguments, which made submitted details look like they vanished.
  console.info(
    `[support] message from ${email} · route to ${site.contact.email} · ${message}`,
  );
}
