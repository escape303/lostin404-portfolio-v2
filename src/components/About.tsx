import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { aboutCards, brand, stats, timeline } from "../data/site";
import { Reveal } from "./Reveal";
import { CharacterBlurReveal } from "./CharacterBlurReveal";

function Stat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const digits = value.replace(/[^0-9]/g, "");
  const suffix = value.replace(/[0-9]/g, "");
  const [count, setCount] = useState(reduce ? Number(digits) : 0);

  useEffect(() => {
    if (reduce || !inView) return;
    const target = Number(digits);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / 900, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, digits, reduce]);

  return (
    <div ref={ref} className="border-l border-hairsoft pl-4">
      <p className="font-display text-3xl font-extrabold tracking-[-0.02em] text-ink sm:text-4xl">
        {count}
        <span className="text-accentSoft">{suffix}</span>
      </p>
      <p className="mt-1.5 mono-sm text-dim">{label}</p>
    </div>
  );
}

/** Portrait, philosophy, credentials, figures and trajectory. */
export function AboutProfile() {
  return (
    <section className="relative bg-panel/40 py-16 sm:py-24">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="relative">
              <div
                className="absolute -inset-2 rounded-2xl border border-hairsoft"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src="/portrait.png"
                  alt="LOST_IN404 — Suhail, creative director and designer based in Dubai"
                  loading="lazy"
                  className="relative aspect-[3/4] w-full object-cover grayscale-[0.88] contrast-[1.06] brightness-[0.95]"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-accent/35 mix-blend-color"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_40%,transparent_35%,rgba(10,12,14,0.55)_100%)]"
                  aria-hidden="true"
                />
              </div>
              <div className="glass absolute -bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl px-4 py-3">
                <div>
                  <p className="font-display text-sm font-semibold text-ink">
                    {brand.name} — {brand.role}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime" />
                    {brand.location}
                  </p>
                </div>
                <span className="font-mono text-[10px] tracking-[0.16em] text-lime">
                  {brand.signature}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <CharacterBlurReveal
            as="h2"
            text="Who I am."
            className="block font-display text-[clamp(1.9rem,4.6vw,3.4rem)] font-extrabold leading-[0.96] tracking-[-0.035em] text-ink"
          />

          <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-muted">{brand.about}</p>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-muted">
            {brand.philosophy}
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {aboutCards.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-hair bg-ground/50 p-5">
                  <p className="mono-sm text-dim">{card.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{card.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-hair pt-7">
            {stats.map((stat) => (
              <Stat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>

          <div className="mt-12">
            <p className="mono text-dim">Trajectory</p>
            <ol className="mt-5">
              {timeline.map((item, i) => (
                <motion.li
                  key={item.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-[64px_1fr] gap-4 border-t border-hairsoft py-4 first:border-t-0 first:pt-0"
                >
                  <span className="mono text-lime">{item.year}</span>
                  <span>
                    <span className="block font-display text-sm font-semibold text-ink">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-muted">
                      {item.desc}
                    </span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
