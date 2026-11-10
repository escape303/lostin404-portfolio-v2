import { PageHeader } from "../components/PageHeader";
import { AboutProfile } from "../components/About";
import { Statement } from "../components/Statement";
import { Toolkit } from "../components/Toolkit";
import { usePageMeta } from "../lib/usePageMeta";

export default function AboutPage() {
  usePageMeta({
    title: "About — LOST_IN404",
    description:
      "Suhail is a Dubai-based creative director and designer working across brand visuals, cinematic content, web design and social strategy under LOST_IN404.",
  });

  return (
    <>
      <PageHeader
        kicker="Studio"
        title="About"
        lead="Dubai-based creative professional and design brand specializing in premium brand visuals, cinematic content, web design, and social media strategy."
      />
      <AboutProfile />
      <Statement />
      <Toolkit />
    </>
  );
}
