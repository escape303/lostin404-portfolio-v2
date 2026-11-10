import { motion, useReducedMotion } from "motion/react";
import type { ElementType, ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Seconds between characters. */
  stagger?: number;
  /** Seconds for one character to resolve. */
  duration?: number;
  delay?: number;
  children?: ReactNode;
};

type SegmenterCtor = new (
  locale?: string,
  options?: { granularity: "grapheme" },
) => { segment: (input: string) => Iterable<{ segment: string }> };

/** Grapheme-aware split so emoji and combined marks never break apart. */
function splitGraphemes(word: string): string[] {
  const Segmenter = (Intl as unknown as { Segmenter?: SegmenterCtor }).Segmenter;
  if (Segmenter) {
    const segmenter = new Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(word), (entry) => entry.segment);
  }
  return Array.from(word);
}

/**
 * Characters resolve individually out of a soft blur: 0.5 → 1 opacity,
 * 5px → 0 blur, 8px → 0 lift. Viewport-triggered once, word-aware so
 * headings still wrap normally, and fully visible under reduced motion.
 */
export function CharacterBlurReveal({
  text,
  as: Tag = "span",
  className = "",
  stagger = 0.02,
  duration = 0.7,
  delay = 0.05,
  children,
}: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return (
      <Tag className={className}>
        {text}
        {children}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="inline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {words.map((word, w) => (
          <span key={`${word}-${w}`}>
            <span className="inline-block whitespace-nowrap">
              {splitGraphemes(word).map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  className="inline-block will-change-[opacity,filter,transform]"
                  variants={{
                    hidden: { opacity: 0.5, filter: "blur(5px)", y: 8 },
                    visible: {
                      opacity: 1,
                      filter: "blur(0px)",
                      y: 0,
                      transition: { duration, ease: EASE },
                    },
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            {w < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
      {children}
    </Tag>
  );
}
