/**
 * Credential rules, shared by the forms and the `/api/auth` routes.
 *
 * Both sides import from here so the client guard and the server boundary
 * cannot drift apart. The client copy is only ever an affordance — every rule
 * below is re-checked in the route, which is the only place that decides
 * anything.
 *
 * Length is the only password rule. Composition rules (a symbol, a digit, mixed
 * case) push people toward predictable substitutions without adding real
 * entropy, so NIST dropped them; a longer floor is worth more than either.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = {
  name: 80,
  company: 120,
  email: 254,
  passwordMin: 12,
  /** Only there to stop absurd payloads reaching a future hashing function. */
  passwordMax: 200,
} as const;

export type SignInFields = {
  email: string;
  password: string;
};

export type SignUpFields = {
  name: string;
  company: string;
  email: string;
  password: string;
  confirm: string;
};

/** Field-keyed messages, plus `_` for anything about the submission as a whole. */
export type FieldErrors<Key extends string> = Partial<Record<Key | "_", string>>;

export function checkEmail(value: string): string | undefined {
  if (!value) return "An email address is required.";
  if (value.length > LIMITS.email) return "That email address is too long.";
  if (!EMAIL_PATTERN.test(value)) return "That email address looks incomplete.";
  return undefined;
}

export function checkNewPassword(value: string): string | undefined {
  if (!value) return "A password is required.";
  if (value.length < LIMITS.passwordMin) {
    return `Use at least ${LIMITS.passwordMin} characters.`;
  }
  if (value.length > LIMITS.passwordMax) return "That password is too long.";
  return undefined;
}

/**
 * Sign-in deliberately does *not* apply `checkNewPassword`. An account created
 * before the floor moved still has to be able to get in, and telling an
 * unauthenticated caller that their password is the wrong shape leaks whether
 * it was the password or the address that missed.
 */
export function validateSignIn(fields: SignInFields): FieldErrors<keyof SignInFields> {
  const errors: FieldErrors<keyof SignInFields> = {};

  const email = checkEmail(fields.email.trim());
  if (email) errors.email = email;

  if (!fields.password) errors.password = "A password is required.";
  else if (fields.password.length > LIMITS.passwordMax) {
    errors.password = "That password is too long.";
  }

  return errors;
}

export function validateSignUp(fields: SignUpFields): FieldErrors<keyof SignUpFields> {
  const errors: FieldErrors<keyof SignUpFields> = {};

  const name = fields.name.trim();
  if (!name) errors.name = "Your name is required.";
  else if (name.length > LIMITS.name) errors.name = "That name is too long.";

  /* Company is optional — independent producers are a real case. */
  if (fields.company.trim().length > LIMITS.company) {
    errors.company = "That organisation name is too long.";
  }

  const email = checkEmail(fields.email.trim());
  if (email) errors.email = email;

  const password = checkNewPassword(fields.password);
  if (password) errors.password = password;

  if (!fields.confirm) errors.confirm = "Confirm the password.";
  else if (fields.confirm !== fields.password) errors.confirm = "Those don't match.";

  return errors;
}
