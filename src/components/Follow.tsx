import { socials } from "../data/site";
import { Reveal } from "./Reveal";
import { InstagramIcon, PinterestIcon, SpotifyIcon, WhatsAppIcon, ArrowUpRight } from "./icons";

const iconFor = {
  instagram: InstagramIcon,
  pinterest: PinterestIcon,
  spotify: SpotifyIcon,
  whatsapp: WhatsAppIcon,
  mail: ArrowUpRight,
} as const;

export function Follow() {
  return (
    <section className="relative border-t border-hairsoft bg-ground py-16 sm:py-20">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono text-dim">Follow my work</p>
            <h2 className="mt-3 font-display text-[clamp(1.6rem,3.6vw,2.6rem)] font-extrabold tracking-[-0.03em] text-ink">
              New work, posted first.
            </h2>
          </div>
          <p className="mono-sm text-dim">Instagram · Pinterest · Spotify</p>
        </div>

        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {socials.map((social, i) => {
            const Icon = iconFor[social.icon];
            return (
              <Reveal key={social.label} delay={i * 0.05}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-center justify-between gap-4 rounded-xl border border-hair bg-panel/60 px-5 py-4 transition-colors duration-300 hover:border-ink/30"
                  aria-label={`${social.label} — ${social.handle} (opens in a new tab)`}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairsoft text-ink transition-colors duration-300 group-hover:border-lime/40 group-hover:text-lime">
                      <Icon size={17} />
                    </span>
                    <span>
                      <span className="block font-display text-sm font-semibold text-ink">
                        {social.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-muted">{social.handle}</span>
                    </span>
                  </span>
                  <ArrowUpRight
                    size={13}
                    className="shrink-0 text-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
