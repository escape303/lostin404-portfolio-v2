import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import type { Project } from "../data/site";
import { ArrowUpRight } from "./icons";

const EASE = [0.16, 1, 0.3, 1] as const;

function ProjectCard({
  project,
  index,
  wide,
}: {
  project: Project;
  index: number;
  wide?: boolean;
}) {
  const reduce = useReducedMotion();

  const motionProps = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15, margin: "0px 0px -6% 0px" },
        transition: { duration: 0.7, delay: (index % 2) * 0.08, ease: EASE },
      };

  return (
    <motion.article {...motionProps} className={wide ? "md:col-span-2" : ""}>
      <Link
        to={`/work/${project.id}`}
        className="group relative block overflow-hidden rounded-xl border border-hair bg-panel text-left transition-colors duration-500 hover:border-ink/25"
        aria-label={`${project.title} — view project`}
      >
        <div className="relative overflow-hidden">
          <img
            src={project.image}
            alt={`${project.title} — ${project.category}`}
            loading="lazy"
            decoding="async"
            className={`w-full object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.035] ${
              wide ? "aspect-[16/9]" : "aspect-[4/3]"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/25 to-transparent" />
          <div className="absolute inset-0 bg-accent/0 transition-colors duration-500 group-hover:bg-accent/[0.06]" />

          <span className="absolute left-4 top-4 rounded-full border border-hair bg-ground/60 px-2.5 py-1 mono-sm text-ink/80 backdrop-blur-sm">
            {project.tag}
          </span>

          <span
            aria-hidden="true"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-ground/50 text-ink backdrop-blur-sm transition-all duration-300 ease-editorial group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-lime/50 group-hover:text-lime"
          >
            <ArrowUpRight size={14} />
          </span>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="mono-sm text-muted">{project.category}</p>
            <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.02em] text-ink sm:text-2xl">
              {project.title}
            </h3>
            <p className="mt-2 max-w-[52ch] text-[13px] leading-relaxed text-muted opacity-100 transition-all duration-500 ease-editorial md:max-h-0 md:translate-y-2 md:overflow-hidden md:opacity-0 md:group-hover:max-h-24 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              {project.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function WorkGallery({ items }: { items: Project[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
      {items.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={i}
          wide={Boolean(project.featured) && items.length > 3}
        />
      ))}
    </div>
  );
}
