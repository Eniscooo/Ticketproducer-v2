import Image from "next/image";
import { site } from "@/lib/site";
import { InView } from "./motion";
import { FlowButton } from "@/components/ui/flow-button";
import { CalendarDays, Ticket } from "lucide-react";

/**
 * The close: the two doors one last time, and every way to reach a person.
 * The skyline sits low behind it, held down by the ink so it reads as the
 * city at the end of the night rather than another picture to look at.
 */
export function Closing() {
  const { phone, phoneHref, email, addressLines } = site.contact;
  const address = addressLines.join(", ");

  /* Beside the number: email, and the address — which opens in maps, so every line here is something you can act on. */
  const ways = [
    { label: "Email", value: email, href: `mailto:${email}` },
    {
      label: "Visit",
      value: address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    },
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
          <h2 className="text-[0.8125rem] font-medium uppercase tracking-[0.2em] text-bone/70">
            Start the conversation.
          </h2>
        </InView>

        {/* The number is the star: big, and the whole thing dials */}
        <InView delay={60}>
          <a
            href={phoneHref}
            aria-label={`Call ${site.name} on ${phone}`}
            className="mt-6 inline-block font-display text-[clamp(2.6rem,9vw,7rem)] font-extrabold leading-none tracking-[-0.03em] text-white tabular-nums transition-opacity duration-300 ease-ui hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white"
          >
            {phone}
          </a>
          <p className="mx-auto mt-5 max-w-md text-pretty text-[0.9375rem] leading-[1.65] text-bone/70">
            Tell us the show, or tell us the room. Either way, a person picks up.
          </p>
        </InView>

        <InView delay={120} className="mt-9 flex flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <FlowButton href="/ticket-resale" tone="light" icon={Ticket}>
            Find tickets
          </FlowButton>
          <FlowButton href="/event-management" tone="light" icon={CalendarDays}>
            Plan an event
          </FlowButton>
        </InView>

        <dl className="mx-auto mt-16 grid max-w-3xl gap-px overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/10 text-left sm:mt-20 sm:grid-cols-2">
          {ways.map((way, i) => (
            <InView key={way.label} delay={180 + i * 60} className="bg-ink/80 p-6 backdrop-blur-sm">
              <dt className="text-[0.8125rem] text-stone">{way.label}</dt>
              <dd className="mt-1.5 text-[1rem] font-medium text-white">
                {way.href ? (
                  <a
                    href={way.href}
                    {...(way.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="break-anywhere underline-offset-4 transition-colors duration-200 ease-ui hover:text-white/75 hover:underline"
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
