import { motion, useReducedMotion } from "motion/react";
import React from "react";

const cn = (classes: string) => classes;

export { cn };

export interface FanCardItem {
  id: string;
  src: string;
  title: string;
  alt?: string;
  description?: string;
}

export interface CardHandGalleryProps {
  cards: readonly FanCardItem[];
  activeId?: string;
  cardWidth?: number;
  className?: string;
  defaultActiveId?: string;
  onSelect?: (card: FanCardItem) => void;
}

const SELECT_VELOCITY = -600;
const HAND_SCALE = 0.72;

function fanTransform(index: number, count: number, spacing: number) {
  const offset = index - (count - 1) / 2;
  const stepDeg = count > 1 ? Math.min(9, 46 / (count - 1)) : 0;
  const rotate = offset * stepDeg;
  return { rotate, x: offset * spacing, y: Math.abs(rotate) * 1.9 };
}

export function CardHandGallery({
  cards,
  activeId: controlledActiveId,
  cardWidth = 224,
  className,
  defaultActiveId,
  onSelect,
}: CardHandGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const fanRef = React.useRef<HTMLDivElement>(null);
  const draggingRef = React.useRef(false);
  const [fanWidth, setFanWidth] = React.useState<number | null>(null);
  const [internalActiveId, setInternalActiveId] = React.useState(
    defaultActiveId ?? cards[0]?.id
  );
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [canDrag, setCanDrag] = React.useState(false);

  const requestedId = controlledActiveId ?? internalActiveId;
  const activeId =
    cards.some((c: FanCardItem) => c.id === requestedId) ? requestedId : cards[0]?.id;
  const activeIndex = cards.findIndex((c: FanCardItem) => c.id === activeId);
  const activeCard = cards[activeIndex];

  React.useEffect(() => {
    setCanDrag(!window.matchMedia("(pointer: coarse)").matches);
  }, []);

  React.useEffect(() => {
    const node = fanRef.current;
    if (!node) return;
    const observer = new ResizeObserver(() => {
      if (node) setFanWidth(node.getBoundingClientRect().width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [fanRef]);

  const width = fanWidth === null ? cardWidth : Math.min(cardWidth, fanWidth * 0.55);
  const height = Math.max(0, width * 1.4);
  const baseBottom = height * 0.09;
  const hoverLift = height * 0.34;
  const activeLift = height * 0.62;
  const selectDistance = -height * 0.5;

  const handCards = cards.filter((c: FanCardItem) => c.id !== activeId);
  const hoveredIndex = hoveredId
    ? handCards.findIndex((c: FanCardItem) => c.id === hoveredId)
    : -1;

  const maxOffset = (handCards.length - 1) / 2;
  const preferredSpacing = width * (handCards.length > 5 ? 0.43 : 0.52);
  // Keep the outer edges of the fan inside the container so the deck never
  // pushes the page into horizontal scroll on narrow screens.
  const fitSpacing =
    fanWidth === null
      ? preferredSpacing
      : Math.max(0, (fanWidth - width) / (2 * Math.max(1, maxOffset)));
  const fanSpacing =
    maxOffset > 0
      ? Math.min(preferredSpacing, Math.max(width * 0.06, fitSpacing))
      : 0;

  const cardTransition = shouldReduceMotion
    ? { duration: 0.16, ease: "easeOut" as const }
    : { damping: 30, mass: 0.9, stiffness: 340, type: "spring" as const };
  const textTransition = { duration: shouldReduceMotion ? 0 : 0.32 };
  const textOffset = shouldReduceMotion ? 0 : 10;

  function clearHover(id: string) {
    setHoveredId((h) => (h === id ? null : h));
  }

  function selectCard(card: FanCardItem) {
    if (card.id === activeId) return;
    clearHover(card.id);
    if (controlledActiveId === undefined) setInternalActiveId(card.id);
    onSelect?.(card);
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-6 lg:gap-10 " +
          (className ?? "")
      )}
    >
      <div className="w-full shrink-0 text-center sm:w-40 sm:text-right md:w-48 lg:w-56">
        {activeCard && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: textOffset }}
            key={activeCard.id}
            transition={textTransition}
          >
            <p className="font-mono text-muted-foreground text-xs tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-balance font-semibold text-2xl text-foreground leading-tight tracking-tight lg:text-3xl">
              {activeCard.title}
            </h3>
          </motion.div>
        )}
      </div>

      <div
        className="relative w-full min-w-0 flex-1"
        ref={fanRef}
        style={{ minHeight: height * 1.78, overflowX: "clip" }}
      >
        {cards.map((card: FanCardItem) => {
          const isActive = card.id === activeId;
          const handIndex = handCards.findIndex((c: FanCardItem) => c.id === card.id);
          let slot: { rotate: number; scale: number; x: number; y: number };
          let lift: { rotate: number; scale: number; x: number; y: number } =
            { rotate: 0, scale: 1, x: 0, y: 0 };
          let zIndex: number;
          if (isActive) {
            slot = { rotate: 0, scale: 1, x: 0, y: -activeLift };
            zIndex = 100;
          } else {
            const fan = fanTransform(handIndex, handCards.length, fanSpacing);
            const isHovered = card.id === hoveredId;
            const neighborShift =
              hoveredIndex !== -1 && !isHovered
                ? (Math.sign(handIndex - hoveredIndex) * width * 0.14) /
                  Math.max(1, Math.abs(handIndex - hoveredIndex))
                : 0;
            const dx = neighborShift;
            const dy = isHovered ? -hoverLift - fan.y : 0;
            const rad = (-fan.rotate * Math.PI) / 180;
            slot = { rotate: fan.rotate, scale: HAND_SCALE, x: fan.x, y: fan.y };
            lift = {
              rotate: isHovered ? -fan.rotate * 0.45 : 0,
              scale: isHovered ? 1.08 : 1,
              x: (dx * Math.cos(rad) - dy * Math.sin(rad)) / HAND_SCALE,
              y: (dx * Math.sin(rad) + dy * Math.cos(rad)) / HAND_SCALE,
            };
            zIndex = isHovered ? 60 : 10 + handIndex;
          }
          return (
            <motion.div
              animate={slot}
              className="absolute left-1/2"
              initial={false}
              key={card.id}
              onHoverEnd={() => clearHover(card.id)}
              onHoverStart={() => {
                if (!isActive) setHoveredId(card.id);
              }}
              style={{ bottom: baseBottom, marginLeft: -width / 2, zIndex }}
              transition={cardTransition}
            >
              <motion.div animate={lift} initial={false} transition={cardTransition}>
                <motion.button
                  aria-label={card.title}
                  aria-pressed={isActive}
                  className={cn(
                    "block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
                      (isActive ? "cursor-default" : "cursor-grab active:cursor-grabbing")
                  )}
                  drag={canDrag && !isActive ? "y" : false}
                  dragConstraints={{ bottom: 0, top: -height * 1.65 }}
                  dragElastic={0.12}
                  dragSnapToOrigin
                  onBlur={() => clearHover(card.id)}
                  onClick={() => {
                    if (draggingRef.current) {
                      draggingRef.current = false;
                      return;
                    }
                    selectCard(card);
                  }}
                  onDragEnd={(_event, info) => {
                    if (info.offset.y < selectDistance || info.velocity.y < SELECT_VELOCITY)
                      selectCard(card);
                  }}
                  onDragStart={() => {
                    draggingRef.current = true;
                  }}
                  onFocus={() => {
                    if (!isActive) setHoveredId(card.id);
                  }}
                  onPointerDown={() => {
                    draggingRef.current = false;
                  }}
                  type="button"
                >
                  <img
                    alt={card.alt ?? "Photograph"}
                    className="aspect-[5/7] select-none rounded-xl border border-border bg-muted object-cover shadow-lg"
                    draggable={false}
                    src={card.src}
                    style={{ width }}
                  />
                </motion.button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div
        aria-live="polite"
        className="w-full shrink-0 text-center sm:w-40 sm:text-left md:w-48 lg:w-56"
      >
        {activeCard?.description && (
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-pretty text-muted-foreground text-sm leading-relaxed"
            initial={{ opacity: 0, y: textOffset }}
            key={activeCard.id}
            transition={textTransition}
          >
            {activeCard.description}
          </motion.p>
        )}
      </div>
    </div>
  );
}
