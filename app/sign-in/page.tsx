import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/site/auth-layout";
import { SignInForm } from "@/components/site/sign-in-form";
import { pullQuote } from "@/lib/site";

export const metadata: Metadata = { title: "Sign In" };

/**
 * Client access, not a consumer marketplace login — Ticket Producer's clients
 * are producers, venues, and TP Elite members, so this reads as a private
 * portal. `AuthLayout` carries the split; the page only supplies its copy and
 * its half of the cross-link with /sign-up.
 */
export default function Page() {
  return (
    <AuthLayout
      eyebrow="Client Portal"
      title="Sign in."
      intro="For producers, venues, and TP Elite clients with an existing account."
      art={{ image: "/reserved.jpg", position: "object-[50%_42%]", quote: pullQuote }}
      aside={
        <>
          No account yet?{" "}
          <Link
            href="/sign-up"
            className="link-underline font-semibold text-canvas-text hover:text-champagne"
          >
            Sign up
          </Link>
          .
        </>
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}
