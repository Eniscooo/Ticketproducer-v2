import { Phone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { site, tpElite } from "@/lib/site";
import { EliteWallet } from "./elite-wallet";

/**
 * The visual peak: the only place in the light body the site turns dark
 * again. A distinct palette from the intro/hero — deeper, warmer, closer to
 * espresso and burgundy than the hero's flat ink — so the entrance into it
 * reads as a specific room, not a return to the top of the page. Rounded top
 * and a rising shadow instead of a hairline — it reads as a card laid over
 * the page rather than another flat band stacked in the flow.
 */
export function TPElite() {
  return (
    <section
      id="tp-elite"
      className="grain relative isolate mx-auto w-full max-w-[78rem] scroll-mt-28 rounded-feature overflow-hidden bg-elite-void py-8 shadow-[0_-26px_56px_-26px_rgba(0,0,0,0.6)] sm:py-12"
    >
      {/* A richer, warmer ground — the room behind the room */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(85%_60%_at_18%_0%,rgba(74,27,40,0.55),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_88%_92%,rgba(27,19,17,0.92),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_35%_at_50%_46%,rgba(212,175,122,0.09),transparent_70%)]" />
      </div>

      {/* Vertical standing label — plate on the door */}
      <span
        aria-hidden
        className="label absolute left-6 top-1/2 hidden -translate-y-1/2 text-elite-gold [writing-mode:vertical-rl] xl:block"
      >
        By Invitation · By Request
      </span>

      <div className="mx-auto w-full max-w-[80rem] px-6 sm:px-10">
        <div className="rounded-[2rem] border border-elite-gold/20 bg-elite-umber/50 px-6 py-10 backdrop-blur-sm sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 className="display text-[clamp(2.25rem,5.6vw,4rem)] text-elite-ivory">
                  {tpElite.description}
                </h2>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="mt-7 max-w-xl text-[0.9375rem] leading-[1.9] text-elite-ivory/70">
                  {tpElite.body}
                </p>
              </Reveal>

              {/* Access points, stated plainly — never sold as a pricing tier */}
              <Reveal delay={0.18}>
                <ul className="mt-10 grid gap-x-8 gap-y-4 border-t border-elite-gold/20 pt-8 sm:grid-cols-2">
                  {tpElite.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-[0.9375rem] leading-snug text-elite-ivory/85"
                    >
                      <span
                        aria-hidden
                        className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-elite-gold"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="lg:col-span-5">
              <EliteWallet />
            </Reveal>
          </div>

          {/* The line itself — access is granted by conversation, not checkout */}
          <Reveal delay={0.22}>
            <div className="mt-12 flex flex-col items-start gap-8 border-t border-elite-gold/20 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="label block text-elite-gold">
                  Invite-Only · By Request
                </span>
                <p className="label mt-3 max-w-sm leading-[2] text-elite-ivory/60">
                  Introductions and requests are taken by phone.
                </p>
              </div>
              <a
                href={site.contact.phoneHref}
                className="group pressable relative inline-flex min-h-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-elite-gold px-9 py-4 text-elite-void"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-full origin-bottom scale-y-0 bg-elite-ivory/70 transition-transform duration-500 ease-editorial group-hover:scale-y-100"
                />
                <span className="label relative z-10 inline-flex items-center gap-2.5">
                  Sign Up
                  <Phone aria-hidden className="h-3.5 w-3.5" />
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
