import { Link, useParams } from "react-router-dom";
import { CharacterReveal } from "../components/CharacterReveal";
import { Reveal } from "../components/Reveal";
import { ArrowLeft, ArrowUpRight } from "../components/icons";
import { getProject, nextProject } from "../data/site";
import { usePageMeta } from "../lib/usePageMeta";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const project = getProject(slug);

  usePageMeta({
    title: project
      ? `${project.title} — LOST_IN404`
      : "Project not found — LOST_IN404",
    description: project
      ? project.description
      : "This project could not be found. Browse the LOST_IN404 portfolio instead.",
  });

  if (!project) {
    return (
      <section className="bg-ground pb-24 pt-32">
        <div className="shell">
          <p className="mono text-dim">404</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink">
            This project isn&apos;t here.
          </h1>
          <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-muted">
            The link may be out of date. Every live project is listed on the work page.
          </p>
          <Link to="/work" className="btn-primary mt-7">
            Back to work
          </Link>
        </div>
      </section>
    );
  }

  const next = nextProject(project.id);

  return (
    <article className="bg-ground pb-20">
      <div className="shell pt-28 sm:pt-32">
        <Link
          to="/work"
          className="group inline-flex items-center gap-2 mono-sm text-dim transition-colors hover:text-ink"
        >
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          All work
        </Link>

        <p className="mono mt-8 text-dim">
          {project.tag} — {project.category}
        </p>
        <h1 className="mt-4 max-w-[18ch] font-display text-[clamp(2.2rem,7.6vw,4.8rem)] font-extrabold leading-[0.92] tracking-[-0.045em] text-ink">
          <CharacterReveal text={project.title} delay={0.1} />
        </h1>
        <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group"
            >
              Visit live site
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          )}
          <Link to="/contact" className="btn-ghost">
            Start a similar project
          </Link>
        </div>
      </div>

      <div className="shell mt-12">
        <Reveal>
          <div className="overflow-hidden rounded-xl border border-hair bg-panel">
            <img
              src={project.image}
              alt={`${project.title} — ${project.category}`}
              className="w-full object-cover"
            />
          </div>
        </Reveal>
      </div>

      <div className="shell mt-12 grid gap-8 border-t border-hair pt-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="mono text-dim">Overview</p>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-muted">
            {project.description}
          </p>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-muted">
            {project.link
              ? "Built and maintained end to end by LOST_IN404 — art direction, interface design and front-end development."
              : "Part of the LOST_IN404 identity practice — art direction, typography and social creative produced in-house."}
          </p>
        </div>

        <dl className="lg:col-span-5 lg:pl-8">
          <div className="flex items-center justify-between border-t border-hairsoft py-3 first:border-t-0 first:pt-0">
            <dt className="mono-sm text-dim">Category</dt>
            <dd className="text-sm text-ink">{project.category}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-hairsoft py-3">
            <dt className="mono-sm text-dim">Discipline</dt>
            <dd className="text-sm text-ink">{project.tag}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-hairsoft py-3">
            <dt className="mono-sm text-dim">Status</dt>
            <dd className="flex items-center gap-2 text-sm text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden="true" />
              {project.link ? "Live" : "In portfolio"}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-hairsoft py-3">
            <dt className="mono-sm text-dim">Studio</dt>
            <dd className="text-sm text-ink">LOST_IN404</dd>
          </div>
        </dl>
      </div>

      <div className="shell mt-16">
        <Link
          to={`/work/${next.id}`}
          className="group flex flex-col gap-4 border-t border-hair pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="mono-sm text-dim">Next project</p>
            <p className="mt-2 font-display text-2xl font-bold tracking-[-0.03em] text-ink transition-colors group-hover:text-lime">
              {next.title}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <img
              src={next.image}
              alt=""
              aria-hidden="true"
              className="h-16 w-24 rounded-lg border border-hair object-cover"
              loading="lazy"
            />
            <ArrowUpRight
              size={20}
              className="text-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
            />
          </div>
        </Link>
      </div>
    </article>
  );
}
