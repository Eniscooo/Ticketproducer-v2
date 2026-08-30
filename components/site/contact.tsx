import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

export function Contact() {
  const { phone, phoneHref, email, addressLines } = site.contact;

  return (
    <section
      id="contact"
      className="relative -mt-8 scroll-mt-28 rounded-t-[2rem] bg-paper py-20 shadow-[0_-24px_50px_-35px_rgba(23,23,22,0.12)] sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-10">
        <Reveal>
          <h2 className="display text-[clamp(2.25rem,5.4vw,4rem)] text-canvas-text">
            Start the conversation.
          </h2>
        </Reveal>

        {/* The number is the call to action. Everything else defers to it. */}
        <Reveal delay={0.12}>
          <a
            href={phoneHref}
            className="group mt-14 block border-y border-canvas-border py-10 transition-colors duration-700 ease-editorial hover:border-champagne/50 sm:mt-16 sm:py-14"
          >
            <span className="label mb-6 block text-taupe group-hover:text-champagne">
              Direct line
            </span>
            <span className="display block text-[clamp(2.5rem,9vw,7.5rem)] tabular-nums text-canvas-text transition-colors duration-700 ease-editorial group-hover:text-champagne">
              {phone}
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="label block text-taupe">Email</span>
              <a
                href={`mailto:${email}`}
                className="link-underline mt-4 inline-block break-anywhere font-display text-[1.375rem] font-medium text-canvas-text transition-colors duration-500 hover:text-champagne sm:text-[1.625rem]"
              >
                {email}
              </a>
            </div>

            <div className="lg:col-span-4">
              <span className="label block text-taupe">New York</span>
              <address className="mt-4 font-display text-[1.375rem] font-medium not-italic leading-[1.5] text-canvas-text sm:text-[1.625rem]">
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <p className="text-[0.9375rem] leading-[1.9] text-canvas-text-muted lg:col-span-3 lg:col-start-10">
              Tell us the room, the date, and what needs to happen. We will tell
              you exactly how we would run it.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
