import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { WorkGallery } from "../components/WorkGallery";
import { Deck } from "../components/Deck";
import { ArrowUpRight } from "../components/icons";
import { projects } from "../data/site";
import { usePageMeta } from "../lib/usePageMeta";

export default function WorkPage() {
  usePageMeta({
    title: "Work — LOST_IN404 Portfolio",
    description:
      "Selected brand, web and social projects by LOST_IN404: LACABITE UAE, MealsKart, AAJEL Business, Nelta Tech and the LOST_IN404 identity system.",
  });

  const tags = useMemo(
    () => ["ALL", ...Array.from(new Set(projects.map((project) => project.tag)))],
    [],
  );
  const [active, setActive] = useState("ALL");

  const items = active === "ALL" ? projects : projects.filter((p) => p.tag === active);

  return (
    <>
      <PageHeader
        kicker="Portfolio"
        title="Selected Work"
        lead="Brand systems, websites and social work built for UAE businesses — each one designed, written and shipped end to end."
      />

      <section className="bg-ground py-14 sm:py-20">
        <div className="shell">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
              {tags.map((tag) => {
                const isActive = tag === active;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActive(tag)}
                    aria-pressed={isActive}
                    className={`rounded-full border px-4 py-2 mono-sm transition-colors duration-300 ${
                      isActive
                        ? "border-ink bg-ink text-ground"
                        : "border-hair text-muted hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <p className="mono-sm text-dim" aria-live="polite">
              {String(items.length).padStart(2, "0")} projects
            </p>
          </div>

          <div className="mt-9">
            <WorkGallery items={items} />
          </div>

          <div className="mt-12 flex justify-center">
            <Link to="/contact" className="btn-ghost group">
              Start a Project
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      <Deck />
    </>
  );
}
