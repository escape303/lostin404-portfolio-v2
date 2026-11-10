import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Stagger direct children instead of animating the wrapper itself. */
  as?: "div" | "section" | "li" | "span";
};

/**
 * One-shot entrance reveal. Never un-reveals, and is a plain visible
 * element when the visitor prefers reduced motion.
 */
export function Reveal({ children, delay = 0, y = 24, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
};

/** Reveals children in sequence with an 80ms default rhythm. */
export function Stagger({ children, className, stagger = 0.08, delay = 0 }: StaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}
