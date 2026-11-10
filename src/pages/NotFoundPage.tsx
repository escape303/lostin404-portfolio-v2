import { Link } from "react-router-dom";
import { CharacterReveal } from "../components/CharacterReveal";
import { usePageMeta } from "../lib/usePageMeta";

export default function NotFoundPage() {
  usePageMeta({
    title: "Page not found — LOST_IN404",
    description: "This page could not be found. Return to the LOST_IN404 home page or browse the work.",
  });

  return (
    <section className="flex min-h-[70svh] items-center bg-ground py-24">
      <div className="shell">
        <p className="mono text-dim">Error 404</p>
        <h1 className="mt-4 font-display text-[clamp(3rem,16vw,9rem)] font-extrabold leading-[0.85] tracking-[-0.05em] text-ink">
          <CharacterReveal text="404" />
        </h1>
        <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-muted">
          Lost in the void. The page you were looking for doesn&apos;t exist — but the work does.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="btn-primary">
            Back home
          </Link>
          <Link to="/work" className="btn-ghost">
            Browse work
          </Link>
        </div>
      </div>
    </section>
  );
}
