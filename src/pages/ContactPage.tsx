import { PageHeader } from "../components/PageHeader";
import { ContactBlock } from "../components/Contact";
import { Follow } from "../components/Follow";
import { usePageMeta } from "../lib/usePageMeta";

export default function ContactPage() {
  usePageMeta({
    title: "Contact — LOST_IN404",
    description:
      "Start a project with LOST_IN404 in Dubai. Email lostin404ae@gmail.com, call +971 52 341 2447, or follow the studio on Instagram, Pinterest and Spotify.",
  });

  return (
    <>
      <PageHeader
        kicker="Contact"
        title="Let's make something loud."
        lead="Based in Dubai and available for new projects. Email, phone or WhatsApp — whichever is easiest for you."
      />
      <ContactBlock />
      <Follow />
    </>
  );
}
