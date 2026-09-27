import { validateSignIn, type SignInFields } from "@/lib/auth";

/**
 * Sign-in for the client portal.
 *
 * There is no credential store in this project yet, and this route does not
 * pretend otherwise. `findAccount()` has nothing to look in, so every attempt
 * ends in the same 401 a real backend returns when an address or a password
 * does not match. Nothing here mints a session, sets a cookie, or grants
 * access — that is an infrastructure decision, not markup, so it is left as one
 * clearly marked seam rather than faked.
 *
 * TO CONNECT:
 *   1. Give `findAccount()` a real lookup — database, directory, or identity
 *      provider — returning the stored password *hash*. Never the password.
 *   2. Verify with a slow, salted KDF (argon2id or bcrypt). Never `===`, and
 *      run the comparison even when no account was found, so response time
 *      does not tell an attacker which addresses exist.
 *   3. On success, issue a signed httpOnly/secure/sameSite session cookie, or
 *      hand off to the provider's callback, and return it from here.
 *   4. Rate-limit this route on address *and* source IP. An unauthenticated
 *      endpoint that checks secrets is the one place in the app that needs it.
 *
 * The route already returns the shape the form expects, so none of that
 * requires a change on the client.
 *
 * The submitted password is never logged — not here, not in the failure path.
 */

type Account = { email: string; passwordHash: string };

/** The seam. Returns nothing until a real store is wired in behind it. */
async function findAccount(email: string): Promise<Account | null> {
  void email;
  return null;
}

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
  const fields: SignInFields = {
    email: typeof body.email === "string" ? body.email : "",
    password: typeof body.password === "string" ? body.password : "",
  };

  /* Re-checks what the form checked: a client-side guard is UX, not a boundary. */
  const errors = validateSignIn(fields);
  if (Object.keys(errors).length > 0) {
    return invalid(errors as Record<string, string>, 422);
  }

  const email = fields.email.trim().toLowerCase();
  const account = await findAccount(email);

  /*
   * One message for both "no such account" and "wrong password". Splitting them
   * turns this endpoint into a directory of who holds an account.
   */
  if (!account) {
    console.info(`[auth] sign-in rejected for ${email} — no credential store configured`);
    return invalid(
      {
        _: "We couldn't match those details. If you don't have an account yet, sign up below.",
      },
      401,
    );
  }

  /* Unreachable until findAccount() is wired up; see step 2 above. */
  return invalid({ _: "Sign-in is not available yet." }, 501);
}
