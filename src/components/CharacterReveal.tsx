import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

/**
 * Signature heading move: every grapheme sits inside its own clipping box and
 * slides DOWN out of the mask (not a fade, not an up-slide).
 *
 * Words are separate inline-blocks so multi-word headings can still wrap at
 * spaces without breaking a letter's mask. The heading's box is unchanged from
 * first paint, so nothing reflows.
 */
export function CharacterReveal({ text, className = "", delay = 0.18, stagger = 0.045 }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, i) => (
              <span
                key={`${char}-${i}`}
                className="inline-block overflow-hidden align-bottom"
                style={{ paddingBottom: "0.14em", marginBottom: "-0.14em" }}
              >
                <motion.span
                  className="inline-block will-change-transform"
                  initial={{ y: "-110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.9,
                    delay: delay + (w * 3 + i) * stagger,
                    ease: EASE,
                  }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}
