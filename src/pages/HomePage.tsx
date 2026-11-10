import { Link } from "react-router-dom";
import { Hero } from "../components/Hero";
import { Portal } from "../components/Portal";
import { HorizontalManifesto } from "../components/HorizontalManifesto";
import { CharacterBlurReveal } from "../components/CharacterBlurReveal";
import { WorkGallery } from "../components/WorkGallery";
import { Reveal } from "../components/Reveal";
import { ArrowUpRight } from "../components/icons";
import { brand, projects } from "../data/site";
import { usePageMeta } from "../lib/usePageMeta";

const links = [
  { label: "About the studio", to: "/about", text: brand.role },
  { label: "Services", to: "/services", text: "Brand, web, cinema, social" },
  { label: "Start a project", to: "/contact", text: "Dubai, UAE — worldwide" },
];

export default function HomePage() {
  usePageMeta({
    title: "LOST_IN404 — Dubai Creative Director & Design Brand",
    description:
      "LOST_IN404 is a Dubai-based creative professional specializing in premium brand visuals, cinematic content, web design, and social media strategy.",
  });

  return (
    <>
      <Hero />
      <Portal />

      <section className="border-t border-hairsoft bg-ground py-16 sm:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mono text-dim">Selected work</p>
              <CharacterBlurReveal
                as="h2"
                text="Three of six."
                className="mt-4 block font-display text-[clamp(1.9rem,4.8vw,3.6rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink"
              />
            </div>
            <Link
              to="/work"
              className="group inline-flex items-center gap-2 mono-sm text-ink transition-colors hover:text-lime"
            >
              All work
              <ArrowUpRight
                size={12}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-10">
            <WorkGallery items={projects.slice(0, 3)} />
          </div>
        </div>
      </section>

      <section className="border-t border-hairsoft bg-ground py-16 sm:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mono text-dim">The practice</p>
            <CharacterBlurReveal
              as="h2"
              text={brand.slogan}
              stagger={0.018}
              className="mt-4 block max-w-[20ch] font-display text-[clamp(1.8rem,4.2vw,3rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink"
            />
            <p className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-muted">
              {brand.intro}
            </p>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-muted">
              {brand.philosophy}
            </p>
          </div>

          <div className="lg:col-span-5">
            <ul className="border-t border-hair">
              {links.map((link, i) => (
                <Reveal as="li" key={link.to} delay={i * 0.06} className="block">
                  <Link
                    to={link.to}
                    className="group flex items-center justify-between gap-4 border-b border-hairsoft py-5"
                  >
                    <span>
                      <span className="block font-display text-lg font-semibold text-ink transition-colors group-hover:text-lime">
                        {link.label}
                      </span>
                      <span className="mt-1 block mono-sm text-dim">{link.text}</span>
                    </span>
                    <ArrowUpRight
                      size={15}
                      className="shrink-0 text-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                    />
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <HorizontalManifesto />
    </>
  );
}
