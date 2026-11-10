import { Link } from "react-router-dom";
import { services } from "../data/site";
import { Reveal } from "./Reveal";
import { CharacterBlurReveal } from "./CharacterBlurReveal";
import { ArrowUpRight } from "./icons";

/** Service cards with restrained glass surfaces and hover light. */
export function ServicesGrid() {
  return (
    <section className="relative bg-ground py-16 sm:py-24">
      <div className="shell">
        <div className="grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <CharacterBlurReveal
              as="h2"
              text="End-to-end creative, built to convert."
              stagger={0.016}
              className="block max-w-[18ch] font-display text-[clamp(1.9rem,4.8vw,3.6rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink"
            />
          </div>
          <p className="max-w-[44ch] text-sm leading-relaxed text-muted md:col-span-5 md:text-right">
            End-to-end creative solutions designed to elevate your brand&apos;s presence and drive
            results.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.06}>
              <article className="glass group relative h-full overflow-hidden rounded-2xl p-6 transition-colors duration-500 hover:border-white/20 sm:p-7">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: "radial-gradient(circle, rgba(58,41,255,0.35), transparent 70%)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="mono-sm text-dim">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 font-display text-lg font-bold tracking-[-0.02em] text-ink sm:text-xl">
                      {service.title}
                    </h3>
                  </div>
                  {service.highlight && (
                    <span className="shrink-0 rounded-full border border-lime/30 bg-lime/10 px-2.5 py-1 mono-sm text-lime">
                      {service.highlight}
                    </span>
                  )}
                </div>

                <p className="relative mt-4 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>

                <ul className="relative mt-6 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-white/10 pt-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-[12.5px] text-ink/80">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-hair pt-7">
          <p className="mono-sm text-dim">Get a custom quote</p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 mono-sm text-ink transition-colors hover:text-lime"
          >
            Start a project
            <ArrowUpRight
              size={12}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
