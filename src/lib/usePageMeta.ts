import { useEffect } from "react";

type Meta = { title: string; description: string };

function upsert(attr: "name" | "property", key: string, value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

/** Keeps the document title, description and social tags in sync per route. */
export function usePageMeta({ title, description }: Meta) {
  useEffect(() => {
    document.title = title;
    upsert("name", "description", description);
    upsert("property", "og:title", title);
    upsert("property", "og:description", description);
    upsert("name", "twitter:title", title);
    upsert("name", "twitter:description", description);
  }, [title, description]);
}
