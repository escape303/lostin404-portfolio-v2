import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { disciplinesRowOne, disciplinesRowTwo } from "../data/site";

function Chip({ label, index }: { label: string; index: number }) {
  return (
    <div className="group flex min-w-[210px] items-center gap-3 rounded-[14px] border border-hair bg-panel/80 px-4 py-3 transition-colors duration-300 hover:border-accent/40">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] border border-hairsoft bg-elevated font-display text-lg font-bold text-ink transition-colors duration-300 group-hover:text-lime">
        {label.charAt(0)}
      </span>
      <span>
        <span className="block font-display text-sm font-semibold text-ink">{label}</span>
        <span className="mt-0.5 block mono-sm text-dim">
          {String(index + 1).padStart(2, "0")} / discipline
        </span>
      </span>
    </div>
  );
}

function Row({
  items,
  direction,
}: {
  items: readonly string[];
  direction: "left" | "right";
}) {
  const reduce = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(host);
    return () => io.disconnect();
  }, [reduce]);

  if (reduce) {
    return (
      <div className="flex flex-wrap gap-3">
        {items.map((label, i) => (
          <Chip key={label} label={label} index={i} />
        ))}
      </div>
    );
  }

  const group = (key: string) => (
    <div key={key} className="flex shrink-0 gap-3 pr-3" aria-hidden={key === "b"}>
      {items.map((label, i) => (
        <Chip key={`${label}-${i}`} label={label} index={i} />
      ))}
    </div>
  );

  return (
    <div ref={hostRef} className="marquee-mask overflow-hidden">
      <div
        className={`flex w-max ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {group("a")}
        {group("b")}
      </div>
    </div>
  );
}

export function Toolkit() {
  return (
    <section className="relative overflow-hidden border-t border-hairsoft bg-ground py-20 sm:py-28">
      <div className="shell">
        <div className="grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="mono text-dim">Toolkit</p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4.8vw,3.6rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
              The disciplines
              <br />
              behind the work.
            </h2>
          </div>
          <p className="max-w-[44ch] text-sm leading-relaxed text-muted md:col-span-5 md:text-right">
            Brand systems, cinematic content, web builds and social strategy — handled as one
            connected practice rather than four separate services.
          </p>
        </div>
      </div>

      <div className="mt-12 space-y-3">
        <Row items={disciplinesRowOne} direction="left" />
        <Row items={disciplinesRowTwo} direction="right" />
      </div>
    </section>
  );
}
