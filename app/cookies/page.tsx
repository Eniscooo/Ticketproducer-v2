import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function Page() {
  return (
    <LegalPage title="Cookie Policy" updated="August 2026" />
  );
}
