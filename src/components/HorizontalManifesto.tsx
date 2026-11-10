import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEXT = "Beyond the ordinary, beyond the expected, FIND YOURSELF IN GLITCH, explore a world where creativity meets experimentation, ideas become experiences, and every pixel tells a different story.";

/** Inline brand glyphs — punctuation, not decoration blocks. */
const glyph = "h-[0.62em] w-auto shrink-0";

function PixelArrow() {
  return (
    <svg viewBox="0 0 64 32" className={glyph} fill="none" aria-hidden="true">
      <path d="M2 16h48" stroke="#3A29FF" strokeWidth="3" />
      <path d="M38 6l12 10-12 10" stroke="#3A29FF" strokeWidth="3" />
      <rect x="52" y="12" width="6" height="6" fill="#BFFF00" />
    </svg>
  );
}

function WaveLine() {
  return (
    <svg viewBox="0 0 88 32" className={glyph} fill="none" aria-hidden="true">
      <path
        d="M2 22c8 0 8-12 16-12s8 12 16 12 8-12 16-12 8 12 16 12 8-12 16-12"
        stroke="#EDE7DC"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
      <circle cx="84" cy="10" r="3" fill="#BFFF00" />
    </svg>
  );
}

function Asterisk() {
  return (
    <svg viewBox="0 0 32 32" className={glyph} fill="none" aria-hidden="true">
      <path d="M16 3v26M4.5 9.5l23 13M27.5 9.5l-23 13" stroke="#3A29FF" strokeWidth="2.4" />
    </svg>
  );
}

function RingMark() {
  return (
    <svg viewBox="0 0 40 40" className={glyph} fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="16" stroke="#EDE7DC" strokeOpacity="0.35" strokeWidth="2" />
      <circle cx="20" cy="20" r="5" fill="#BFFF00" />
      <path d="M20 2v7M20 31v7" stroke="#EDE7DC" strokeOpacity="0.35" strokeWidth="2" />
    </svg>
  );
}

function GlitchBars() {
  return (
    <svg viewBox="0 0 44 32" className={glyph} fill="none" aria-hidden="true">
      <rect x="0" y="42" width="44" height="0" />
      <rect x="2" y="8" width="24" height="4" fill="#BFFF00" />
      <rect x="10" y="16" width="32" height="4" fill="#3A29FF" />
      <rect x="4" y="24" width="18" height="4" fill="#EDE7DC" fillOpacity="0.5" />
    </svg>
  );
}

const phrase = "align-baseline";

/**
 * One continuous editorial sentence that travels horizontally as the page is
 * scrolled vertically. GSAP ScrollTrigger pins the stage and scrubs a single
 * transform on the track — no slides, no snapping, no wheel hijacking.
 */
export function HorizontalManifesto() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();

    // Re-measure once webfonts and the inline SVGs have settled.
    document.fonts?.ready.then(refresh).catch(() => refresh);
    const ro = new ResizeObserver(refresh);
    ro.observe(track);

    return () => {
      ro.disconnect();
      ctx.revert();
    };
  }, [reduce]);

  const body = (
    <>
      <span className={`${phrase} font-semibold text-ink`}>Beyond the ordinary,</span>
      <span className={`${phrase} font-semibold text-muted`}>beyond the expected,</span>
      <PixelArrow />
      <span className={`${phrase} font-extrabold text-accentSoft`}>FIND YOURSELF IN GLITCH,</span>
      <WaveLine />
      <span className={`${phrase} font-semibold text-muted`}>
        explore a world where creativity meets experimentation,
      </span>
      <Asterisk />
      <span className={`${phrase} font-extrabold text-ink`}>ideas become experiences,</span>
      <RingMark />
      <span className={`${phrase} font-semibold text-muted`}>
        and every pixel tells a different story.
      </span>
      <GlitchBars />
      <span className={`${phrase} font-extrabold text-lime`}>BEYOND_404</span>
    </>
  );

  if (reduce) {
    return (
      <section className="border-t border-hairsoft bg-ground py-16 sm:py-24">
        <div className="shell">
          <p className="mono text-dim">Manifesto</p>
          <p className="mt-6 max-w-[24ch] font-display text-[clamp(2rem,6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
            {TEXT}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Studio manifesto"
      className="relative flex h-[100svh] items-center overflow-hidden border-t border-hairsoft bg-ground"
    >
      <p className="mono-sm absolute left-5 top-6 z-10 text-dim sm:left-8">Manifesto</p>
      <div className="flex h-full w-full items-center">
        <div
          ref={trackRef}
          className="flex w-max items-center gap-[0.28em] whitespace-nowrap pl-5 pr-[10vw] font-display text-[clamp(2.2rem,8vw,8.75rem)] leading-[1.05] tracking-[-0.03em] will-change-transform sm:pl-8"
        >
          {body}
        </div>
      </div>
      <p className="sr-only">{TEXT}</p>
    </section>
  );
}
