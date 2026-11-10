import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { brand, routes } from "../data/site";
import { MenuIcon, CloseIcon, ArrowUpRight } from "./icons";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-editorial ${
        scrolled || open
          ? "border-b border-hair bg-ground/70 backdrop-blur-[16px]"
          : "border-b border-transparent"
      }`}
    >
      <nav className="shell flex h-[62px] items-center justify-between" aria-label="Primary">
        <Link
          to="/"
          className="font-display text-[15px] font-bold tracking-[-0.01em] text-ink transition-colors hover:text-white"
        >
          {brand.wordmark}
          <span className="text-accent">.</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              end={route.path === "/"}
              className={({ isActive }) =>
                `group relative py-1 mono-sm transition-colors duration-300 ${
                  isActive ? "text-ink" : "text-muted hover:text-ink"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {route.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-lime transition-transform duration-300 ease-editorial ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="group inline-flex items-center gap-1.5 rounded-full border border-hair px-4 py-2 mono-sm text-ink transition-colors duration-300 hover:border-ink/40 hover:text-white"
          >
            Let&apos;s talk
            <ArrowUpRight
              size={12}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-hair text-ink md:hidden"
        >
          {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
        </button>
      </nav>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-hair bg-ground px-5 pb-7 pt-5 md:hidden"
      >
        <ul className="flex flex-col">
          {routes.map((route) => (
            <li key={route.path} className="border-b border-hairsoft">
              <NavLink
                to={route.path}
                end={route.path === "/"}
                className={({ isActive }) =>
                  `flex min-h-[52px] items-center justify-between font-display text-xl ${
                    isActive ? "text-lime" : "text-ink"
                  }`
                }
              >
                {route.label}
                <ArrowUpRight size={16} className="text-dim" />
              </NavLink>
            </li>
          ))}
        </ul>
        <Link
          to="/contact"
          className="mt-6 flex min-h-[48px] items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-ground"
        >
          Let&apos;s talk
        </Link>
      </div>
    </header>
  );
}
