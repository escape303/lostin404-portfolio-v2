import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * Signature interaction: the statement's real variable-font weight axis
 * interpolates continuously with scroll position (300 → 800) and reverses
 * when the visitor scrolls back up. No fake weight, no font-size tricks.
 */
export function Statement() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const weight = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [300, 425, 550, 675, 800]);

  useEffect(() => {
    if (reduce) return;
    if (textRef.current) textRef.current.style.fontVariationSettings = '"wght" 300';
  }, [reduce]);

  useMotionValueEvent(weight, "change", (v) => {
    if (reduce) return;
    const rounded = Math.round(v);
    if (textRef.current) textRef.current.style.fontVariationSettings = `"wght" ${rounded}`;
    if (readoutRef.current) readoutRef.current.textContent = String(rounded);
  });

  const copy = (
    <>
      <span className="block">FIND YOURSELF</span>
      <span className="block">
        IN <span className="text-accentSoft">GLITCH</span>.
      </span>
    </>
  );

  if (reduce) {
    return (
      <section id="statement" className="relative bg-deep py-24 sm:py-32">
        <div className="read">
          <p className="mono text-dim">Statement</p>
          <p
            className="mt-8 font-sans text-ink"
            style={{
              fontVariationSettings: '"wght" 560',
              fontSize: "clamp(2.4rem,7.6vw,6rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            {copy}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="statement" className="relative bg-deep">
      <div ref={trackRef} className="relative h-[240vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className="read">
            <div className="mb-8 flex items-center justify-between">
              <p className="mono text-dim">Statement</p>
              <p className="mono-sm hidden text-dim sm:block" aria-hidden="true">
                wght <span ref={readoutRef}>300</span> / 800
              </p>
            </div>

            <p
              ref={textRef}
              className="font-sans text-ink"
              style={{
                fontVariationSettings: '"wght" 300',
                fontSize: "clamp(2.4rem,7.6vw,6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                willChange: "font-variation-settings",
              }}
            >
              {copy}
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-hairsoft">
                <motion.div
                  className="h-px origin-left bg-accent"
                  style={{ scaleX: scrollYProgress }}
                />
              </div>
              <p className="mono-sm text-dim">Inter Variable</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
