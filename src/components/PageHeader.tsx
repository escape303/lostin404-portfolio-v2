import type { ReactNode } from "react";
import { CharacterBlurReveal } from "./CharacterBlurReveal";

type Props = {
  kicker: string;
  title: string;
  lead?: string;
  children?: ReactNode;
};

/** Shared page masthead — the character blur reveal carries the page identity. */
export function PageHeader({ kicker, title, lead, children }: Props) {
  return (
    <header className="relative isolate overflow-hidden border-b border-hairsoft bg-ground pb-12 pt-28 sm:pb-16 sm:pt-36">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]"
        aria-hidden="true"
      />
      <div className="shell relative">
        <p className="mono text-dim">{kicker}</p>
        <CharacterBlurReveal
          as="h1"
          text={title}
          delay={0.15}
          className="mt-5 block max-w-[16ch] font-display text-[clamp(2.4rem,9vw,5.4rem)] font-extrabold leading-[0.9] tracking-[-0.045em] text-ink"
        />
        {lead && (
          <p className="mt-6 max-w-[54ch] text-[15px] leading-relaxed text-muted sm:text-base">
            {lead}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
