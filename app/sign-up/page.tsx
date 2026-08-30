import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/site/auth-layout";
import { SignUpForm } from "@/components/site/sign-up-form";

export const metadata: Metadata = { title: "Request Access" };

/**
 * The other half of the portal. Framed as a request rather than a signup
 * because that is what it is — accounts are opened for producers, venues, and
 * TP Elite clients after the details are checked, not handed out on submit.
 */
export default function Page() {
  return (
    <AuthLayout
      eyebrow="Sign Up"
      title="Open an account."
      intro="Tell us who you are and what you run. We confirm the details, then open the portal from our end."
      art={{
        image: "/team.jpg",
        position: "object-[50%_38%]",
        quote: "Accounts here are opened by hand. We would rather know who we are working with.",
      }}
      aside={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="link-underline font-semibold text-canvas-text hover:text-champagne"
          >
            Sign in
          </Link>
          .
        </>
      }
    >
      <SignUpForm />
    </AuthLayout>
  );
}
