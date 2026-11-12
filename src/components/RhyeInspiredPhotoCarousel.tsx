import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useReducedMotion } from "motion/react";
import { aboutPhotos, type AboutPhoto } from "../data/aboutPhotos";

gsap.registerPlugin(CustomEase);

/** cubic-bezier(0.16, 1, 0.3, 1) — the site's editorial easing, as a GSAP ease. */
const EASE = CustomEase.create("editorial", "M0,0 C0.16,1 0.3,1 1,1");

/** Minimal circular arrow used by the carousel controls. */
function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 ${dir === "prev" ? "" : "rotate-180"}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M15 4l-8 8 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

type Props = {
  /** Defaults to the personal archive in `src/data/aboutPhotos.ts`. */
  photos?: readonly AboutPhoto[];
};


/**
 * Cinematic horizontal photo archive: staggered portrait frames, drag with
 * inertia, arrow + keyboard navigation, monochrome that resolves to colour on
 * hover. One GSAP tween owns the track transform, so it never competes with the
 * scroll-driven timelines elsewhere on the site.
 */
export function RhyeInspiredPhotoCarousel({ photos = aboutPhotos }: Props) {
  const reduce = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const xRef = useRef(0);
  const draggedRef = useRef(false);
  const metrics = useRef({ step: 0, max: 0 });
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  const total = photos.length;

  const clamp = useCallback((x: number) => {
    const { max } = metrics.current;
    return Math.min(0, Math.max(-max, x));
  }, []);

  const sync = useCallback(() => {
    const { step, max } = metrics.current;
    const x = xRef.current;
    setIndex(step ? Math.min(total - 1, Math.max(0, Math.round(-x / step))) : 0);
    setProgress(max > 0 ? Math.min(1, Math.max(0, -x / max)) : 0);
  }, [total]);

  /** Paint the track position — the single source of truth for its transform. */
  const draw = useCallback(
    (x: number) => {
      xRef.current = x;
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${x}px,0,0)`;
      sync();
    },
    [sync],
  );

  const animateTo = useCallback(
    (x: number) => {
      tweenRef.current?.kill();
      const target = clamp(x);
      if (reduce) {
        draw(target);
        return;
      }
      const proxy = { x: xRef.current };
      tweenRef.current = gsap.to(proxy, {
        x: target,
        duration: 0.9,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => draw(proxy.x),
      });
    },
    [clamp, draw, reduce],
  );

  const go = useCallback(
    (delta: number) => {
      const { step } = metrics.current;
      if (!step) return;
      const current = Math.round(-xRef.current / step);
      const next = Math.min(total - 1, Math.max(0, current + delta));
      animateTo(-next * step);
    },
    [animateTo, total],
  );

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[1] as HTMLElement | undefined;
    const step = first && second ? second.offsetLeft - first.offsetLeft : (first?.offsetWidth ?? 0);
    const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
    metrics.current = { step, max };
    draw(clamp(xRef.current));
  }, [clamp, draw]);

  // Re-measure on resize and once webfonts settle (captions change frame width).
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    document.fonts?.ready.then(() => measure()).catch(() => undefined);
    return () => ro.disconnect();
  }, [measure]);

  // Entrance: opacity + a short lift, staggered, once.
  useEffect(() => {
    const root = viewportRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-photo]"));
    if (!items.length) return;
    if (reduce) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(items, { opacity: 0, y: 26 });
    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (played || !entries.some((entry) => entry.isIntersecting)) return;
        played = true;
        io.disconnect();
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: EASE,
          stagger: 0.08,
          overwrite: true,
        });
      },
      { threshold: 0.12 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      gsap.killTweensOf(items);
    };
  }, [reduce]);

  // Pointer drag with axis lock, rubber-banding at the ends and inertia on release.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let baseX = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let axis: "x" | "y" | null = null;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      tweenRef.current?.kill();
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      baseX = xRef.current;
      lastX = event.clientX;
      lastT = performance.now();
      velocity = 0;
      axis = null;
      draggedRef.current = false;
      try {
        viewport.setPointerCapture(event.pointerId);
      } catch {
        // The pointer can already be gone (fast tap, synthetic event).
      }
    };

    const onMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!axis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
        if (axis === "x") {
          viewport.dataset.dragging = "true";
          draggedRef.current = true;
        }
      }
      if (axis !== "x") return;
      const { max } = metrics.current;
      let x = baseX + dx;
      if (x > 0) x *= 0.32;
      else if (x < -max) x = -max + (x + max) * 0.32;
      const now = performance.now();
      if (now - lastT > 0) velocity = (event.clientX - lastX) / (now - lastT);
      lastX = event.clientX;
      lastT = now;
      draw(x);
    };

    const onUp = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;
      const wasDragging = axis === "x";
      pointerId = null;
      axis = null;
      delete viewport.dataset.dragging;
      if (!wasDragging) return;
      animateTo(xRef.current + velocity * 260);
    };

    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    return () => {
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
    };
  }, [animateTo, draw]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      animateTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      animateTo(-metrics.current.max);
    }
  };

  const select = (i: number) => {
    if (draggedRef.current) return;
    const { step } = metrics.current;
    if (step) animateTo(-i * step);
  };

  const control =
    "flex h-9 w-9 items-center justify-center rounded-full border border-hair text-dim transition-colors duration-300 ease-editorial hover:border-ink/40 hover:text-ink disabled:opacity-30 disabled:hover:border-hair disabled:hover:text-dim";

  return (
    <section
      aria-labelledby="beyond-the-frame"
      className="relative overflow-hidden border-t border-hairsoft bg-[#0B0B0B] py-16 sm:py-24"
    >
      <div className="shell flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="beyond-the-frame" className="mono text-dim">
            Beyond the frame
          </h2>
          <p className="mt-4 max-w-[34ch] font-display text-[clamp(1.25rem,2.6vw,1.85rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink/90">
            A personal archive — the moments between the briefs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Previous photograph"
            className={control}
          >
            <Arrow dir="prev" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === total - 1}
            aria-label="Next photograph"
            className={control}
          >
            <Arrow dir="next" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Personal photographs"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="mt-10 cursor-grab select-none py-4 outline-offset-4 [touch-action:pan-y] data-[dragging=true]:cursor-grabbing sm:mt-14"
      >
        <ul
          ref={trackRef}
          className="flex w-max items-center gap-4 px-5 will-change-transform sm:gap-7 sm:px-8 lg:gap-10"
        >
          {photos.map((photo, i) => (
            <li
              key={photo.src}
              className="relative shrink-0"
              style={{
                top: photo.offset ?? (i % 2 === 0 ? 0 : 32),
                ["--h" as string]: `${photo.height ?? 420}px`,
              }}
            >
              <div data-photo>
                <button
                  type="button"
                  onClick={() => select(i)}
                  className="group block cursor-inherit text-left"
                  aria-label={`Photograph ${i + 1} of ${total}: ${photo.alt}`}
                >
                  <figure className="relative h-[calc(var(--h)*0.74)] w-[70vw] overflow-hidden rounded-[6px] bg-[#111] sm:h-[var(--h)] sm:w-[clamp(180px,23vw,270px)]">
                    {failed[i] ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-hairsoft bg-[radial-gradient(120%_100%_at_50%_0%,#161616_0%,#0B0B0B_72%)] px-4 text-center">
                        <span className="mono-sm text-dim">
                          Photo {String(i + 1).padStart(2, "0")} — awaiting upload
                        </span>
                        <span className="font-mono text-[9px] tracking-[0.08em] text-dim/60">
                          public{photo.src}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading={i < 2 ? "eager" : "lazy"}
                        decoding="async"
                        draggable={false}
                        onError={() =>
                          setFailed((prev) => (prev[i] ? prev : { ...prev, [i]: true }))
                        }
                        style={{ objectPosition: photo.position ?? "50% 50%" }}
                        className="h-full w-full object-cover grayscale brightness-[0.92] contrast-[1.05] transition-[filter,transform] duration-[620ms] ease-editorial will-change-transform group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:brightness-100 group-focus-visible:grayscale-0"
                      />
                    )}
                    <span
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_55%,rgba(0,0,0,0.45)_100%)]"
                      aria-hidden="true"
                    />
                  </figure>
                  <figcaption className="mono-sm mt-3 text-dim">
                    {photo.caption ?? `Photo ${String(i + 1).padStart(2, "0")}`}
                  </figcaption>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="shell mt-8 sm:mt-12">
        <div className="flex items-center gap-4">
          <div className="relative h-px flex-1 overflow-hidden bg-hairsoft">
            <span
              className="absolute inset-y-0 left-0 bg-ink/70 transition-[width] duration-300 ease-editorial"
              style={{ width: `${Math.max(6, progress * 100)}%` }}
            />
          </div>
          <p className="mono-sm tabular-nums text-dim" aria-live="polite">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="mono-sm text-dim">Personal archive</p>
          <p className="mono-sm text-dim">
            <span className="hidden sm:inline">Drag to explore</span>
            <span className="sm:hidden">Swipe to explore</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/** The original name for the same gallery — either import works. */
export const AboutPhotoCarousel = RhyeInspiredPhotoCarousel;
