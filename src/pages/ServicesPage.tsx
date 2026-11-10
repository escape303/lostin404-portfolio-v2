import { PageHeader } from "../components/PageHeader";
import { ServicesGrid } from "../components/Services";
import { Ribbon } from "../components/Ribbon";
import { usePageMeta } from "../lib/usePageMeta";

export default function ServicesPage() {
  usePageMeta({
    title: "Services — LOST_IN404",
    description:
      "Web design and development, premium brand visuals, social media management and UAE business setup support from LOST_IN404 in Dubai.",
  });

  return (
    <>
      <PageHeader
        kicker="Capabilities"
        title="Services"
        lead="Four connected practices — brand systems, web builds, cinematic content and social strategy — delivered as one creative direction."
      />
      <ServicesGrid />
      <Ribbon />
    </>
  );
}
