import { Link } from "react-router-dom";
import { brand, contact, routes, socials } from "../data/site";

export function Footer() {
  const year = 2026;

  return (
    <footer className="relative overflow-hidden border-t border-hair bg-deep">
      <div className="shell pt-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="font-display text-base font-bold text-ink">
              {brand.wordmark}
              <span className="text-accent">.</span>
            </Link>
            <p className="mt-3 max-w-[26ch] text-[13px] leading-relaxed text-muted">
              {brand.role} — {brand.location}
            </p>
            <p className="mt-4 font-mono text-[10px] tracking-[0.18em] text-lime">
              {brand.signature}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="mono-sm text-dim">Pages</p>
            <ul className="mt-4 space-y-2">
              {routes.map((route) => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    className="text-[13px] text-muted transition-colors hover:text-ink"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mono-sm text-dim">Follow</p>
            <ul className="mt-4 space-y-2">
              {socials
                .filter((s) => s.icon !== "whatsapp")
                .map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-muted transition-colors hover:text-ink"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <p className="mono-sm text-dim">Contact</p>
            <ul className="mt-4 space-y-2 text-[13px]">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-muted transition-colors hover:text-ink"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.phoneHref}
                  className="text-muted transition-colors hover:text-ink"
                >
                  {contact.phone}
                </a>
              </li>
            </ul>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-1.5 mono-sm text-ink transition-colors hover:text-lime"
            >
              Back to home
              <span aria-hidden="true">↑</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-hair py-5">
          <p className="mono-sm text-dim">
            © {year} {brand.wordmark}. All rights reserved.
          </p>
          <p className="mono-sm text-dim">Dubai, UAE · Available for work</p>
        </div>
      </div>

      {/* Cropped signature wordmark */}
      <div aria-hidden="true" className="relative select-none">
        <p className="translate-y-[18%] whitespace-nowrap text-center font-display text-[9.6vw] font-extrabold leading-[0.72] tracking-[-0.05em] text-ink/[0.08]">
          {brand.wordmark}
        </p>
      </div>
    </footer>
  );
}
