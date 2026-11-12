import { useMemo, useRef } from "react";
import { usePageMeta } from "../lib/usePageMeta";
import { PageHeader } from "../components/PageHeader";
import { AboutProfile } from "../components/About";
import { Statement } from "../components/Statement";
import { Toolkit } from "../components/Toolkit";
import { CardHandGallery } from "../components/ui/card-hand-gallery";
import { aboutPhotos } from "../data/aboutPhotos";

type Card = { id: string; src: string; title: string; alt: string };

export default function AboutPage() {
  usePageMeta({
    title: "About — LOST_IN404",
    description:
      "Suhail is a Dubai-based creative director and designer working across brand visuals, cinematic content, web design and social strategy under LOST_IN404.",
  });

  const cards: readonly Card[] = useMemo(
    () =>
      aboutPhotos.map((photo, i) => ({
        id: photo.id,
        src: photo.src,
        title: `Photo ${String(i + 1).padStart(2, "0")}`,
        alt: photo.alt,
      })),
    []
  );

  const lastSelectedIndex = useRef<number>(0);

  return (
    <div>
      <PageHeader
        kicker="Studio"
        title="About"
        lead="Dubai-based creative professional and design brand specializing in premium brand visuals, cinematic content, web design, and social media strategy."
      />
      <AboutProfile />
      <section className="border-t border-hairsoft bg-[#0B0B0B] py-16 sm:py-24">
        <div className="shell">
          <h2 id="beyond-the-frame" className="mono text-dim">
            Beyond the frame
          </h2>
          <p className="mt-4 max-w-[34ch] font-display text-[clamp(1.25rem,2.6vw,1.85rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink/90">
            A personal archive — the moments between the briefs.
          </p>
          <div className="mt-10 sm:mt-14">
            <CardHandGallery
              cards={cards}
              onSelect={(card) => {
                const index = cards.findIndex((c) => c.id === card.id);
                if (index >= 0 && index !== lastSelectedIndex.current) {
                  lastSelectedIndex.current = index;
                  announce(`Viewing photo ${String(index + 1).padStart(2, "0")} of ${String(cards.length).padStart(2, "0")}`);
                }
              }}
            />
            <AnnounceLive />
          </div>
        </div>
      </section>
      <Statement />
      <Toolkit />
    </div>
  );
}

function announce(message: string) {
  const live = document.getElementById("card-gallery-live");
  if (live) {
    live.textContent = message;
    setTimeout(() => {
      if (live.textContent === message) live.textContent = "";
    }, 2000);
  }
}

function AnnounceLive() {
  return (
    <span
      id="card-gallery-live"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
