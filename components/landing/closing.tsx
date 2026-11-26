import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { InView } from "./motion";

/**
 * The close: the two doors one last time, and every way to reach a person.
 * The skyline sits low behind it, held down by the ink so it reads as the
 * city at the end of the night rather than another picture to look at.
 */
export function Closing() {
  const { phone, phoneHref, email, addressLines } = site.contact;

  const ways = [
    { label: "Call", value: phone, href: phoneHref },
    { label: "Email", value: email, href: `mailto:${email}` },
    { label: "Visit", value: addressLines.join(", "), href: undefined },
  ];

  return (
    <section
      id="contact"
      className="relative isolate -mt-8 scroll-mt-20 overflow-hidden rounded-t-[2rem] bg-ink pb-32 pt-24 text-bone sm:pb-40 sm:pt-32"
    >
      <Image
        src="/nyc/skyline-dusk.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[50%_70%] opacity-60"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/75 to-ink/25" />

      <div className="mx-auto w-full max-w-[76rem] px-6 text-center sm:px-10">
        <InView>
          <h2 className="mx-auto max-w-3xl text-balance font-display text-[clamp(2.4rem,5.6vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-white">
            Your next night out starts here.
          </h2>
        </InView>
        <InView delay={60}>
          <p className="mx-auto mt-5 max-w-md text-pretty text-[0.9375rem] leading-[1.65] text-bone/70">
            Tell us the show, or tell us the room. Either way, a person picks up.
          </p>
        </InView>

        <InView delay={120} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/ticket-resale"
            className="press group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-6 text-[0.9375rem] font-semibold text-ink transition-[background-color,scale] duration-200 ease-ui hover:bg-bone"
          >
            Find tickets
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-200 ease-ui group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/event-management"
            className="press inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-[0.9375rem] font-semibold text-white transition-[border-color,background-color,scale] duration-200 ease-ui hover:border-white/40 hover:bg-white/[0.06]"
          >
            Plan an event
          </Link>
        </InView>

        <dl className="mx-auto mt-20 grid max-w-4xl gap-px overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/10 text-left sm:mt-24 sm:grid-cols-3">
          {ways.map((way, i) => (
            <InView key={way.label} delay={180 + i * 60} className="bg-ink/80 p-6 backdrop-blur-sm">
              <dt className="text-[0.8125rem] text-stone">{way.label}</dt>
              <dd className="mt-1.5 text-[1rem] font-medium text-white">
                {way.href ? (
                  <a
                    href={way.href}
                    className="break-anywhere transition-colors duration-200 ease-ui hover:text-champagne"
                  >
                    {way.value}
                  </a>
                ) : (
                  way.value
                )}
              </dd>
            </InView>
          ))}
        </dl>
      </div>
    </section>
  );
}
