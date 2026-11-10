import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { projects, type Project } from "../data/site";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "./icons";

const THRESHOLD = 0.1; // 10% of the deck width

export function Deck() {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState<string[]>(() => projects.map((p) => p.id));
  const [flying, setFlying] = useState<{ project: Project; dir: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const deckRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: number; startX: number; active: boolean }>({
    id: -1,
    startX: 0,
    active: false,
  });

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 0, 260], [-12, 0, 12]);

  const cards = order.map((id) => projects.find((p) => p.id === id)!);
  const front = cards[0];

  const throwCard = (dir: number) => {
    const outgoing = front;

    if (reduce) {
      setOrder((o) => [...o.slice(1), o[0]]);
      x.set(0);
      return;
    }

    setFlying({ project: outgoing, dir });
    setOrder((o) => [...o.slice(1), o[0]]);
    x.set(0);
    window.setTimeout(() => setFlying(null), 520);
  };

  const flyDistance = Math.round((deckRef.current?.clientWidth ?? 420) * 1.15);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { id: e.pointerId, startX: e.clientX, active: true };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    x.set(e.clientX - dragRef.current.startX);
  };

  const endDrag = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setDragging(false);

    const width = deckRef.current?.clientWidth ?? 420;
    const dx = x.get();

    if (Math.abs(dx) > width * THRESHOLD) {
      throwCard(Math.sign(dx) || 1);
    } else if (reduce) {
      x.set(0);
    } else {
      animate(x, 0, { type: "spring", stiffness: 420, damping: 38 });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      throwCard(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      throwCard(-1);
    }
  };

  return (
    <section className="relative border-t border-hairsoft bg-ground py-20 sm:py-28">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mono text-dim">Featured deck</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4.6vw,3.4rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
            Throw the deck.
            <br />
            Six real projects.
          </h2>
          <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-muted">
            A physical stack of the catalogue — drag a card aside, use the arrow keys, or step
            through with the controls. Every card also lives in the gallery above.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => throwCard(-1)}
              aria-label="Previous project"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-hair text-ink transition-colors hover:border-ink/40 hover:text-white"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => throwCard(1)}
              aria-label="Next project"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-hair text-ink transition-colors hover:border-ink/40 hover:text-white"
            >
              <ArrowRight size={16} />
            </button>

            <div className="ml-2 flex items-center gap-4">
              <Link
                to={`/work/${front.id}`}
                className="group inline-flex items-center gap-1.5 mono-sm text-ink transition-colors hover:text-lime"
              >
                Open project
                <ArrowUpRight
                  size={12}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              {front.link && (
                <a
                  href={front.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-sm text-dim transition-colors hover:text-ink"
                >
                  Live site
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div
            ref={deckRef}
            role="group"
            aria-roledescription="carousel"
            aria-label="Featured projects deck"
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="relative aspect-square w-full max-w-[460px] rounded-xl outline-offset-4"
          >
            <p className="sr-only" aria-live="polite">
              {`${front.title} — ${front.category}`}
            </p>

            {cards.map((project, i) => {
              const isFront = i === 0;
              return (
                <div
                  key={project.id}
                  className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2 select-none overflow-hidden rounded-xl border border-hair bg-panel shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
                  style={{
                    zIndex: cards.length - i,
                    transform: `translate(-50%, -50%) translate(${i * 9}px, ${i * -6}px) rotate(${i * 1.7}deg) scale(${1 - i * 0.035})`,
                    opacity: 1 - i * 0.08,
                    touchAction: "pan-y",
                  }}
                >
                  {isFront ? (
                    <motion.div
                      style={{ x, rotate }}
                      onPointerDown={onPointerDown}
                      onPointerMove={onPointerMove}
                      onPointerUp={endDrag}
                      onPointerCancel={endDrag}
                      className={`cursor-grab ${dragging ? "cursor-grabbing" : ""}`}
                    >
                      <img
                        src={project.image}
                        alt={`${project.title} — ${project.category}`}
                        draggable={false}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <div className="flex items-end justify-between gap-4 p-5">
                        <div>
                          <p className="mono-sm text-muted">{project.tag}</p>
                          <p className="mt-1.5 font-display text-lg font-bold tracking-[-0.02em] text-ink">
                            {project.title}
                          </p>
                        </div>
                        <span className="mono-sm shrink-0 text-dim">
                          {String(projects.findIndex((p) => p.id === project.id) + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <img
                        src={project.image}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <div className="h-[74px]" />
                    </>
                  )}
                </div>
              );
            })}

            {flying && (
              <div className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center">
                <motion.div
                  key={`${flying.project.id}-fly`}
                  className="w-[86%] overflow-hidden rounded-xl border border-hair bg-panel shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
                  initial={{ x: 0, rotate: 0, opacity: 1 }}
                  animate={{
                    x: flying.dir * flyDistance,
                    rotate: flying.dir * 18,
                    opacity: 0.85,
                  }}
                  transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img
                    src={flying.project.image}
                    alt=""
                    aria-hidden="true"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="h-[74px]" />
                </motion.div>
              </div>
            )}
          </div>

          <div className="mt-7 flex items-center gap-2" aria-hidden="true">
            {projects.map((project) => {
              const isActive = project.id === order[0];
              return (
                <span
                  key={project.id}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    isActive ? "w-6 bg-lime" : "w-1.5 bg-hair"
                  }`}
                />
              );
            })}
          </div>

          <p className="mt-3 mono-sm text-dim">Drag · Arrow keys · Controls</p>
        </div>
      </div>
    </section>
  );
}
