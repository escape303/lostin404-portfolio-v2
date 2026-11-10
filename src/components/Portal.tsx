import { useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { brand, projects } from "../data/site";

const featured = projects[0];
const [firstHalf, secondHalf] = brand.wordmark.split("_");

/**
 * Scroll-driven portal: two opaque panels start closed over the featured
 * project, then part outward while the wordmark grows, tightens its tracking
 * and splits in two. Everything is bound to scroll position, so scrolling
 * back up closes the portal again.
 */
export function Portal() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const leftPanelX = useTransform(scrollYProgress, [0, 0.55], ["0%", "-102%"]);
  const rightPanelX = useTransform(scrollYProgress, [0, 0.55], ["0%", "102%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.85], [1.16, 1]);
  const titleScale = useTransform(scrollYProgress, [0, 0.75], [1, 1.16]);
  const tracking = useTransform(scrollYProgress, [0, 0.75], ["-0.02em", "-0.055em"]);
  const halfLeft = useTransform(scrollYProgress, [0, 0.8], ["0%", "-7%"]);
  const halfRight = useTransform(scrollYProgress, [0, 0.8], ["0%", "7%"]);
  const dotX = useTransform(scrollYProgress, [0.15, 0.8], ["0%", "460%"]);
  const dotY = useTransform(scrollYProgress, [0.15, 0.8], ["0%", "-160%"]);
  const dotLeftX = useTransform(dotX, (v) => `-${v}`);
  const dotLeftY = useTransform(dotY, (v) => `-${v}`);
  const washRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (washRef.current) {
      const t = Math.min(Math.max((v - 0.1) / 0.6, 0), 1);
      washRef.current.style.opacity = String(t * 0.35);
    }
    if (hintRef.current) {
      hintRef.current.style.opacity = String(Math.max(1 - v / 0.15, 0));
    }
  });

  if (reduce) {
    return (
      <section id="portal" className="relative bg-deep py-20 sm:py-28">
        <div className="shell">
          <div className="relative overflow-hidden rounded-2xl border border-hair">
            <img
              src={featured.image}
              alt={`${featured.title} — ${featured.category}`}
              className="h-[60svh] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <p className="mono text-lime">Featured</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-2 max-w-[48ch] text-sm text-muted">{featured.description}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portal" className="relative bg-deep">
      <div ref={trackRef} className="relative h-[260vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* Featured artwork underneath */}
          <motion.img
            src={featured.image}
            alt={`${featured.title} — ${featured.category}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ scale: imageScale }}
            loading="lazy"
          />

          {/* Duotone wash + vignette */}
          <div
            ref={washRef}
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(130deg,#3A29FF_0%,transparent_45%,#5227FF_100%)] opacity-0 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_50%,transparent_20%,rgba(5,5,5,0.72)_78%,#050505_100%)]" />

          {/* Panels — closed at rest, driven outward by scroll */}
          <motion.div
            className="absolute inset-y-0 left-0 z-20 w-[51%] border-r border-hair bg-deep"
            style={{ x: leftPanelX }}
          >
            <div className="grain absolute inset-0" />
            <span className="mono-sm absolute bottom-6 right-5 text-dim">CLOSED</span>
          </motion.div>
          <motion.div
            className="absolute inset-y-0 right-0 z-20 w-[51%] border-l border-hair bg-deep"
            style={{ x: rightPanelX }}
          >
            <div className="grain absolute inset-0" />
          </motion.div>

          {/* Accent markers that travel outward as the portal opens */}
          <motion.span
            className="absolute left-1/2 top-1/2 z-30 h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_18px_rgba(191,255,0,0.8)]"
            style={{ x: dotX, y: dotY }}
            aria-hidden="true"
          />
          <motion.span
            className="absolute left-1/2 top-1/2 z-30 h-1.5 w-1.5 rounded-full bg-accent2 shadow-[0_0_18px_rgba(82,39,255,0.9)]"
            style={{ x: dotLeftX, y: dotLeftY }}
            aria-hidden="true"
          />

          {/* Split wordmark */}
          <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-4">
            <p className="mono mb-5 text-lime">Featured work</p>
            <motion.h2
              className="flex items-baseline justify-center whitespace-nowrap font-display text-[clamp(2rem,8.4vw,7.4rem)] font-extrabold leading-none text-ink"
              style={{ scale: titleScale, letterSpacing: tracking }}
            >
              <motion.span style={{ x: halfLeft }}>{firstHalf}</motion.span>
              <span className="text-accent">_</span>
              <motion.span style={{ x: halfRight }}>{secondHalf}</motion.span>
            </motion.h2>
            <p className="mono mt-6 hidden text-ink/70 sm:block">
              {featured.category} — {featured.description}
            </p>
          </div>

          {/* Corner metadata */}
          <div className="pointer-events-none absolute inset-0 z-30 p-5 sm:p-7">
            <div className="flex items-start justify-between">
              <span className="mono-sm text-ink/60">Selected work — 01</span>
              <span className="mono-sm text-ink/60">{featured.tag}</span>
            </div>
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between sm:inset-x-7 sm:bottom-7">
              <span className="mono-sm text-ink/60">Dubai, UAE</span>
              <span className="mono-sm text-ink/60">{brand.signature}</span>
            </div>
          </div>

          <p
            ref={hintRef}
            className="absolute inset-x-0 bottom-14 z-30 text-center mono-sm text-ink/50"
          >
            Scroll to open
          </p>
        </div>
      </div>
    </section>
  );
}
