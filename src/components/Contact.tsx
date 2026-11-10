import { Link } from "react-router-dom";
import { brand, contact } from "../data/site";
import { CharacterBlurReveal } from "./CharacterBlurReveal";
import { ArrowUpRight, MailIcon, PhoneIcon, WhatsAppIcon } from "./icons";

/** Contact actions and closing line. The page supplies the masthead. */
export function ContactBlock() {
  return (
    <section className="relative isolate overflow-hidden bg-deep pb-16 pt-14 sm:pb-20 sm:pt-16">
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="shell relative">
        <CharacterBlurReveal
          as="h2"
          text="Start a project."
          className="block max-w-[18ch] font-display text-[clamp(1.9rem,5vw,3.4rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink"
        />
        <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-muted">
          {contact.invite}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={`mailto:${contact.email}`} className="btn-primary group">
            Let&apos;s Connect
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
          <Link to="/work" className="btn-ghost">
            Explore Work
          </Link>
        </div>

        <div className="mt-14 grid gap-3 border-t border-hair pt-8 sm:grid-cols-3">
          <a
            href={`mailto:${contact.email}`}
            className="group flex items-start gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-hair"
          >
            <MailIcon size={16} className="mt-0.5 shrink-0 text-accentSoft" />
            <span>
              <span className="block mono-sm text-dim">Email</span>
              <span className="mt-1 block text-sm text-ink group-hover:text-white">
                {contact.email}
              </span>
            </span>
          </a>

          <a
            href={contact.phoneHref}
            className="group flex items-start gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-hair"
          >
            <PhoneIcon size={16} className="mt-0.5 shrink-0 text-accentSoft" />
            <span>
              <span className="block mono-sm text-dim">Phone</span>
              <span className="mt-1 block text-sm text-ink group-hover:text-white">
                {contact.phone}
              </span>
            </span>
          </a>

          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-hair"
          >
            <WhatsAppIcon size={16} className="mt-0.5 shrink-0 text-accentSoft" />
            <span>
              <span className="block mono-sm text-dim">WhatsApp</span>
              <span className="mt-1 block text-sm text-ink group-hover:text-white">
                Message directly
              </span>
            </span>
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-hairsoft pt-5">
          <p className="mono-sm text-dim">{brand.slogan}</p>
          <p className="mono-sm text-dim">
            {contact.phone} — {brand.location}
          </p>
        </div>
      </div>
    </section>
  );
}
