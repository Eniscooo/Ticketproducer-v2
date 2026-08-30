import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { clsx } from "@/lib/clsx";
import { emServices } from "@/lib/event-management-page";
import { eventManagement } from "@/lib/site";

/**
 * design.md's Category Card, three up: image flush to the card edges filling
 * the top, 28px padding below it, a 20px weight-600 title, and the supporting
 * points as outlined tag pills inside the card. Hairline border, no shadow.
 */
export function EmServices() {
  return (
    <section id="em-services" className="relative scroll-mt-28 bg-paper py-20">
      <div className="mx-auto w-full max-w-[75rem] px-6 sm:px-10">
        <Reveal>
          <h2 className="ds-display max-w-2xl text-[clamp(2rem,4.4vw,2.75rem)] text-canvas-text">
            <span className="font-light">Staffing, mapping, ticketing, </span>
            <span className="font-semibold">and a second opinion.</span>
          </h2>
          <p className="ds-body mt-5 max-w-xl text-canvas-text-muted">
            {eventManagement.description}
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {emServices.map((service, i) => (
            <Reveal as="li" key={service.title} delay={i * 0.07} className="h-full">
              <article className="ds-card group flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/11] w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 23rem, (min-width: 640px) 45vw, 90vw"
                    className={clsx(
                      "object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.03]",
                      service.imagePosition,
                    )}
                  />
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-[1.25rem] font-semibold leading-[1.35] text-canvas-text">
                    {service.title}
                  </h3>
                  <p className="ds-body mt-3 text-canvas-text-muted">{service.body}</p>

                  <ul className="mt-auto flex flex-wrap gap-2 pt-7">
                    {service.points.map((point) => (
                      <li key={point} className="ds-badge ds-badge-tag">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
