import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { Aurora } from "./Aurora";
import { CharacterReveal } from "./CharacterReveal";
import { ArrowUpRight } from "./icons";
import { brand, contact } from "../data/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[92svh] flex-col justify-center overflow-hidden pb-12 pt-24 sm:pb-14 lg:min-h-[94svh]"
    >
      <Aurora className="z-0" />
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(10,12,14,0.6),transparent_28%,transparent_72%,#0A0C0E)]" />

      <div className="shell relative z-10">
        <motion.div {...fade(0.05)} className="mb-6 flex flex-wrap items-center gap-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
          </span>
          <p className="mono text-muted">{brand.tagline}</p>
          <span className="hidden h-px w-8 bg-hair sm:block" />
          <p className="mono-sm hidden text-dim sm:block">{brand.location}</p>
        </motion.div>

        <h1 className="font-display text-[clamp(2rem,8.4vw,7.4rem)] font-extrabold leading-[0.86] tracking-[-0.05em] text-ink">
          <CharacterReveal text={brand.wordmark} />
        </h1>

        <motion.div {...fade(0.55)} className="mt-4 flex items-center gap-4">
          <span className="h-px w-10 shrink-0 bg-accent sm:w-16" />
          <p className="mono text-ink/90">
            {brand.slogan.split(" ").map((word, i, arr) => (
              <span key={word}>
                {word === "GLITCH" ? <span className="text-lime">{word}</span> : word}
                {i < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </motion.div>

        <div className="mt-9 grid gap-8 border-t border-hair pt-7 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <motion.p
              {...fade(0.7)}
              className="max-w-[52ch] text-[15px] leading-relaxed text-muted sm:text-base"
            >
              {brand.intro}
            </motion.p>

            <motion.div {...fade(0.85)} className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/work" className="btn-primary group">
                Explore Work
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link to="/contact" className="btn-ghost">
                Let&apos;s Connect
              </Link>
            </motion.div>
          </div>

          <motion.div
            {...fade(1)}
            className="grid grid-cols-3 gap-x-5 gap-y-4 lg:col-span-5 lg:grid-cols-1 lg:gap-0 lg:border-l lg:border-hair lg:pl-8"
          >
            <div className="lg:border-t lg:border-hairsoft lg:py-3 lg:first:border-t-0 lg:first:pt-0">
              <p className="mono-sm text-dim">Role</p>
              <p className="mt-1.5 font-display text-[13px] text-ink">{brand.role}</p>
            </div>
            <div className="lg:border-t lg:border-hairsoft lg:py-3">
              <p className="mono-sm text-dim">Based in</p>
              <p className="mt-1.5 font-display text-[13px] text-ink">{brand.location}</p>
            </div>
            <div className="lg:border-t lg:border-hairsoft lg:py-3">
              <p className="mono-sm text-dim">Signature</p>
              <p className="mt-1.5 font-mono text-[11px] tracking-[0.14em] text-lime">
                {brand.signature}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        {...fade(1.1)}
        className="shell relative z-10 mt-10 flex items-center justify-between border-t border-hair pt-4"
      >
        <span className="mono-sm text-dim">Scroll to explore</span>
        <div className="flex items-center gap-5">
          <a
            href={contact.phoneHref}
            className="mono-sm hidden text-dim transition-colors hover:text-ink sm:block"
          >
            {contact.phone}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="mono-sm text-dim transition-colors hover:text-ink"
          >
            {contact.email}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
